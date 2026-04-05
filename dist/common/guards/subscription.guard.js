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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionGuard = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const channel_service_1 = require("../../modules/channel/channel.service");
const telegraf_1 = require("telegraf");
let SubscriptionGuard = class SubscriptionGuard {
    channelService;
    constructor(channelService) {
        this.channelService = channelService;
    }
    async canActivate(context) {
        const ctx = nestjs_telegraf_1.TelegrafExecutionContext.create(context);
        const tgContext = ctx.getContext();
        const userId = tgContext.from?.id;
        if (!userId)
            return false;
        const channels = await this.channelService.getAllChannels();
        if (channels.length === 0)
            return true;
        const unjoinedChannels = [];
        for (const channel of channels) {
            try {
                const member = await tgContext.telegram.getChatMember(channel.channelId, userId);
                if (member.status === 'left' || member.status === 'kicked') {
                    unjoinedChannels.push(channel);
                }
            }
            catch (error) {
                unjoinedChannels.push(channel);
            }
        }
        if (unjoinedChannels.length > 0) {
            const buttons = unjoinedChannels.map((ch, index) => {
                let link = ch.inviteLink;
                if (link.startsWith('@')) {
                    link = `https://t.me/${link.substring(1)}`;
                }
                else if (!link.startsWith('http')) {
                    link = `https://t.me/${link}`;
                }
                return [telegraf_1.Markup.button.url(`Kanal ${index + 1}`, link)];
            });
            buttons.push([telegraf_1.Markup.button.callback('✅ Obunani tekshirish', 'check_subscription')]);
            await tgContext.reply('Iltimos, botdan foydalanish uchun quyidagi kanallarga a\'zo bo\'ling:', telegraf_1.Markup.inlineKeyboard(buttons));
            return false;
        }
        return true;
    }
};
exports.SubscriptionGuard = SubscriptionGuard;
exports.SubscriptionGuard = SubscriptionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [channel_service_1.ChannelService])
], SubscriptionGuard);
//# sourceMappingURL=subscription.guard.js.map