"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMovieScene = void 0;
const nestjs_telegraf_1 = require("nestjs-telegraf");
const movie_service_1 = require("../../movie/movie.service");
const telegraf_1 = require("telegraf");
const keyboard_util_1 = require("../../../common/utils/keyboard.util");
let DeleteMovieScene = class DeleteMovieScene {
    movieService;
    constructor(movieService) {
        this.movieService = movieService;
    }
    async enter(ctx) {
        await ctx.reply('O\'chirish uchun kino kodini yuboring:', telegraf_1.Markup.keyboard([['❌ Bekor qilish']]).resize());
    }
    async cancel(ctx) {
        await ctx.reply('❌ Bekor qilindi.', keyboard_util_1.adminKeyboard);
        await ctx.scene.leave();
    }
    async onText(ctx) {
        if (ctx.message.text === '❌ Bekor qilish')
            return;
        const code = ctx.message.text;
        if (!/^\d+$/.test(code)) {
            await ctx.reply("❌ Kino kodi faqat raqamlardan iborat bo'lishi kerak. Iltimos, qayta yuboring.");
            return;
        }
        const deleted = await this.movieService.deleteMovieByCode(code);
        if (deleted) {
            await ctx.reply('✅ Kino o\'chirildi.', keyboard_util_1.adminKeyboard);
        }
        else {
            await ctx.reply('❌ Bunday kodli kino topilmadi.', keyboard_util_1.adminKeyboard);
        }
        await ctx.scene.leave();
    }
};
exports.DeleteMovieScene = DeleteMovieScene;
__decorate([
    (0, nestjs_telegraf_1.SceneEnter)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeleteMovieScene.prototype, "enter", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('❌ Bekor qilish'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeleteMovieScene.prototype, "cancel", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeleteMovieScene.prototype, "onText", null);
exports.DeleteMovieScene = DeleteMovieScene = __decorate([
    (0, nestjs_telegraf_1.Scene)('delete_movie_scene'),
    __metadata("design:paramtypes", [movie_service_1.MovieService])
], DeleteMovieScene);
//# sourceMappingURL=delete-movie.scene.js.map