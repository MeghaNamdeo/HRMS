import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { DbModule } from '@enterprise-hrms/db';

@Module({
    imports: [DbModule],
    controllers: [EmployeesController],
    providers: [EmployeesService],
    exports: [EmployeesService], // Export in case other modules need to fetch employees
})
export class EmployeesModule { }
