import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-authentication.guard';
import { IdPipe } from 'src/utils/id.pipe';
import { PaginationParams } from 'src/utils/paginationParams';

import Order from './order.entity';
import { CreateOrderDto } from './orders.dto';
import { OrdersService } from './orders.service';

@UseGuards(JwtAuthenticationGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  async all(@Query() query: PaginationParams) {
    return this.service.paginate(query, 'code', [
      'orderItems',
      'orderItems.product',
    ]);
  }
  @Get('orders-dashboard')
  async dashboard() {
    return this.service.getForDashboard();
  }
  @Get(':id')
  async show(@Param() param: IdPipe): Promise<Order> {
    return this.service.show(param.id, ['orderItems', 'orderItems.product']);
  }

  @Post()
  async create(@Body() data: CreateOrderDto): Promise<Order> {
    return this.service.createOrder(data);
  }

  @Put(':id')
  async update(@Param() { id }: IdPipe, @Body() data: CreateOrderDto) {
    return this.service.updateOrder(id, data);
  }

  @Delete(':id')
  async destroy(@Param() { id }: IdPipe) {
    await this.service.deleteOrder(id);
    return { message: 'Order deleted' };
  }
}
