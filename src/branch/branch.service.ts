import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MarketsService } from 'src/markets/markets.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Branch } from 'src/types';
import { CreateBranchDto, UpdateBranchDto } from './dtos';

@Injectable()
export class BranchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly marketService: MarketsService,
  ) {}

  async createBranch(createBranchDto: CreateBranchDto): Promise<Branch> {
    const { name, address, market_id } = createBranchDto;

    await this.marketService.getOneMarketById(market_id);

    // const market = await this.prisma.market.findFirst({
    //   where: { id: market_id },
    // });

    // if (!market) {
    //   throw new HttpException(
    //     'Not found market with this id',
    //     HttpStatus.NOT_FOUND,
    //   );
    // }

    const branch = await this.prisma.branch.findFirst({ where: { name } });

    if (branch) {
      throw new HttpException(
        { reason: 'Branch already exists' },
        HttpStatus.FORBIDDEN,
      );
    }
    const newBranch = await this.prisma.branch.create({
      data: {
        name,
        address,
        market_id,
      },
    });

    return newBranch;
  }

  async getAllBranches(): Promise<Branch[]> {
    const branches = await this.prisma.branch.findMany();
    return branches;
  }

  async getOneBranchById(id: number): Promise<Branch> {
    const branch = await this.prisma.branch.findFirst({ where: { id } });

    if (!branch) {
      throw new HttpException(
        'Nor found branch with this id',
        HttpStatus.NOT_FOUND,
      );
    }

    return branch;
  }

  async updateBranch(
    id: number,
    updateBranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    await this.getOneBranchById(id);

    if (updateBranchDto.market_id) {
      await this.marketService.getOneMarketById(updateBranchDto.market_id);
    }

    const updatedBranch = await this.prisma.branch.update({
      where: { id },
      data: updateBranchDto,
    });

    return updatedBranch;
  }

  async deleteBranch(id: number): Promise<Branch> {
    await this.getOneBranchById(id);

    await this.prisma.product.deleteMany({
      where: { branch_id: id },
    });

    await this.prisma.worker.deleteMany({
      where: { branch_id: id },
    });

    const branch = await this.prisma.branch.delete({ where: { id } });
    return branch;
  }
}
