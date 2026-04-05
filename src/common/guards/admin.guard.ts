import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = TelegrafExecutionContext.create(context);
    const tgContext = ctx.getContext<any>();
    const userId = tgContext.from?.id.toString();

    if (!userId) return false;

    const adminIdsEnv = this.configService.get<string>('ADMIN_IDS');
    if (adminIdsEnv) {
      const adminIds = adminIdsEnv.split(',').map(id => id.trim());
      if (adminIds.includes(userId)) {
        return true;
      }
    }

    const user = await this.userService.findByTelegramId(userId);
    if (user && user.isAdmin) {
      return true;
    }

    await tgContext.reply('❌ Bu buyruq faqat adminlar uchun!');
    return false;
  }
}
