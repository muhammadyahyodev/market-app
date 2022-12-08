import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    const create = await this.authService.signup(authDto, res);
    console.log(create);
    return create;
  }

  @Post('signin')
  @HttpCode(HttpStatus.ACCEPTED)
  signin(@Body() authDto: AuthDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signin(authDto, res);
  }

  @Post('logout/:id')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    return await this.authService.logout(Number(id), res, req);
  }

  @Post('refreshtoken/:id')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    return await this.authService.refreshTokens(Number(id), res, req);
  }
}
