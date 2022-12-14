import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth-jwt.guard';
import { Market } from 'src/types';
import { CreateMarketDto } from './dtos/create-market.dto';
import { UpdateMarketDto } from './dtos/update.market.dto';
import { MarketsService } from './markets.service';

@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @UseGuards(AuthGuard)
  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMarketDto: CreateMarketDto): Promise<Market> {
    return this.marketsService.createMarket(createMarketDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<Market[]> {
    return this.marketsService.getAllMarkets();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string): Promise<Market> {
    return this.marketsService.getOneMarketById(Number(id));
  }

  @UseGuards(AuthGuard)
  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateMarketDto: UpdateMarketDto,
  ): Promise<Market> {
    return this.marketsService.updateMarket(Number(id), updateMarketDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string): Promise<Market> {
    return this.marketsService.deleteMarket(Number(id));
  }
}
