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
exports.AddChannelScene = void 0;
const nestjs_telegraf_1 = require("nestjs-telegraf");
const channel_service_1 = require("../../channel/channel.service");
const telegraf_1 = require("telegraf");
const keyboard_util_1 = require("../../../common/utils/keyboard.util");
let AddChannelScene = class AddChannelScene {
    channelService;
    constructor(channelService) {
        this.channelService = channelService;
    }
    async enter(ctx) {
        await ctx.reply('Kanal qo\'shish. Menga kanal ID sini yoki username ni yuboring (@kanal_nomi yoki -100...):', telegraf_1.Markup.keyboard([['❌ Bekor qilish']]).resize());
        ctx.scene.session.channelData = {};
    }
    async cancel(ctx) {
        await ctx.reply('❌ Bekor qilindi.', keyboard_util_1.adminKeyboard);
        await ctx.scene.leave();
    }
    async onText(ctx) {
        if (ctx.message.text === '❌ Bekor qilish')
            return;
        if (!ctx.scene.session.channelData?.channelId) {
            ctx.scene.session.channelData = { channelId: ctx.message.text };
            await ctx.reply('Yaxshi. Endi menga kanal taklif havolasini (invite link) yuboring:');
        }
        else {
            let inviteLink = ctx.message.text;
            if (inviteLink.startsWith('@')) {
                inviteLink = `https://t.me/${inviteLink.substring(1)}`;
            }
            else if (!inviteLink.startsWith('http')) {
                inviteLink = `https://t.me/${inviteLink}`;
            }
            const channelId = ctx.scene.session.channelData.channelId;
            try {
                const chat = await ctx.telegram.getChat(channelId);
                if (inviteLink.includes('t.me/') && !inviteLink.includes('+') && !inviteLink.includes('joinchat/')) {
                    const expectedUsername = inviteLink.split('t.me/')[1].replace('/', '');
                    if (chat.username?.toLowerCase() !== expectedUsername.toLowerCase()) {
                        await ctx.reply('❌ Kanal ID va Link bir-biriga mos kelmadi!', keyboard_util_1.adminKeyboard);
                        await ctx.scene.leave();
                        return;
                    }
                }
                await this.channelService.addChannel(channelId, inviteLink);
                await ctx.reply('✅ Kanal qo\'shildi!', keyboard_util_1.adminKeyboard);
            }
            catch (e) {
                if (e.response && e.response.error_code === 400) {
                    await ctx.reply('❌ Kanal topilmadi yoki bot kanalda admin emas!', keyboard_util_1.adminKeyboard);
                }
                else {
                    await ctx.reply(e.message || 'Xatolik yuz berdi', keyboard_util_1.adminKeyboard);
                }
            }
            await ctx.scene.leave();
        }
    }
};
exports.AddChannelScene = AddChannelScene;
__decorate([
    (0, nestjs_telegraf_1.SceneEnter)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddChannelScene.prototype, "enter", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('❌ Bekor qilish'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddChannelScene.prototype, "cancel", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddChannelScene.prototype, "onText", null);
exports.AddChannelScene = AddChannelScene = __decorate([
    (0, nestjs_telegraf_1.Scene)('add_channel_scene'),
    __metadata("design:paramtypes", [channel_service_1.ChannelService])
], AddChannelScene);
//# sourceMappingURL=add-channel.scene.js.map