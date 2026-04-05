import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryService } from './history.service';
import { DownloadHistory } from './entities/download-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DownloadHistory])],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
