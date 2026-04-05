import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../modules/user/user.service';
export declare class AdminGuard implements CanActivate {
    private readonly userService;
    private readonly configService;
    constructor(userService: UserService, configService: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
