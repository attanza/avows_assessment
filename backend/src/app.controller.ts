import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('seed')
  async seeder() {
    const NODE_ENV = this.configService.get<string>('NODE_ENV');
    if (NODE_ENV !== 'development') {
      return { message: 'Seeder can only be done on development' };
    }
    await this.appService.seed();
    return { message: 'Seeding succeed' };
  }
}
