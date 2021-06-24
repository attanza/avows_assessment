import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import User from 'src/users/user.entity';
import { CreateUserDto } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(data: CreateUserDto): Promise<User> {
    await this.userService.checkDuplicate('email', data.email);
    return this.userService.create(data);
  }

  async login(data: LoginDto): Promise<User> {
    const user = await this.userService.findOne({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Login failed');
    }
    const verified = await verify(user.password, data.password);
    if (!verified) {
      throw new UnauthorizedException('Login failed');
    }
    return user;
  }

  public getCookieWithJwtToken(uid: string) {
    const payload: TokenPayload = { uid };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  public logout() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
