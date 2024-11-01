import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @IsString({ message: 'O título deve ser uma string.' })
  title: string;

  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  @IsString({ message: 'A descrição deve ser uma string.' })
  description: string;

  @IsNotEmpty({ message: 'O e-mail do usuário é obrigatório.' })
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  userEmail: string;
}
