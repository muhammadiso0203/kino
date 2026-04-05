import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { DownloadHistory } from '../../history/entities/download-history.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  code: number;

  @Column()
  fileId: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => DownloadHistory, (history) => history.movie)
  downloads: DownloadHistory[];
}
