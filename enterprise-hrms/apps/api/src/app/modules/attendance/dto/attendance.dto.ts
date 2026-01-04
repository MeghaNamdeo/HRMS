import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CheckInDto {
    @IsNumber() latitude: number;
    @IsNumber() longitude: number;
    @IsOptional() @IsString() device?: string;
    @IsOptional() @IsString() reason?: string; // For late check-in regularization if needed
}

export class CheckOutDto {
    @IsNumber() latitude: number;
    @IsNumber() longitude: number;
}
