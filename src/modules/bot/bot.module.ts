import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { MovieModule } from '../movie/movie.module';
import { ChannelModule } from '../channel/channel.module';
import { HistoryModule } from '../history/history.module';
import { BotUpdate } from './bot.update';
import { AddMovieScene } from './scenes/add-movie.scene';
import { DeleteMovieScene } from './scenes/delete-movie.scene';
import { AddChannelScene } from './scenes/add-channel.scene';

@Module({
  imports: [
    UserModule,
    MovieModule,
    ChannelModule,
    HistoryModule,
  ],
  providers: [
    BotUpdate,
    AddMovieScene,
    DeleteMovieScene,
    AddChannelScene,
  ],
})
export class BotModule {}
