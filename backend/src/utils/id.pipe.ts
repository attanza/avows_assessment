import { IsNotEmpty, IsUUID } from 'class-validator';

export class IdPipe {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
