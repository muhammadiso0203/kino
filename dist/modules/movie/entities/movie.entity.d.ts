import { DownloadHistory } from '../../history/entities/download-history.entity';
export declare class Movie {
    id: number;
    code: number;
    fileId: string;
    createdAt: Date;
    downloads: DownloadHistory[];
}
