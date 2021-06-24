import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import User from 'src/users/user.entity';
import { Redis } from 'src/utils/redis';
import { UsersService } from '../../users/users.service';
import { TokenPayload } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    const redisKey = `Authorized_${payload.uid}`;
    const cache = await Redis.get<User>(redisKey);
    if (cache) {
      return cache;
    }
    const user = await this.userService.findOne(payload.uid);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    await Redis.set(redisKey, user, 60 * 2);
    return user;
  }
}
