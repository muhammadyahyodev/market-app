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
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/types';
import { Tokens } from 'src/types/tokens';
import { JwtPayload } from 'src/types/jwt-payload.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(authDto: AuthDto, res: Response): Promise<Tokens> {
    const { name, password } = authDto;

    const condidate: User = await this.prisma.user.findFirst({
      where: { name },
    });

    if (condidate) {
      throw new HttpException(
        { reason: 'Already exists' },
        HttpStatus.FORBIDDEN,
      );
    }

    const hashedPassword: string = await bcrypt.hash(password, 7);

    const user: User = await this.prisma.user.create({
      data: {
        name,
        password: hashedPassword,
      },
    });

    const tokens: Tokens = await this.getTokens(user.id, user.name);
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 1000,
      httpOnly: true,
    });

    return tokens;
  }

  async signin(authDto: AuthDto, res: Response): Promise<Tokens> {
    const { name, password } = authDto;

    const user: User = await this.prisma.user.findFirst({
      where: { name },
    });

    if (!user) {
      throw new HttpException({ reason: 'Not found' }, HttpStatus.NOT_FOUND);
    }

    const passwordMatches: string = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new ForbiddenException('Access denaid');
    }

    const tokens: Tokens = await this.getTokens(user.id, user.name);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 1000,
      httpOnly: true,
    });

    return tokens;
  }

  async logout(id: number, res: Response, req: Request): Promise<boolean> {
    const user: User = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) throw new ForbiddenException('Not found');

    const refreshToken: string = req.cookies.refresh_token;

    const check = await this.jwtService.verify(refreshToken, {
      publicKey: process.env.REFRESH_TOKEN_KEY,
    });

    if (check.sub !== user.id) {
      throw new HttpException('Access Denaid', HttpStatus.NOT_FOUND);
    }

    res.clearCookie('refresh_token');
    return true;
  }

  async refreshTokens(res: Response, req: Request): Promise<Tokens> {
    const refreshToken: string = req.cookies.refresh_token;

    const check = await this.jwtService.verify(refreshToken, {
      publicKey: process.env.REFRESH_TOKEN_KEY,
    });

    const tokens: Tokens = await this.getTokens(check.sub, check.name);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 1000,
      httpOnly: true,
    });

    return tokens;
  }

  async getAll() {
    const users = await this.prisma.user.findMany();
    return users;
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
