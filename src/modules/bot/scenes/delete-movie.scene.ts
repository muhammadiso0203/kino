import { Scene, SceneEnter, Ctx, On, Hears } from 'nestjs-telegraf';
import { MovieService } from '../../movie/movie.service';
import { Markup } from 'telegraf';
import { adminKeyboard } from '../../../common/utils/keyboard.util';

@Scene('delete_movie_scene')
export class DeleteMovieScene {
  constructor(private readonly movieService: MovieService) {}

  @SceneEnter()
  async enter(@Ctx() ctx: any) {
    await ctx.reply('O\'chirish uchun kino kodini yuboring:', Markup.keyboard([['❌ Bekor qilish']]).resize());
  }

  @Hears('❌ Bekor qilish')
  async cancel(@Ctx() ctx: any) {
    await ctx.reply('❌ Bekor qilindi.', adminKeyboard);
    await ctx.scene.leave();
  }

  @On('text')
  async onText(@Ctx() ctx: any) {
    if (ctx.message.text === '❌ Bekor qilish') return;

    const code = ctx.message.text;

    if (!/^\d+$/.test(code)) {
      await ctx.reply("❌ Kino kodi faqat raqamlardan iborat bo'lishi kerak. Iltimos, qayta yuboring.");
      return;
    }

    const deleted = await this.movieService.deleteMovieByCode(code);
    
    if (deleted) {
      await ctx.reply('✅ Kino o\'chirildi.', adminKeyboard);
    } else {
      await ctx.reply('❌ Bunday kodli kino topilmadi.', adminKeyboard);
    }

    await ctx.scene.leave();
  }
}
