import { Scene, SceneEnter, Ctx, On, Hears } from 'nestjs-telegraf';
import { ChannelService } from '../../channel/channel.service';
import { Markup } from 'telegraf';
import { adminKeyboard } from '../../../common/utils/keyboard.util';

@Scene('add_channel_scene')
export class AddChannelScene {
  constructor(private readonly channelService: ChannelService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: any) {
    await ctx.reply('Kanal qo\'shish. Menga kanal ID sini yoki username ni yuboring (@kanal_nomi yoki -100...):', Markup.keyboard([['❌ Bekor qilish']]).resize());
    ctx.scene.session.channelData = {};
  }

  @Hears('❌ Bekor qilish')
  async cancel(@Ctx() ctx: any) {
    await ctx.reply('❌ Bekor qilindi.', adminKeyboard);
    await ctx.scene.leave();
  }

  @On('text')
  async onText(@Ctx() ctx: any) {
    if (ctx.message.text === '❌ Bekor qilish') return;

    if (!ctx.scene.session.channelData?.channelId) {
      ctx.scene.session.channelData = { channelId: ctx.message.text };
      await ctx.reply('Yaxshi. Endi menga kanal taklif havolasini (invite link) yuboring:');
    } else {
      let inviteLink = ctx.message.text;
      if (inviteLink.startsWith('@')) {
        inviteLink = `https://t.me/${inviteLink.substring(1)}`;
      } else if (!inviteLink.startsWith('http')) {
        inviteLink = `https://t.me/${inviteLink}`;
      }
      const channelId = ctx.scene.session.channelData.channelId;

      try {
        const chat = await ctx.telegram.getChat(channelId);
        
        if (inviteLink.includes('t.me/') && !inviteLink.includes('+') && !inviteLink.includes('joinchat/')) {
          const expectedUsername = inviteLink.split('t.me/')[1].replace('/', '');
          if (chat.username?.toLowerCase() !== expectedUsername.toLowerCase()) {
            await ctx.reply('❌ Kanal ID va Link bir-biriga mos kelmadi!', adminKeyboard);
            await ctx.scene.leave();
            return;
          }
        }
        
        await this.channelService.addChannel(channelId, inviteLink);
        await ctx.reply('✅ Kanal qo\'shildi!', adminKeyboard);
      } catch (e: any) {
         if (e.response && e.response.error_code === 400) {
           await ctx.reply('❌ Kanal topilmadi yoki bot kanalda admin emas!', adminKeyboard);
         } else {
           await ctx.reply(e.message || 'Xatolik yuz berdi', adminKeyboard);
         }
      }
      await ctx.scene.leave();
    }
  }
}
