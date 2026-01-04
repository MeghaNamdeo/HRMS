import { Controller, Get, Post, Body, Req, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { UserRole } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() body: any, @Req() req: Request) {
        if (!req.orgId) {
            throw new BadRequestException('Organization Context Missing');
        }
        // In a real app, use DTOs with validation
        return this.usersService.create(body, req.orgId);
    }

    @Get()
    async findAll(@Req() req: Request) {
        if (!req.orgId) {
            throw new BadRequestException('Organization Context Missing');
        }
        return this.usersService.findAll(req.orgId);
    }

    @Get('me')
    getMe(@Req() req: Request) {
        return {
            message: 'This is a protected route',
            orgId: req.orgId || 'None',
        };
    }
}
