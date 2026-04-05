import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { AppController } from './app.controller';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MovieModule } from './modules/movie/movie.module';
import { ChannelModule } from './modules/channel/channel.module';
import { HistoryModule } from './modules/history/history.module';
import { BotModule } from './modules/bot/bot.module';

import { User } from './modules/user/entities/user.entity';
import { Movie } from './modules/movie/entities/movie.entity';
import { Channel } from './modules/channel/entities/channel.entity';
import { DownloadHistory } from './modules/history/entities/download-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Movie, Channel, DownloadHistory],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const proxyUrl = configService.get<string>('PROXY_URL');
        const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;
        return {
          token: configService.get<string>('BOT_TOKEN') || '',
          middlewares: [session()],
          options: {
            telegram: {
              ...(agent && { agent }),
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    MovieModule,
    ChannelModule,
    HistoryModule,
    BotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
