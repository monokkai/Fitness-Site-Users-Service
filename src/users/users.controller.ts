import {
    Controller,
    Put,
    Delete,
    Body,
    Req,
    UseGuards,
    Get,
    HttpCode,
    HttpStatus,
    BadRequestException
} from '@nestjs/common';
import { UsersService, UserProfile, UserResponse } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { Request } from 'express';
import { DeleteAccountDto } from './dto/delete-account.dto';
import * as bcrypt from 'bcrypt';

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

        if (updateData.password && updateData.password !== updateData.confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const { confirmPassword, ...dataWithoutConfirm } = updateData;

        return this.usersService.updateProfile(req.user.id, dataWithoutConfirm);
    }

    @Put('avatar')
    updateAvatar(
        @Req() req: AuthenticatedRequest,
        @Body() avatarData: UpdateAvatarDto
    ): Promise<UserResponse> {
        if (!req.user?.id) {
            throw new Error('User not found in request');
        }
        return this.usersService.updateAvatar(req.user.id, avatarData.avatarUrl);
    }

    @Delete('account')
    @HttpCode(HttpStatus.OK)
    async deleteAccount(
        @Req() req: AuthenticatedRequest,
        @Body() deleteData: DeleteAccountDto
    ): Promise<{ message: string }> {
        if (!req.user?.id) {
            throw new Error('User not found in request');
        }

        const user = await this.usersService.getUserWithPassword(req.user.id);

        const isPasswordValid = await bcrypt.compare(deleteData.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password');
        }

        await this.usersService.deleteAccount(req.user.id);

        return { message: 'Account deleted successfully' };
    }

}
