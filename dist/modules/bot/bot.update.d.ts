import { Context } from 'telegraf';
import { UserService } from '../user/user.service';
import { MovieService } from '../movie/movie.service';
import { HistoryService } from '../history/history.service';
import { ChannelService } from '../channel/channel.service';
export declare class BotUpdate {
    private readonly userService;
    private readonly movieService;
    private readonly historyService;
    private readonly channelService;
    constructor(userService: UserService, movieService: MovieService, historyService: HistoryService, channelService: ChannelService);
    start(ctx: Context): Promise<void>;
    checkSubscription(ctx: Context): Promise<void>;
    adminPanel(ctx: Context): Promise<void>;
    getStats(ctx: Context): Promise<void>;
    enterAddMovie(ctx: any): Promise<void>;
    enterDeleteMovie(ctx: any): Promise<void>;
    enterAddChannel(ctx: any): Promise<void>;
    enterDeleteChannel(ctx: any): Promise<any>;
    deleteChannelAction(ctx: any): Promise<void>;
    enterUserInfo(ctx: any): Promise<void>;
    getUserInfo(ctx: any): Promise<any>;
    getMoviesList(ctx: any): Promise<void>;
    onText(ctx: any, next: () => Promise<void>): Promise<void>;
    onChatJoinRequest(ctx: any): Promise<void>;
}
