import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/types';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { name: createUserDto.name },
    });

    if (user) {
      throw new HttpException('This user already exists', HttpStatus.FORBIDDEN);
    }

    const newUser = await this.prisma.user.create({ data: createUserDto });

    if (!newUser) {
      throw new HttpException('Could not create user', HttpStatus.BAD_REQUEST);
    }

    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async getOneUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new HttpException('This user not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async updateUserById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    await this.getOneUserById(id);

    const user = await this.prisma.user.update({
      data: updateUserDto,
      where: { id },
    });

    if (!user) {
      throw new HttpException('User was not updated', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async deleteUserById(id: number): Promise<User> {
    const user = await this.prisma.user.delete({ where: { id } });
    if (!user) {
      throw new HttpException('User was not deleted', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
}
