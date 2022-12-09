import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MarketsController } from './markets.controller';
import { MarketsService } from './markets.service';

@Module({
  imports: [PrismaModule],
  controllers: [MarketsController],
  providers: [MarketsService],
})
export class MarketsModule {}
