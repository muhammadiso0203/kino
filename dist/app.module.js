"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const app_controller_1 = require("./app.controller");
const https_proxy_agent_1 = require("https-proxy-agent");
const app_service_1 = require("./app.service");
const user_module_1 = require("./modules/user/user.module");
const movie_module_1 = require("./modules/movie/movie.module");
const channel_module_1 = require("./modules/channel/channel.module");
const history_module_1 = require("./modules/history/history.module");
const bot_module_1 = require("./modules/bot/bot.module");
const user_entity_1 = require("./modules/user/entities/user.entity");
const movie_entity_1 = require("./modules/movie/entities/movie.entity");
const channel_entity_1 = require("./modules/channel/entities/channel.entity");
const download_history_entity_1 = require("./modules/history/entities/download-history.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DATABASE_HOST'),
                    port: configService.get('DATABASE_PORT'),
                    username: configService.get('DATABASE_USER'),
                    password: configService.get('DATABASE_PASSWORD'),
                    database: configService.get('DATABASE_NAME'),
                    entities: [user_entity_1.User, movie_entity_1.Movie, channel_entity_1.Channel, download_history_entity_1.DownloadHistory],
                    synchronize: true,
                }),
                inject: [config_1.ConfigService],
            }),
            nestjs_telegraf_1.TelegrafModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const proxyUrl = configService.get('PROXY_URL');
                    const agent = proxyUrl ? new https_proxy_agent_1.HttpsProxyAgent(proxyUrl) : undefined;
                    return {
                        token: configService.get('BOT_TOKEN') || '',
                        middlewares: [(0, telegraf_1.session)()],
                        options: {
                            telegram: {
                                ...(agent && { agent }),
                            },
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            user_module_1.UserModule,
            movie_module_1.MovieModule,
            channel_module_1.ChannelModule,
            history_module_1.HistoryModule,
            bot_module_1.BotModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map