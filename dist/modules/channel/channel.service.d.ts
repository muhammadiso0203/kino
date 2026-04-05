import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
export declare class ChannelService {
    private readonly channelRepository;
    constructor(channelRepository: Repository<Channel>);
    getAllChannels(): Promise<Channel[]>;
    addChannel(channelId: string, inviteLink: string): Promise<Channel>;
    removeChannel(channelId: string): Promise<boolean>;
}
