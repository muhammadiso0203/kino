import { Scene, SceneEnter, Ctx, On, Hears } from 'nestjs-telegraf';
import { MovieService } from '../../movie/movie.service';
import { Markup } from 'telegraf';
import { adminKeyboard } from 'src/common/utils/keyboard.util';

@Scene('add_movie_scene')
export class AddMovieScene {
  constructor(private readonly movieService: MovieService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: any) {
    await ctx.reply('🎬 Kino qo\'shish: Menga kino kodini yuboring', Markup.keyboard([['❌ Bekor qilish']]).resize());
    ctx.scene.session.movieData = {};
  }

  @Hears('❌ Bekor qilish')
  async cancel(@Ctx() ctx: any) {
    await ctx.reply('❌ Bekor qilindi.', adminKeyboard);
    await ctx.scene.leave();
  }

  @On('text')
  async onCode(@Ctx() ctx: any) {
    if (ctx.scene.session.movieData?.code) return; 
    
    const text = ctx.message.text;
    if (text === '❌ Bekor qilish') return;

    if (!/^\d+$/.test(text)) {
      await ctx.reply("❌ Kino kodi faqat raqamlardan iborat bo'lishi kerak. Iltimos, qayta yuboring.");
      return;
    }

    ctx.scene.session.movieData = { code: text };
    await ctx.reply(`Kino kodi qabul qilindi: ${text}\nEndi menga video yoki faylni yuboring.`);
  }

  @On(['video', 'document'])
  async onVideo(@Ctx() ctx: any) {
    if (!ctx.scene.session.movieData?.code) {
      return ctx.reply('Kino kodini yuborish majburiy');
    }

    const code = ctx.scene.session.movieData.code;
    const fileId = ctx.message.video?.file_id || ctx.message.document?.file_id;

    try {
      await this.movieService.addMovie(code, fileId);
      await ctx.reply(`✅ Kino muvaffaqiyatli qo'shildi!\nKodi: ${code}`, adminKeyboard);
    } catch (e: any) {
      await ctx.reply(e.message || 'Xatolik yuz berdi.', adminKeyboard);
    }
    
    await ctx.scene.leave();
  }
}
