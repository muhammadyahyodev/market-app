import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MarketsModule } from './markets/markets.module';
import { BranchModule } from './branch/branch.module';
import { BranchService } from './branch/branch.service';
import { WorkersModule } from './workers/workers.module';
import { ProductsModule } from './products/products.module';
import { ProductsService } from './products/products.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MarketsModule,
    BranchModule,
    WorkersModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [BranchService, ProductsService],
})
export class AppModule {}
