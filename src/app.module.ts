import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MarketsModule } from './markets/markets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MarketsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
