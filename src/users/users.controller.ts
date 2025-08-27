import {
    Controller,
    Put,
    Delete,
    Body,
    Req,
    UseGuards,
    Get,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import { UsersService, UserProfile, UserResponse } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    async getCurrentUser(@Req() req: AuthenticatedRequest): Promise<UserProfile> {
        if (!req.user?.id) {
            throw new Error('User not found in request');
        }
        return this.usersService.getUserById(req.user.id);
    }

    @Put('profile')
    async updateProfile(
        @Req() req: AuthenticatedRequest,
        @Body() updateData: UpdateProfileDto
    ): Promise<UserResponse> {
        if (!req.user?.id) {
            throw new Error('User not found in request');
        }
        return this.usersService.updateProfile(req.user.id, updateData);
    }

    @Put('avatar')
    async updateAvatar(
        @Req() req: AuthenticatedRequest,
        @Body() avatarData: UpdateAvatarDto
    ): Promise<UserResponse> {
        if (!req.user?.id) {
            throw new Error('User not found in request');
        }
        return this.usersService.updateAvatar(req.user.id, avatarData.avatarUrl);
    }

    @Delete('account')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAccount(@Req() req: AuthenticatedRequest): Promise<{ message: string }> {
        if (!req.user?.id) {
            throw new Error('User not found in request');
        }
        return this.usersService.deleteAccount(req.user.id);
    }
}
