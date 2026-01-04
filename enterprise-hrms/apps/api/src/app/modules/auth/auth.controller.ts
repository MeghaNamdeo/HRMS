import { Controller, Post, UseGuards, Request, Body, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalAuthGuard } from '../../core/guards/local-auth.guard'; // Will implement later if needed, direct service usage for now is fine for JSON-RPC style
import { AuthResponse } from '@enterprise-hrms/shared-types';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() req: any): Promise<AuthResponse> {
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() body: any) {
        // Basic dev registration for bootstrapping
        return this.authService.register(
            {
                email: body.email,
                name: body.name,
                role: body.role,
                orgId: body.orgId,
                passwordHash: '', // handled in service
            },
            body.password
        );
    }
}
