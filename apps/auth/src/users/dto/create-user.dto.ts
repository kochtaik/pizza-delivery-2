import { IsNotEmpty, IsString } from 'class-validator';
import { LoginDto } from '../../dto/login.dto';

export class CreateUserDto extends LoginDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsString()
  lastName?: string;
}
