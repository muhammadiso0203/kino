import { DownloadHistory } from '../../history/entities/download-history.entity';
export declare class User {
    id: number;
    telegramId: string;
    username: string;
    joinedAt: Date;
    downloadCount: number;
    isAdmin: boolean;
    downloads: DownloadHistory[];
}
