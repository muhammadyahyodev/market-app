import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Worker } from 'src/types';
import { CreateWorkerDto, UpdateWorkerDto } from './dtos';

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService) {}

  async createWorker(createWorkerDto: CreateWorkerDto): Promise<Worker> {
    const { name, phone_number, branch_id } = createWorkerDto;
    const worker = await this.prisma.worker.findFirst({
      where: { phone_number },
    });
    if (worker) {
      throw new HttpException(
        { reason: 'Worker already exists' },
        HttpStatus.FORBIDDEN,
      );
    }
    const newWorker = await this.prisma.worker.create({
      data: {
        name,
        phone_number,
        branch_id,
      },
    });

    return newWorker;
  }

  async getAllWorkers(): Promise<Worker[]> {
    const workers = await this.prisma.worker.findMany();
    return workers;
  }

  async getOneWorkerById(id: number): Promise<Worker> {
    const worker = await this.prisma.worker.findFirst({ where: { id } });
    return worker;
  }

  async updateWorker(
    id: number,
    updateWorkerDto: UpdateWorkerDto,
  ): Promise<Worker> {
    await this.getOneWorkerById(id);

    const updatedWorker = await this.prisma.worker.update({
      where: { id },
      data: updateWorkerDto,
    });

    if (!updatedWorker) {
      throw new HttpException(
        { reason: 'Bad Request' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return updatedWorker;
  }

  async deleteWorker(id: number): Promise<Worker> {
    await this.getOneWorkerById(id);

    const deletedWorker = await this.prisma.worker.delete({ where: { id } });
    if (!deletedWorker) {
      throw new HttpException({ reason: 'Not found' }, HttpStatus.NOT_FOUND);
    }
    return deletedWorker;
  }
}
