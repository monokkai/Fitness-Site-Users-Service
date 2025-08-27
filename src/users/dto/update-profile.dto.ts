import { IsString, IsEmail, IsOptional, MinLength, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @ValidateIf(o => o.password)
    @IsString()
    @MinLength(6)
    confirmPassword?: string;
}
