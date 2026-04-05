"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminKeyboard = void 0;
const telegraf_1 = require("telegraf");
exports.adminKeyboard = telegraf_1.Markup.keyboard([
    ['➕ Kino qo\'shish', '🗑 Kino o\'chirish'],
    ['➕ Kanal qo\'shish', '🗑 Kanal o\'chirish'],
    ['📊 Statistika', '👤 Foydalanuvchi ma\'lumoti'],
    ['📋 Kinolar ro\'yxati']
]).resize();
//# sourceMappingURL=keyboard.util.js.map