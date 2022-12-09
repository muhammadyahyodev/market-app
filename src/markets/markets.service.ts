import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMarketDto } from './dtos/create-market.dto';
import { UpdateMarketDto } from './dtos/update.market.dto';

@Injectable()
export class MarketsService {
  constructor(private readonly prisma: PrismaService) {}

  async createMarket(createMarketDto: CreateMarketDto) {
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

  async getAllMarkets() {
    const markets = await this.prisma.market.findMany();
    return markets;
  }

  async getOneMarketById(id: number) {
    const market = await this.prisma.market.findFirst({ where: { id } });
    return market;
  }

  async updateMarket(id: number, updateMarketDto: UpdateMarketDto) {
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

  // Kamchilik bor
  async deleteMarket(id: number) {
    this.getOneMarketById(id);
    const deletedMarket = await this.prisma.market.delete({ where: { id } });
    if (!deletedMarket) {
      throw new HttpException({ reason: 'Not found' }, HttpStatus.NOT_FOUND);
    }
    return deletedMarket;
  }
}
