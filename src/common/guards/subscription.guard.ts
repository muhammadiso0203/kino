import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { ChannelService } from '../../modules/channel/channel.service';
import { Markup } from 'telegraf';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly channelService: ChannelService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = TelegrafExecutionContext.create(context);
    const tgContext = ctx.getContext<any>();
    const userId = tgContext.from?.id;

    if (!userId) return false;

    const channels = await this.channelService.getAllChannels();
    if (channels.length === 0) return true;

    const unjoinedChannels = [];

    for (const channel of channels) {
      try {
        const member = await tgContext.telegram.getChatMember(channel.channelId, userId);
        if (member.status === 'left' || member.status === 'kicked') {
          unjoinedChannels.push(channel);
        }
      } catch (error) {
        unjoinedChannels.push(channel);
      }
    }

    if (unjoinedChannels.length > 0) {
      const buttons: any[] = unjoinedChannels.map((ch, index) => {
        let link = ch.inviteLink;
        if (link.startsWith('@')) {
          link = `https://t.me/${link.substring(1)}`;
        } else if (!link.startsWith('http')) {
          link = `https://t.me/${link}`;
        }
        return [Markup.button.url(`Kanal ${index + 1}`, link)];
      });
      buttons.push([Markup.button.callback('✅ Obunani tekshirish', 'check_subscription')]);

      await tgContext.reply('Iltimos, botdan foydalanish uchun quyidagi kanallarga a\'zo bo\'ling:', 
        Markup.inlineKeyboard(buttons)
      );
      return false;
    }

    return true;
  }
}
