"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotUpdate = void 0;
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const movie_service_1 = require("../movie/movie.service");
const history_service_1 = require("../history/history.service");
const subscription_guard_1 = require("../../common/guards/subscription.guard");
const admin_guard_1 = require("../../common/guards/admin.guard");
const channel_service_1 = require("../channel/channel.service");
const keyboard_util_1 = require("../../common/utils/keyboard.util");
const ExcelJS = __importStar(require("exceljs"));
let BotUpdate = class BotUpdate {
    userService;
    movieService;
    historyService;
    channelService;
    constructor(userService, movieService, historyService, channelService) {
        this.userService = userService;
        this.movieService = movieService;
        this.historyService = historyService;
        this.channelService = channelService;
    }
    async start(ctx) {
        const from = ctx.from;
        if (from) {
            await this.userService.upsertUser(from.id.toString(), from.username);
        }
        await ctx.reply('🎬 Xush kelibsiz! Kino kodini kiriting', telegraf_1.Markup.removeKeyboard());
    }
    async checkSubscription(ctx) {
        await ctx.deleteMessage().catch(() => { });
        await ctx.reply('✅ Obunangiz tasdiqlandi!\n\n🎬 Kino kodini kiriting:');
    }
    async adminPanel(ctx) {
        await ctx.reply('Admin panelga xush kelibsiz!', keyboard_util_1.adminKeyboard);
    }
    async getStats(ctx) {
        const usersCount = (await this.userService.getStatistics()).totalUsers;
        const moviesCount = await this.movieService.getStatistics();
        const downloadsCount = await this.historyService.getStatistics();
        await ctx.reply(`📊 Statistika:\n\n👥 Foydalanuvchilar: ${usersCount}\n🎬 Kinolar: ${moviesCount}\n📥 Jami yuklashlar: ${downloadsCount}`);
    }
    async enterAddMovie(ctx) {
        await ctx.scene.enter('add_movie_scene');
    }
    async enterDeleteMovie(ctx) {
        await ctx.scene.enter('delete_movie_scene');
    }
    async enterAddChannel(ctx) {
        await ctx.scene.enter('add_channel_scene');
    }
    async enterDeleteChannel(ctx) {
        const channels = await this.channelService.getAllChannels();
        if (channels.length === 0)
            return ctx.reply('Kanallar yo\'q');
        const buttons = channels.map(ch => [telegraf_1.Markup.button.callback(`O'chirish: ${ch.channelId}`, `del_ch_${ch.channelId}`)]);
        await ctx.reply('Qaysi kanalni o\'chiramiz?', telegraf_1.Markup.inlineKeyboard(buttons));
    }
    async deleteChannelAction(ctx) {
        const channelId = ctx.match[1];
        await this.channelService.removeChannel(channelId);
        await ctx.editMessageText(`✅ Kanal ${channelId} o'chirildi!`);
    }
    async enterUserInfo(ctx) {
        await ctx.reply('Foydalanuvchi ID sini yuboring: /user <tg_id>');
    }
    async getUserInfo(ctx) {
        const text = ctx.message?.text?.split(' ') || [];
        if (text.length < 2)
            return ctx.reply('ID nomalum. Format: /user <tg_id>');
        const userId = text[1];
        const user = await this.userService.findByTelegramId(userId);
        if (!user)
            return ctx.reply('❌ Foydalanuvchi topilmadi.');
        await ctx.reply(`👤 ID: ${user.telegramId}\n📝 Username: ${user.username || 'Yo\'q'}\n📅 Obuna bo'lgan: ${user.joinedAt.toLocaleDateString()}\n📥 Yuklab olgan kinolari: ${user.downloadCount}`);
    }
    async getMoviesList(ctx) {
        const loadingMsg = await ctx.reply('⏳ Kinolar ro\'yxati yuklanmoqda...');
        try {
            const movies = await this.movieService.getAllMovies();
            await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id).catch(() => { });
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
            await ctx.replyWithDocument({
                source: Buffer.from(buffer),
                filename: 'kinolar_royxati.xlsx'
            }, { caption: `✅ Jami kinolar soni: ${movies.length} ta` });
        }
        catch (error) {
            console.error('Error exporting movies:', error);
            await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id).catch(() => { });
            await ctx.reply('❌ Faylni yaratishda xatolik yuz berdi.');
        }
    }
    async onText(ctx, next) {
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
            }
            catch (e) {
                try {
                    await ctx.replyWithDocument(movie.fileId, { caption: `🎬 Kino kodi: ${movie.code}` });
                }
                catch (e2) {
                    await ctx.reply('❌ Faylni yuborishda xatolik yuz berdi.');
                }
            }
            const user = await this.userService.findByTelegramId(ctx.from.id.toString());
            if (user) {
                await this.historyService.addHistory(user, movie);
                await this.userService.incrementDownload(user.telegramId);
            }
        }
        else {
            await ctx.reply('❌ Kino topilmadi');
        }
    }
    async onChatJoinRequest(ctx) {
        try {
            await ctx.telegram.approveChatJoinRequest(ctx.chatJoinRequest.chat.id, ctx.chatJoinRequest.from.id);
            const user = await this.userService.findByTelegramId(ctx.chatJoinRequest.from.id.toString());
            if (user) {
                await ctx.telegram.sendMessage(ctx.chatJoinRequest.from.id, "✅ Kanalga so'rovingiz tasdiqlandi!\n\n🎬 Endi botdan to'liq foydalanishingiz mumkin, kino kodini yuboring:");
            }
            else {
                await ctx.telegram.sendMessage(ctx.chatJoinRequest.from.id, "✅ Kanalga so'rovingiz tasdiqlandi!\n\n🎬 Endi botdan to'liq foydalanishingiz mumkin, /start buyrug'ini bosing.");
            }
        }
        catch (e) {
            console.error('Chat join request approve error:', e);
        }
    }
};
exports.BotUpdate = BotUpdate;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    (0, common_1.UseGuards)(subscription_guard_1.SubscriptionGuard),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "start", null);
__decorate([
    (0, nestjs_telegraf_1.Action)('check_subscription'),
    (0, common_1.UseGuards)(subscription_guard_1.SubscriptionGuard),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "checkSubscription", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('admin'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "adminPanel", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('📊 Statistika'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "getStats", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('➕ Kino qo\'shish'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "enterAddMovie", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🗑 Kino o\'chirish'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "enterDeleteMovie", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('➕ Kanal qo\'shish'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "enterAddChannel", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('🗑 Kanal o\'chirish'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "enterDeleteChannel", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/del_ch_(.+)/),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "deleteChannelAction", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('👤 Foydalanuvchi ma\'lumoti'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "enterUserInfo", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('user'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "getUserInfo", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('📋 Kinolar ro\'yxati'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "getMoviesList", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    (0, common_1.UseGuards)(subscription_guard_1.SubscriptionGuard),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __param(1, (0, nestjs_telegraf_1.Next)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onText", null);
__decorate([
    (0, nestjs_telegraf_1.On)('chat_join_request'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onChatJoinRequest", null);
exports.BotUpdate = BotUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        movie_service_1.MovieService,
        history_service_1.HistoryService,
        channel_service_1.ChannelService])
], BotUpdate);
//# sourceMappingURL=bot.update.js.map