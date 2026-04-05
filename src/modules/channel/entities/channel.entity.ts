import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  channelId: string;

  @Column()
  inviteLink: string;
}
