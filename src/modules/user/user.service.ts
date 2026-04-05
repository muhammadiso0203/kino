import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async upsertUser(telegramId: string, username?: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { telegramId } });
    if (!user) {
      user = this.userRepository.create({ telegramId, username });
      await this.userRepository.save(user);
    } else if (user.username !== username) {
      user.username = username || '';
      await this.userRepository.save(user);
    }
    return user;
  }

  async findByTelegramId(telegramId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { telegramId } });
  }

  async incrementDownload(telegramId: string) {
    await this.userRepository.increment({ telegramId }, 'downloadCount', 1);
  }

  async getStatistics() {
    const totalUsers = await this.userRepository.count();
    return { totalUsers };
  }

  async getPaginatedUsers(page: number, limit: number) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { joinedAt: 'DESC' },
    });
    return { users, total };
  }
}
