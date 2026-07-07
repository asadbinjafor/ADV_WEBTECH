import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  instructor?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(6)
  @Type(() => Number)
  credits?: number;

  @IsString()
  @IsOptional()
  description?: string;
}