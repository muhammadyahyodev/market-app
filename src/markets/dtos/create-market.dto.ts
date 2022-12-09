import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMarketDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
