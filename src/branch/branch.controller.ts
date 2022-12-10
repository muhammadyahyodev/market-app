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
import { Branch } from 'src/types';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dtos/create-branch.dto';
import { UpdateBranchDto } from './dtos/update-branch.sto';

@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBranchDto: CreateBranchDto): Promise<Branch> {
    return this.branchService.createBranch(createBranchDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<Branch[]> {
    return this.branchService.getAllBranches();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string): Promise<Branch> {
    return this.branchService.getOneBranchById(Number(id));
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updatebranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    return this.branchService.updateBranch(Number(id), updatebranchDto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string): Promise<Branch> {
    return this.branchService.deleteBranch(Number(id));
  }
}
