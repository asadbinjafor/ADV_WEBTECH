import { IsNotEmpty, IsNumber, IsOptional, IsString, isString, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateCourseDto {
@IsString()
@IsNotEmpty()
 name: string;
@IsString()
@IsNotEmpty()
 code: string;
 @IsNotEmpty()
 @IsString()
 instructor: string;
 @IsNotEmpty()
 @IsNumber()
 @Min(1)
 @Max(6)
 @Type(() => Number)
 credits: number;
@IsString()
@IsOptional()
 description: string;
}