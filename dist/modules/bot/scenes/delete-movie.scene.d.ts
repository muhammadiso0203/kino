import { MovieService } from '../../movie/movie.service';
export declare class DeleteMovieScene {
    private readonly movieService;
    constructor(movieService: MovieService);
    enter(ctx: any): Promise<void>;
    cancel(ctx: any): Promise<void>;
    onText(ctx: any): Promise<void>;
}
