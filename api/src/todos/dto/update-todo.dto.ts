import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  detalhe?: string | null;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
