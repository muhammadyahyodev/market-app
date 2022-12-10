import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Market } from 'src/types';
import { CreateMarketDto, UpdateMarketDto } from './dtos';

@Injectable()
export class MarketsService {
  constructor(private readonly prisma: PrismaService) {}

  async createMarket(createMarketDto: CreateMarketDto): Promise<Market> {
    const { name } = createMarketDto;
    const market = await this.prisma.market.findFirst({ where: { name } });
    if (market) {
      throw new HttpException(
        { reason: 'Market already exists' },
        HttpStatus.FORBIDDEN,
      );
    }

    const newMarket = await this.prisma.market.create({
      data: createMarketDto,
    });

    return newMarket;
  }

  async getAllMarkets(): Promise<Market[]> {
    const markets = await this.prisma.market.findMany();
    return markets;
  }

  async getOneMarketById(id: number): Promise<Market> {
    const market = await this.prisma.market.findFirst({ where: { id } });

    if (!market) {
      throw new HttpException(
        'Not found market with this id',
        HttpStatus.NOT_FOUND,
      );
    }

    return market;
  }

  async updateMarket(
    id: number,
    updateMarketDto: UpdateMarketDto,
  ): Promise<Market> {
    await this.getOneMarketById(id);

    const updatedMarket = await this.prisma.market.update({
      where: { id },
      data: updateMarketDto,
    });

    if (!updatedMarket) {
      throw new HttpException(
        { reason: 'Bad Request' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return updatedMarket;
  }

  async deleteMarket(id: number): Promise<Market> {
    await this.getOneMarketById(id);

    await this.prisma.branch.deleteMany({
      where: { market_id: id },
    });

    const deletedMarket = await this.prisma.market.delete({ where: { id } });

    return deletedMarket;
  }
}
