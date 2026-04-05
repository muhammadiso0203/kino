import { ChannelService } from '../../channel/channel.service';
export declare class AddChannelScene {
    private readonly channelService;
    constructor(channelService: ChannelService);
    enter(ctx: any): Promise<void>;
    cancel(ctx: any): Promise<void>;
    onText(ctx: any): Promise<void>;
}
