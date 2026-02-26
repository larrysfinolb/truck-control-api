import { IsPhoneNumber, IsString } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
