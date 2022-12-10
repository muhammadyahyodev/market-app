import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBranchDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly address: string;

  @IsOptional()
  @IsNumber()
  readonly market_id: number;
}
