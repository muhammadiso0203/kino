import { Markup } from 'telegraf';

export const adminKeyboard = Markup.keyboard([
  ['➕ Kino qo\'shish', '🗑 Kino o\'chirish'],
  ['➕ Kanal qo\'shish', '🗑 Kanal o\'chirish'],
  ['📊 Statistika', '👤 Foydalanuvchi ma\'lumoti'],
  ['📋 Kinolar ro\'yxati']
]).resize();
