import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

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
