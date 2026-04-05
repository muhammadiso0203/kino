import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async addMovie(code: number, fileId: string): Promise<Movie> {
    const existing = await this.movieRepository.findOne({ where: { code } });
    if (existing) {
      throw new BadRequestException('Bunday kodli kino allaqachon mavjud!');
    }
    const movie = this.movieRepository.create({ code, fileId });
    return this.movieRepository.save(movie);
  }

  async findMovieByCode(code: number): Promise<Movie | null> {
    return this.movieRepository.findOne({ where: { code } });
  }

  async deleteMovieByCode(code: number): Promise<boolean> {
    const result = await this.movieRepository.delete({ code });
    return (result.affected ?? 0) > 0;
  }

  async getStatistics() {
    return this.movieRepository.count();
  }

  async getAllMovies(): Promise<Movie[]> {
    return this.movieRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }
}
