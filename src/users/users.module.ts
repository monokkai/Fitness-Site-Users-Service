import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'fallback-secret',
                signOptions: { expiresIn: '1h' },
            }),
            inject: [ConfigService],
        }),
        DatabaseModule,
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
        JwtAuthGuard,
        ConfigService,
    ],
    exports: [JwtAuthGuard]
})
export class UsersModule { }
