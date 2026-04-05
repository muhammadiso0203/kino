import { User } from '../../user/entities/user.entity';
import { Movie } from '../../movie/entities/movie.entity';
export declare class DownloadHistory {
    id: number;
    user: User;
    movie: Movie;
    downloadedAt: Date;
}
