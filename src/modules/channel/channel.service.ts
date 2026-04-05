import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async getAllChannels(): Promise<Channel[]> {
    return this.channelRepository.find();
  }

  async addChannel(channelId: string, inviteLink: string): Promise<Channel> {
    let channel = await this.channelRepository.findOne({ where: { channelId } });
    if (channel) {
      throw new BadRequestException('Bu kanal allaqachon qo`shilgan!');
    }
    channel = this.channelRepository.create({ channelId, inviteLink });
    return this.channelRepository.save(channel);
  }

  async removeChannel(channelId: string): Promise<boolean> {
    const result = await this.channelRepository.delete({ channelId });
    return (result.affected ?? 0) > 0;
  }
}
