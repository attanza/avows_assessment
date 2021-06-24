import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-authentication.guard';
import { IdPipe } from 'src/utils/id.pipe';
import User from './user.entity';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthenticationGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async all(): Promise<Array<User>> {
    return this.service.find({});
  }
  @Get(':id')
  async show(@Param() param: IdPipe): Promise<User> {
    return this.service.show(param.id);
  }

  @Post()
  async create(@Body() data: CreateUserDto): Promise<User> {
    await this.service.checkDuplicate('email', data.email);

    return this.service.create(data);
  }

  @Put(':id')
  async update(@Param() { id }: IdPipe, @Body() data: UpdateUserDto) {
    await this.service.checkDuplicate('email', data.email, id);
    return this.service.update(id, data);
  }

  @Delete(':id')
  async destroy(@Param() { id }: IdPipe) {
    await this.service.delete(id);
    return { message: 'User deleted' };
  }
}
