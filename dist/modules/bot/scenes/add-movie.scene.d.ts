import { MovieService } from '../../movie/movie.service';
export declare class AddMovieScene {
    private readonly movieService;
    constructor(movieService: MovieService);
    enter(ctx: any): Promise<void>;
    cancel(ctx: any): Promise<void>;
    onCode(ctx: any): Promise<void>;
    onVideo(ctx: any): Promise<any>;
}
