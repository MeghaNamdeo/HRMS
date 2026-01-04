import { Controller, Get, Post, Body, Req, Param, UseGuards, UnauthorizedException } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRole } from '@enterprise-hrms/shared-types';
import { Request } from 'express';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Post()
    @Roles(UserRole.HR_ADMIN, UserRole.SUPER_ADMIN)
    create(@Body() createEmployeeDto: CreateEmployeeDto, @Req() req: Request) {
        if (!req.orgId) throw new UnauthorizedException('Org Context Missing');
        return this.employeesService.create(createEmployeeDto, req.orgId);
    }

    @Get()
    @Roles(UserRole.HR_ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER) // Restrict list to admins/managers
    findAll(@Req() req: Request) {
        if (!req.orgId) throw new UnauthorizedException('Org Context Missing');
        return this.employeesService.findAll(req.orgId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: Request) {
        if (!req.orgId) throw new UnauthorizedException('Org Context Missing');
        // In future: Check if user.sub == id (Employee viewing self) or Manager viewing reportee
        return this.employeesService.findOne(id, req.orgId);
    }
}
