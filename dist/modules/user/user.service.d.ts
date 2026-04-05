import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    upsertUser(telegramId: string, username?: string): Promise<User>;
    findByTelegramId(telegramId: string): Promise<User | null>;
    incrementDownload(telegramId: string): Promise<void>;
    getStatistics(): Promise<{
        totalUsers: number;
    }>;
    getPaginatedUsers(page: number, limit: number): Promise<{
        users: User[];
        total: number;
    }>;
}
