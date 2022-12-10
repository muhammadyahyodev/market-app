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
import { Worker } from 'src/types';
import { CreateWorkerDto } from './dtos/create-worker.dto';
import { UpdateWorkerDto } from './dtos/update-worker.dto';
import { WorkersService } from './workers.service';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workerService: WorkersService) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createWorkerDto: CreateWorkerDto): Promise<Worker> {
    return this.workerService.createWorker(createWorkerDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<Worker[]> {
    return this.workerService.getAllWorkers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string): Promise<Worker> {
    return this.workerService.getOneWorkerById(Number(id));
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateWorkerDto: UpdateWorkerDto,
  ): Promise<Worker> {
    return this.workerService.updateWorker(Number(id), updateWorkerDto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string): Promise<Worker> {
    return this.workerService.deleteWorker(Number(id));
  }
}
