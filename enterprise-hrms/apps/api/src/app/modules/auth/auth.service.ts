import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@enterprise-hrms/db';
import { AuthResponse, JwtPayload, UserRole } from '@enterprise-hrms/shared-types';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any): Promise<AuthResponse> {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role as UserRole,
            orgId: user.orgId
        };

        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role as UserRole,
                orgId: user.orgId,
            },
        };
    }

    async register(data: Prisma.UserCreateInput, passwordRaw: string) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(passwordRaw, salt);

        return this.prisma.user.create({
            data: {
                ...data,
                passwordHash: hash,
            },
        });
    }
}
