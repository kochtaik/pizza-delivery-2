import { Role } from '@app/common';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class AssignRolesDto {
  @IsNotEmpty()
  @IsEnum(Role, { each: true })
  readonly roles: Array<Role>;
}
