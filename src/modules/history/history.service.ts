import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DownloadHistory } from './entities/download-history.entity';
import { User } from '../user/entities/user.entity';
import { Movie } from '../movie/entities/movie.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(DownloadHistory)
    private readonly historyRepository: Repository<DownloadHistory>,
  ) {}

  async addHistory(user: User, movie: Movie) {
    const history = this.historyRepository.create({ user, movie });
    await this.historyRepository.save(history);
  }

  async getStatistics() {
    return this.historyRepository.count();
  }
}
