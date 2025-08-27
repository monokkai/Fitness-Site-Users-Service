import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface JwtPayload {
    sub: number;
    username: string;
    iat?: number;
    exp?: number;
}

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        try {
            const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET') || 'fallback-secret',
            });

            request.user = { id: payload.sub };
            return true;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new UnauthorizedException(`Invalid token: ${error.message}`);
            }
            throw new UnauthorizedException('Invalid token');
        }
    }

    private extractTokenFromHeader(request: AuthenticatedRequest): string | undefined {
        const authHeader = request.headers.authorization;
        if (typeof authHeader === 'string') {
            const [type, token] = authHeader.split(' ');
            return type === 'Bearer' ? token : undefined;
        }
        return undefined;
    }
}
