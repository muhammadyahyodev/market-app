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
import { Product } from 'src/types';
import { CreateProductDto, UpdateProductDto } from './dtos';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productServuce: ProductsService) {}

  @UseGuards(AuthGuard)
  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productServuce.createProduct(createProductDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<Product[]> {
    return this.productServuce.getAllProduct();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string): Promise<Product> {
    return this.productServuce.getOneProductById(Number(id));
  }

  @UseGuards(AuthGuard)
  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productServuce.updateProduct(Number(id), updateProductDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string): Promise<Product> {
    return this.productServuce.deleteProduct(Number(id));
  }
}
