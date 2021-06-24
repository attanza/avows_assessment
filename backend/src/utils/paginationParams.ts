import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export enum ESortMode {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  @IsIn(Object.values(ESortMode))
  sortMode?: ESortMode;

  @IsOptional()
  search?: string;

  @IsOptional()
  select?: string;

  @IsOptional()
  fieldKey?: any;

  @IsOptional()
  fieldValue?: any;

  @IsOptional()
  regexKey?: any;

  @IsOptional()
  regexValue?: any;

  @IsOptional()
  between: string;
}
