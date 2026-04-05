import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ChannelService } from '../../modules/channel/channel.service';
export declare class SubscriptionGuard implements CanActivate {
    private readonly channelService;
    constructor(channelService: ChannelService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
