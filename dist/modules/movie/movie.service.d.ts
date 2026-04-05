import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
export declare class MovieService {
    private readonly movieRepository;
    constructor(movieRepository: Repository<Movie>);
    addMovie(code: number, fileId: string): Promise<Movie>;
    findMovieByCode(code: number): Promise<Movie | null>;
    deleteMovieByCode(code: number): Promise<boolean>;
    getStatistics(): Promise<number>;
    getAllMovies(): Promise<Movie[]>;
}
