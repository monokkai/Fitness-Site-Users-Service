import { IsString, IsOptional, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers and underscores'
    })
    username?: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(100)
    email?: string;
}
