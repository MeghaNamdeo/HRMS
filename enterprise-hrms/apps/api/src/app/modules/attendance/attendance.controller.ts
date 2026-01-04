import { Controller, Post, Body, Req, UseGuards, UnauthorizedException, Get } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CheckInDto, CheckOutDto } from './dto/attendance.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post('check-in')
    checkIn(@Body() dto: CheckInDto, @Req() req: Request) {
        if (!req.orgId || !req.user) throw new UnauthorizedException();
        // Use user.id (sub) from JWT
        return this.attendanceService.checkIn((req.user as any).id, req.orgId, dto);
    }

    @Post('check-out')
    checkOut(@Body() dto: CheckOutDto, @Req() req: Request) {
        if (!req.orgId || !req.user) throw new UnauthorizedException();
        return this.attendanceService.checkOut((req.user as any).id, req.orgId, dto);
    }

    @Get('me')
    getMyLogs(@Req() req: Request) {
        if (!req.orgId || !req.user) throw new UnauthorizedException();
        return this.attendanceService.getMyLogs((req.user as any).id, req.orgId);
    }
}
