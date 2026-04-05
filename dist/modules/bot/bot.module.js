"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotModule = void 0;
const common_1 = require("@nestjs/common");
const user_module_1 = require("../user/user.module");
const movie_module_1 = require("../movie/movie.module");
const channel_module_1 = require("../channel/channel.module");
const history_module_1 = require("../history/history.module");
const bot_update_1 = require("./bot.update");
const add_movie_scene_1 = require("./scenes/add-movie.scene");
const delete_movie_scene_1 = require("./scenes/delete-movie.scene");
const add_channel_scene_1 = require("./scenes/add-channel.scene");
let BotModule = class BotModule {
};
exports.BotModule = BotModule;
exports.BotModule = BotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            movie_module_1.MovieModule,
            channel_module_1.ChannelModule,
            history_module_1.HistoryModule,
        ],
        providers: [
            bot_update_1.BotUpdate,
            add_movie_scene_1.AddMovieScene,
            delete_movie_scene_1.DeleteMovieScene,
            add_channel_scene_1.AddChannelScene,
        ],
    })
], BotModule);
//# sourceMappingURL=bot.module.js.map