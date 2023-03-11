import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateProductDto {

    @IsString()
    @MinLength(1, {
        message: 'Tiene que se mayor a 1 carácter'
    })
    title: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;
    
    @IsString()
    @IsOptional()
    description?: string;
    
    @IsString()
    @IsOptional()
    slug?: string;
    
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({each: true}) // each para que cada uno de los valores del arreglo tenga que ser string
    @IsArray()
    sizes: string[];

    @IsIn(['men','women', 'kid', 'unisex'])
    gender: string;
}
