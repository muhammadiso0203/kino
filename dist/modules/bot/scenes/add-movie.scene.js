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
exports.AddMovieScene = void 0;
const nestjs_telegraf_1 = require("nestjs-telegraf");
const movie_service_1 = require("../../movie/movie.service");
const telegraf_1 = require("telegraf");
const keyboard_util_1 = require("../../../common/utils/keyboard.util");
let AddMovieScene = class AddMovieScene {
    movieService;
    constructor(movieService) {
        this.movieService = movieService;
    }
    async enter(ctx) {
        await ctx.reply('🎬 Kino qo\'shish: Menga kino kodini yuboring', telegraf_1.Markup.keyboard([['❌ Bekor qilish']]).resize());
        ctx.scene.session.movieData = {};
    }
    async cancel(ctx) {
        await ctx.reply('❌ Bekor qilindi.', keyboard_util_1.adminKeyboard);
        await ctx.scene.leave();
    }
    async onCode(ctx) {
        if (ctx.scene.session.movieData?.code)
            return;
        const text = ctx.message.text;
        if (text === '❌ Bekor qilish')
            return;
        if (!/^\d+$/.test(text)) {
            await ctx.reply("❌ Kino kodi faqat raqamlardan iborat bo'lishi kerak. Iltimos, qayta yuboring.");
            return;
        }
        ctx.scene.session.movieData = { code: text };
        await ctx.reply(`Kino kodi qabul qilindi: ${text}\nEndi menga video yoki faylni yuboring.`);
    }
    async onVideo(ctx) {
        if (!ctx.scene.session.movieData?.code) {
            return ctx.reply('Kino kodini yuborish majburiy');
        }
        const code = ctx.scene.session.movieData.code;
        const fileId = ctx.message.video?.file_id || ctx.message.document?.file_id;
        try {
            await this.movieService.addMovie(code, fileId);
            await ctx.reply(`✅ Kino muvaffaqiyatli qo'shildi!\nKodi: ${code}`, keyboard_util_1.adminKeyboard);
        }
        catch (e) {
            await ctx.reply(e.message || 'Xatolik yuz berdi.', keyboard_util_1.adminKeyboard);
        }
        await ctx.scene.leave();
    }
};
exports.AddMovieScene = AddMovieScene;
__decorate([
    (0, nestjs_telegraf_1.SceneEnter)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddMovieScene.prototype, "enter", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('❌ Bekor qilish'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddMovieScene.prototype, "cancel", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddMovieScene.prototype, "onCode", null);
__decorate([
    (0, nestjs_telegraf_1.On)(['video', 'document']),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddMovieScene.prototype, "onVideo", null);
exports.AddMovieScene = AddMovieScene = __decorate([
    (0, nestjs_telegraf_1.Scene)('add_movie_scene'),
    __metadata("design:paramtypes", [movie_service_1.MovieService])
], AddMovieScene);
//# sourceMappingURL=add-movie.scene.js.map