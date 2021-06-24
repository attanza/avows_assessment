import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;
}

export class UpdateProductCategoryDto extends PartialType(
  CreateProductCategoryDto
) {}
