import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@enterprise-hrms/db';
import { CheckInDto, CheckOutDto } from './dto/attendance.dto';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) { }

    async checkIn(userId: string, orgId: string, dto: CheckInDto) {
        // 1. Get Employee ID from User ID
        const employee = await this.prisma.employee.findUnique({
            where: { userId },
        });
        if (!employee) throw new NotFoundException('Employee record not found for this user');

        // 2. Check for ANY existing open session (checkOut is null)
        const openSession = await this.prisma.attendanceLog.findFirst({
            where: {
                employeeId: employee.id,
                checkOut: null,
            },
        });

        if (openSession) {
            throw new BadRequestException('You have an open session. Please check out first.');
        }

        // 3. Create Log
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalized date part

        return this.prisma.attendanceLog.create({
            data: {
                employeeId: employee.id,
                orgId,
                date: today,
                checkIn: new Date(),
                status: AttendanceStatus.PRESENT,
                locationData: {
                    checkIn: { lat: dto.latitude, lng: dto.longitude, device: dto.device }
                } as any, // Cast to any for JSON
            },
        });
    }

    async checkOut(userId: string, orgId: string, dto: CheckOutDto) {
        const employee = await this.prisma.employee.findUnique({ where: { userId } });
        if (!employee) throw new NotFoundException('Employee record not found');

        const openSession = await this.prisma.attendanceLog.findFirst({
            where: {
                employeeId: employee.id,
                checkOut: null,
            },
        });

        if (!openSession) {
            throw new BadRequestException('No active check-in found to check out from.');
        }

        const checkOutTime = new Date();
        const durationMs = checkOutTime.getTime() - new Date(openSession.checkIn).getTime();
        const durationHours = durationMs / (1000 * 60 * 60);

        // Merge location data
        const currentLoc = (openSession.locationData as any) || {};
        const newLoc = {
            ...currentLoc,
            checkOut: { lat: dto.latitude, lng: dto.longitude }
        };

        return this.prisma.attendanceLog.update({
            where: { id: openSession.id },
            data: {
                checkOut: checkOutTime,
                durationHours: Number(durationHours.toFixed(2)),
                locationData: newLoc,
            },
        });
    }

    async getMyLogs(userId: string, orgId: string) {
        const employee = await this.prisma.employee.findUnique({ where: { userId } });
        if (!employee) throw new BadRequestException('Employee profile missing');

        return this.prisma.attendanceLog.findMany({
            where: { employeeId: employee.id, orgId },
            orderBy: { checkIn: 'desc' },
            take: 30
        });
    }
}
