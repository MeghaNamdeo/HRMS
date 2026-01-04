import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '@enterprise-hrms/db';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.UserCreateInput, orgId: string) {
        // Ensure email is unique across the system (or org, based on requirement)
        // For now, email is unique globally in schema
        const existing = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existing) {
            throw new ConflictException('User with this email already exists');
        }

        // Force orgId from context
        return this.prisma.user.create({
            data: {
                ...data,
                orgId, // Set the organization context
            },
        });
    }

    async findAll(orgId: string) {
        return this.prisma.user.findMany({
            where: { orgId },
        });
    }
}
