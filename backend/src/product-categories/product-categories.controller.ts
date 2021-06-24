import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-authentication.guard';
import { IdPipe } from 'src/utils/id.pipe';
import { ProductCategoriesService } from './product-categories.service';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from './product-category.dto';
import ProductCategory from './product-category.entity';

@UseGuards(JwtAuthenticationGuard)
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private readonly service: ProductCategoriesService) {}

  @Get()
  async all(): Promise<Array<ProductCategory>> {
    return this.service.find({});
  }
  @Get(':id')
  async show(@Param() param: IdPipe): Promise<ProductCategory> {
    return this.service.show(param.id);
  }

  @Post()
  async create(
    @Body() data: CreateProductCategoryDto
  ): Promise<ProductCategory> {
    await this.service.checkDuplicate('name', data.name);
    return this.service.create(data);
  }

  @Put(':id')
  async update(
    @Param() { id }: IdPipe,
    @Body() data: UpdateProductCategoryDto
  ) {
    await this.service.checkDuplicate('name', data.name, id);
    return this.service.update(id, data);
  }

  @Delete(':id')
  async destroy(@Param() { id }: IdPipe) {
    await this.service.delete(id);
    return { message: 'Product Category deleted' };
  }
}
