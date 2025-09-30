import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

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
    password?: string;
}

export interface UserResponse {
    message: string;
    user?: UserProfile;
    avatarUrl?: string;
}

@Injectable()
export class UsersService {
    private usersRepository: Repository<User>;

    constructor(@Inject('DATA_SOURCE') private dataSource: DataSource) {
        this.usersRepository = this.dataSource.getRepository(User);
    }

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

    async getUserWithPassword(userId: number): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
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

        if (updateData.password) {
            const saltRounds = 11;
            user.passwordHash = await bcrypt.hash(updateData.password, saltRounds);
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

    async deleteAccount(userId: number): Promise<void> {
        console.log('🗑️ Deleting user:', userId);

        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            console.log('❌ User not found for deletion');
            throw new NotFoundException('User not found');
        }

        console.log('✅ User found, proceeding with deletion...');
        await this.usersRepository.remove(user);
        console.log('✅ User successfully deleted from database');
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
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl ?? undefined,
                createdAt: user.createdAt,
            },
        };
    }

}
