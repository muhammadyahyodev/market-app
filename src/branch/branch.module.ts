import { Module } from '@nestjs/common';
import { MarketsModule } from 'src/markets/markets.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';

@Module({
  imports: [PrismaModule, MarketsModule],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {}
