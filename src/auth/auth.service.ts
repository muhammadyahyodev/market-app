import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dtos';
import * as bcrypt from 'bcryptjs';
import { JwtPayload, Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(authDto: AuthDto, res: Response): Promise<Tokens> {
    const { name, password } = authDto;

    const condidate = await this.prisma.user.findFirst({
      where: { name },
    });

    if (condidate) {
      throw new HttpException('This condidate exists', HttpStatus.FORBIDDEN);
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    const user = await this.prisma.user.create({
      data: {
        name,
        password: hashedPassword,
      },
    });

    const tokens = await this.getTokens(user.id, user.name);
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 1000,
      httpOnly: true,
    });

    return tokens;
  }

  async signin(authDto: AuthDto, res: Response) {
    const { name, password } = authDto;

    const user = await this.prisma.user.findFirst({
      where: { name },
    });

    if (!user) {
      throw new HttpException(
        'This condidate not exists',
        HttpStatus.NOT_FOUND,
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new ForbiddenException('Access denaid');
    }

    const tokens = await this.getTokens(user.id, user.name);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 1000,
      httpOnly: true,
    });

    return tokens;
  }

  async logout(id: number, res: Response, req: Request) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) throw new ForbiddenException('User not found');

    const refreshToken = req.cookies.refresh_token;

    const check = await this.jwtService.verify(refreshToken, {
      publicKey: process.env.REFRESH_TOKEN_KEY,
    });

    if (check.id !== user.id) {
      throw new HttpException('Access Denaid', HttpStatus.NOT_FOUND);
    }

    res.clearCookie('refresh_token');
    return true;
  }

  async refreshTokens(id: number, res: Response, req: Request) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new ForbiddenException('Access denied');
    }
    const refreshToken = req.cookies.refresh_token;

    const check = await this.jwtService.verify(refreshToken, {
      publicKey: process.env.REFRESH_TOKEN_KEY,
    });

    if (!user || !check) {
      throw new HttpException('Access Denaid', HttpStatus.NOT_FOUND);
    }

    if (check.id !== user.id) {
      throw new HttpException('Access Denaid', HttpStatus.NOT_FOUND);
    }

    const tokens = await this.getTokens(user.id, user.name);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 1000,
      httpOnly: true,
    });

    return tokens;
  }

  private async getTokens(userId: number, name: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      name: name,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
