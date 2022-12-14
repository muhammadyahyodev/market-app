import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth-jwt.guard';
import { User } from 'src/types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string): Promise<User> {
    return this.userService.getOneUserById(Number(id));
  }
}
