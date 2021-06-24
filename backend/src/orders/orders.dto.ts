import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  qty: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
