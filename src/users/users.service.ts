import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    avatarUrl?: string;
    createdAt: Date;
}

export interface UpdateProfileData {
    username?: string;
    email?: string;
}

export interface UserResponse {
    message: string;
    user?: UserProfile;
    avatarUrl?: string;
}

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async getUserById(userId: number): Promise<UserProfile> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            select: ['id', 'username', 'email', 'avatarUrl', 'createdAt']
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl ?? undefined,
            createdAt: user.createdAt
        };
    }

    async updateProfile(userId: number, updateData: UpdateProfileData): Promise<UserResponse> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (updateData.username && updateData.username !== user.username) {
            const existingUser = await this.usersRepository.findOne({
                where: { username: updateData.username }
            });
            if (existingUser) {
                throw new ConflictException('Username already taken');
            }
            user.username = updateData.username;
        }

        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await this.usersRepository.findOne({
                where: { email: updateData.email }
            });
            if (existingUser) {
                throw new ConflictException('Email already taken');
            }
            user.email = updateData.email;
        }

        user.updatedAt = new Date();
        await this.usersRepository.save(user);

        return {
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl ?? undefined,
                createdAt: user.createdAt
            }
        };
    }

    async updateAvatar(userId: number, avatarUrl: string): Promise<UserResponse> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.avatarUrl = avatarUrl;
        user.updatedAt = new Date();
        await this.usersRepository.save(user);

        return {
            message: 'Avatar updated successfully',
            avatarUrl
        };
    }

    async deleteAccount(userId: number): Promise<UserResponse> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.isActive = false;
        user.updatedAt = new Date();
        await this.usersRepository.save(user);

        return { message: 'Account deleted successfully' };
    }
}
