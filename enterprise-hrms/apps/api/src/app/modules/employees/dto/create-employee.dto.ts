import { IsEmail, IsNotEmpty, IsString, IsOptional, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class EmployeeProfileDto {
    @IsOptional() @IsString() mobile?: string;
    @IsOptional() @IsString() address?: string;
    @IsOptional() @IsDateString() dob?: string;
    @IsOptional() @IsString() gender?: string;
}

class EmployeeJobDto {
    @IsString() @IsNotEmpty() department: string;
    @IsString() @IsNotEmpty() designation: string;
    @IsDateString() joiningDate: string;
    @IsOptional() @IsString() managerId?: string;
    @IsOptional() @IsString() employmentType?: string;
}

export class CreateEmployeeDto {
    @IsEmail() @IsNotEmpty() email: string;

    @IsString() @IsNotEmpty() name: string;

    @IsString() @IsNotEmpty() code: string; // Employee Code

    @ValidateNested() @Type(() => EmployeeProfileDto)
    profile: EmployeeProfileDto;

    @ValidateNested() @Type(() => EmployeeJobDto)
    job: EmployeeJobDto;
}
