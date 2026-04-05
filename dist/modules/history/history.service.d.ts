import { Repository } from 'typeorm';
import { DownloadHistory } from './entities/download-history.entity';
import { User } from '../user/entities/user.entity';
import { Movie } from '../movie/entities/movie.entity';
export declare class HistoryService {
    private readonly historyRepository;
    constructor(historyRepository: Repository<DownloadHistory>);
    addHistory(user: User, movie: Movie): Promise<void>;
    getStatistics(): Promise<number>;
}
