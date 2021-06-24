import {
  BadRequestException,
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
import { ProductCategoriesService } from 'src/product-categories/product-categories.service';
import { IdPipe } from 'src/utils/id.pipe';
import { PaginationParams } from 'src/utils/paginationParams';
import Product from './product.entity';
import { CreateProductDto, UpdateProductDto } from './products.dto';
import { ProductsService } from './products.service';

@UseGuards(JwtAuthenticationGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private readonly service: ProductsService,
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Get()
  async all(@Query() query: PaginationParams) {
    return this.service.paginate(query, 'name');
  }
  @Get(':id')
  async show(@Param() param: IdPipe): Promise<Product> {
    return this.service.show(param.id);
  }

  @Post()
  async create(@Body() data: CreateProductDto): Promise<Product> {
    const [found] = await Promise.all([
      this.productCategoriesService.findOne({
        id: data.category,
      }),
      this.service.checkDuplicate('name', data.name),
    ]);
    if (!found) {
      throw new BadRequestException('Category not found');
    }

    return this.service.create(data);
  }

  @Put(':id')
  async update(@Param() { id }: IdPipe, @Body() data: UpdateProductDto) {
    const promises: any[] = [];
    if (data.category) {
      promises.push(
        this.productCategoriesService.findOne({
          id: data.category,
        }),
      );
    }
    promises.push(this.service.checkDuplicate('name', data.name, id));
    const [found] = await Promise.all(promises);
    if (data.category && !found) {
      throw new BadRequestException('Category not found');
    }
    return this.service.update(id, data);
  }

  @Delete(':id')
  async destroy(@Param() { id }: IdPipe) {
    await this.service.delete(id);
    return { message: 'Product deleted' };
  }
}
