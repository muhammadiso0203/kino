import { Update, Start, Ctx, On, Action, Hears, Command, Next } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { MovieService } from '../movie/movie.service';
import { HistoryService } from '../history/history.service';
import { SubscriptionGuard } from '../../common/guards/subscription.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ChannelService } from '../channel/channel.service';
import { adminKeyboard } from '../../common/utils/keyboard.util';
import * as ExcelJS from 'exceljs';

@Update()
export class BotUpdate {
  constructor(
    private readonly userService: UserService,
    private readonly movieService: MovieService,
    private readonly historyService: HistoryService,
    private readonly channelService: ChannelService,
  ) {}

  @Start()
  @UseGuards(SubscriptionGuard)
  async start(@Ctx() ctx: Context) {
    const from = ctx.from;
    if (from) {
      await this.userService.upsertUser(from.id.toString(), from.username);
    }
    await ctx.reply('🎬 Xush kelibsiz! Kino kodini kiriting', Markup.removeKeyboard());
  }

  @Action('check_subscription')
  @UseGuards(SubscriptionGuard)
  async checkSubscription(@Ctx() ctx: Context) {
    await ctx.deleteMessage().catch(() => {});
    await ctx.reply('✅ Obunangiz tasdiqlandi!\n\n🎬 Kino kodini kiriting:');
  }

  @Command('admin')
  @UseGuards(AdminGuard)
  async adminPanel(@Ctx() ctx: Context) {
    await ctx.reply('Admin panelga xush kelibsiz!', adminKeyboard);
  }

  @Hears('📊 Statistika')
  @UseGuards(AdminGuard)
  async getStats(@Ctx() ctx: Context) {
    const usersCount = (await this.userService.getStatistics()).totalUsers;
    const moviesCount = await this.movieService.getStatistics();
    const downloadsCount = await this.historyService.getStatistics();
    
    await ctx.reply(`📊 Statistika:\n\n👥 Foydalanuvchilar: ${usersCount}\n🎬 Kinolar: ${moviesCount}\n📥 Jami yuklashlar: ${downloadsCount}`);
  }

  @Hears('➕ Kino qo\'shish')
  @UseGuards(AdminGuard)
  async enterAddMovie(@Ctx() ctx: any) {
    await ctx.scene.enter('add_movie_scene');
  }

  @Hears('🗑 Kino o\'chirish')
  @UseGuards(AdminGuard)
  async enterDeleteMovie(@Ctx() ctx: any) {
    await ctx.scene.enter('delete_movie_scene');
  }

  @Hears('➕ Kanal qo\'shish')
  @UseGuards(AdminGuard)
  async enterAddChannel(@Ctx() ctx: any) {
    await ctx.scene.enter('add_channel_scene');
  }

  @Hears('🗑 Kanal o\'chirish')
  @UseGuards(AdminGuard)
  async enterDeleteChannel(@Ctx() ctx: any) {
    const channels = await this.channelService.getAllChannels();
    if(channels.length === 0) return ctx.reply('Kanallar yo\'q');
    
    const buttons = channels.map(ch => [Markup.button.callback(`O'chirish: ${ch.channelId}`, `del_ch_${ch.channelId}`)]);
    await ctx.reply('Qaysi kanalni o\'chiramiz?', Markup.inlineKeyboard(buttons));
  }

  @Action(/del_ch_(.+)/)
  @UseGuards(AdminGuard)
  async deleteChannelAction(@Ctx() ctx: any) {
    const channelId = ctx.match[1];
    await this.channelService.removeChannel(channelId);
    await ctx.editMessageText(`✅ Kanal ${channelId} o'chirildi!`);
  }

  @Hears('👤 Foydalanuvchi ma\'lumoti')
  @UseGuards(AdminGuard)
  async enterUserInfo(@Ctx() ctx: any) {
    await ctx.reply('Foydalanuvchi ID sini yuboring: /user <tg_id>');
  }

  @Command('user')
  @UseGuards(AdminGuard)
  async getUserInfo(@Ctx() ctx: any) {
    const text = ctx.message?.text?.split(' ') || [];
    if (text.length < 2) return ctx.reply('ID nomalum. Format: /user <tg_id>');
    const  userId = text[1];
    const user = await this.userService.findByTelegramId(userId);
    if (!user) return ctx.reply('❌ Foydalanuvchi topilmadi.');

    await ctx.reply(`👤 ID: ${user.telegramId}\n📝 Username: ${user.username || 'Yo\'q'}\n📅 Obuna bo'lgan: ${user.joinedAt.toLocaleDateString()}\n📥 Yuklab olgan kinolari: ${user.downloadCount}`);
  }

  @Hears('📋 Kinolar ro\'yxati')
  @UseGuards(AdminGuard)
  async getMoviesList(@Ctx() ctx: any) {
    const loadingMsg = await ctx.reply('⏳ Kinolar ro\'yxati yuklanmoqda...');
    try {
      const movies = await this.movieService.getAllMovies();
      
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id).catch(() => {});

      if (!movies || movies.length === 0) {
        await ctx.reply('❌ Kinolar ro\'yxati bo\'sh.');
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Kinolar');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Kino kodi', key: 'code', width: 20 },
        { header: 'Qo\'shilgan sana', key: 'createdAt', width: 30 }
      ];

      movies.forEach(movie => {
        worksheet.addRow({
          id: movie.id,
          code: movie.code,
          createdAt: movie.createdAt.toLocaleString()
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();

      await ctx.replyWithDocument(
        {
          source: Buffer.from(buffer),
          filename: 'kinolar_royxati.xlsx'
        },
        { caption: `✅ Jami kinolar soni: ${movies.length} ta` }
      );
    } catch (error) {
      console.error('Error exporting movies:', error);
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id).catch(() => {});
      await ctx.reply('❌ Faylni yaratishda xatolik yuz berdi.');
    }
  }

  @On('text')
  @UseGuards(SubscriptionGuard)
  async onText(@Ctx() ctx: any, @Next() next: () => Promise<void>) {
    // Agar foydalanuvchi hozir o'sha sahnada (scene) bo'lsa, text'ni sahnaga uzatamiz!
    if (ctx.session?.__scenes?.current || ctx.scene?.session?.current) {
      return next();
    }

    const text = ctx.message.text;
    
    if (text.startsWith('/')) {
      return next();
    }

    if (["➕ Kino qo'shish", "🗑 Kino o'chirish", "➕ Kanal qo'shish", "🗑 Kanal o'chirish", "📊 Statistika", "👤 Foydalanuvchi ma'lumoti", "📋 Kinolar ro'yxati", "❌ Bekor qilish"].includes(text)) {
      return next();
    }

    if (!/^\d+$/.test(text)) {
      await ctx.reply("❌ Iltimos, kino kodini faqat raqam ko'rinishida yuboring.");
      return;
    }

    const movie = await this.movieService.findMovieByCode(text);
    if (movie) {
      try {
        await ctx.replyWithVideo(movie.fileId, { caption: `🎬 Kino kodi: ${movie.code}` });
      } catch (e) {
        try {
          await ctx.replyWithDocument(movie.fileId, { caption: `🎬 Kino kodi: ${movie.code}` });
        } catch(e2) {
          await ctx.reply('❌ Faylni yuborishda xatolik yuz berdi.');
        }
      }
      
      const user = await this.userService.findByTelegramId(ctx.from.id.toString());
      if (user) {
        await this.historyService.addHistory(user, movie);
        await this.userService.incrementDownload(user.telegramId);
      }
    } else {
      await ctx.reply('❌ Kino topilmadi');
    }
  }

  @On('chat_join_request')
  async onChatJoinRequest(@Ctx() ctx: any) {
    try {
      await ctx.telegram.approveChatJoinRequest(ctx.chatJoinRequest.chat.id, ctx.chatJoinRequest.from.id);
      
      const user = await this.userService.findByTelegramId(ctx.chatJoinRequest.from.id.toString());
      if (user) {
        await ctx.telegram.sendMessage(
          ctx.chatJoinRequest.from.id,
          "✅ Kanalga so'rovingiz tasdiqlandi!\n\n🎬 Endi botdan to'liq foydalanishingiz mumkin, kino kodini yuboring:"
        );
      } else {
        await ctx.telegram.sendMessage(
          ctx.chatJoinRequest.from.id,
          "✅ Kanalga so'rovingiz tasdiqlandi!\n\n🎬 Endi botdan to'liq foydalanishingiz mumkin, /start buyrug'ini bosing."
        );
      }
    } catch (e) {
      console.error('Chat join request approve error:', e);
    }
  }
}
