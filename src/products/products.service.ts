import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from 'src/types';
import { CreateProductDto, UpdateProductDto } from './dtos';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { title, price, branch_id } = createProductDto;
    const product = await this.prisma.product.findFirst({
      where: { title },
    });
    if (product) {
      throw new HttpException(
        { reason: 'Product already exists' },
        HttpStatus.FORBIDDEN,
      );
    }
    const newProduct = await this.prisma.product.create({
      data: {
        title,
        price,
        branch_id,
      },
    });

    return newProduct;
  }

  async getAllProduct(): Promise<Product[]> {
    const product = await this.prisma.product.findMany();
    return product;
  }

  async getOneProductById(id: number): Promise<Product> {
    const product = await this.prisma.product.findFirst({ where: { id } });
    return product;
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.getOneProductById(id);

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    if (!updatedProduct) {
      throw new HttpException(
        { reason: 'Bad Request' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<Product> {
    await this.getOneProductById(id);

    const deletedProduct = await this.prisma.product.delete({ where: { id } });
    if (!deletedProduct) {
      throw new HttpException({ reason: 'Not found' }, HttpStatus.NOT_FOUND);
    }
    return deletedProduct;
  }
}
