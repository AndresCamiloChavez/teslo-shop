import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{


    @IsOptional()
    @IsPositive()
    @Type(() => Number) // realizar la conversión de directamente
    limit?: number;

    @IsOptional()
    @IsPositive()    
    @Min(0)
    @Type(() => Number) // realizar la conversión de directamente
    offset?: number;

}