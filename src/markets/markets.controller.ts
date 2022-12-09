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
} from '@nestjs/common';
import { CreateMarketDto } from './dtos/create-market.dto';
import { UpdateMarketDto } from './dtos/update.market.dto';
import { MarketsService } from './markets.service';

@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMarketDto: CreateMarketDto) {
    return this.marketsService.createMarket(createMarketDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.marketsService.getAllMarkets();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string) {
    return this.marketsService.getOneMarketById(Number(id));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketsService.updateMarket(Number(id), updateMarketDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string) {
    return this.marketsService.deleteMarket(Number(id));
  }
}
