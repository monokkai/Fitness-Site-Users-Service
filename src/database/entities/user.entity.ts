import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('Users')
export class User {
    @PrimaryGeneratedColumn({ name: 'Id' })
    id: number;

    @Column({ name: 'Username', unique: true })
    username: string;

    @Column({ name: 'Email', unique: true })
    email: string;

    @Column({ name: 'PasswordHash' })
    passwordHash: string;

    @CreateDateColumn({ name: 'CreatedAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'UpdatedAt' })
    updatedAt: Date;

    @Column({ name: 'LastLoginAt', nullable: true })
    lastLoginAt: Date;

    @Column({ name: 'IsActive', default: true })
    isActive: boolean;

    @Column({ name: 'RefreshToken', nullable: true })
    refreshToken: string;

    @Column({ name: 'RefreshTokenExpiryTime', nullable: true })
    refreshTokenExpiryTime: Date;

    @Column({ name: 'AvatarUrl', nullable: true, length: 500 })
    avatarUrl: string;
}
