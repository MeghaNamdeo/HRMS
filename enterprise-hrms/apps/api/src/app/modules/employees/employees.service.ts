import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@enterprise-hrms/db';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@enterprise-hrms/shared-types';

@Injectable()
export class EmployeesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateEmployeeDto, orgId: string) {
        // 1. Transaction to create User + Employee + Profile + Job
        return this.prisma.$transaction(async (tx) => {
            // Check if email exists
            const existingUser = await tx.user.findUnique({ where: { email: dto.email } });
            if (existingUser) {
                throw new ConflictException('Email already exists');
            }

            // Check if emp code exists in org
            const existingCode = await tx.employee.findFirst({
                where: { orgId, code: dto.code },
            });
            if (existingCode) {
                throw new ConflictException('Employee Code already exists in this Organization');
            }

            // Create Auth User
            const defaultPassword = await bcrypt.hash('Welcome@123', 10);
            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,
                    passwordHash: defaultPassword,
                    role: UserRole.EMPLOYEE,
                    orgId,
                },
            });

            // Create Employee Record with Profile & Job
            const employee = await tx.employee.create({
                data: {
                    userId: user.id,
                    code: dto.code,
                    orgId,
                    // Relation Tables
                    profile: {
                        create: {
                            ...dto.profile,
                        },
                    },
                    job: {
                        create: {
                            ...dto.job,
                        },
                    },
                },
                include: {
                    profile: true,
                    job: true,
                    user: {
                        select: { email: true, role: true },
                    },
                },
            });

            // TODO: Add Audit Log here manually or via event emitter

            return employee;
        });
    }

    async findAll(orgId: string) {
        return this.prisma.employee.findMany({
            where: { orgId },
            include: {
                user: { select: { name: true, email: true, role: true } },
                job: true,
            },
        });
    }

    async findOne(id: string, orgId: string) {
        return this.prisma.employee.findFirst({
            where: { id, orgId },
            include: {
                user: true,
                profile: true,
                job: true,
                bank: true,
                documents: true,
            },
        });
    }
}
