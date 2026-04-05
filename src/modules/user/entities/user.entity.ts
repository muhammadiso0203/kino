import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { DownloadHistory } from '../../history/entities/download-history.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: true })
  telegramId: string;

  @Column({ nullable: true })
  username: string;

  @CreateDateColumn()
  joinedAt: Date;

  @Column({ default: 0 })
  downloadCount: number;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => DownloadHistory, (history) => history.user)
  downloads: DownloadHistory[];
}
