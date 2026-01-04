
import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface to include orgId
declare global {
    namespace Express {
        interface Request {
            orgId?: string;
        }
    }
}

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const orgId = req.headers['x-org-id'] as string;

        if (!orgId) {
            // In a real app, you might allow some public routes without orgId, 
            // but for core SaaS usage, it's often required. 
            // We can make this strict or lenient based on route.
            // For now, let's log it and optionally block or allow.
            // throw new BadRequestException('Organization Header (x-org-id) is missing');
        }

        if (orgId) {
            req.orgId = orgId;
        }

        next();
    }
}
