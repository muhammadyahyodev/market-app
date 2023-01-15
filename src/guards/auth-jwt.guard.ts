import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();

      const authHeader = req.headers.authorization;

      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      const user = this.jwtService.verify(token, {
        publicKey: process.env.ACCESS_TOKEN_KEY,
      });

      return true;
    } catch (error) {
      throw new ForbiddenException('Access denaid');
    }
  }
}
