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
exports.AdminGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const user_service_1 = require("../../modules/user/user.service");
let AdminGuard = class AdminGuard {
    userService;
    configService;
    constructor(userService, configService) {
        this.userService = userService;
        this.configService = configService;
    }
    async canActivate(context) {
        const ctx = nestjs_telegraf_1.TelegrafExecutionContext.create(context);
        const tgContext = ctx.getContext();
        const userId = tgContext.from?.id.toString();
        if (!userId)
            return false;
        const adminIdsEnv = this.configService.get('ADMIN_IDS');
        if (adminIdsEnv) {
            const adminIds = adminIdsEnv.split(',').map(id => id.trim());
            if (adminIds.includes(userId)) {
                return true;
            }
        }
        const user = await this.userService.findByTelegramId(userId);
        if (user && user.isAdmin) {
            return true;
        }
        await tgContext.reply('❌ Bu buyruq faqat adminlar uchun!');
        return false;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        config_1.ConfigService])
], AdminGuard);
//# sourceMappingURL=admin.guard.js.map