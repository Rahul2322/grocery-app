import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator";
import { GENDER, UserRole } from "../entity/user.entity";

export class CreateUserDto {
  @IsNotEmpty() 
  username!: string;

  @IsNotEmpty()
  @IsEmail()
   email!: string;

  @IsNotEmpty() 
  @IsStrongPassword() 
  password!: string;

  @IsEnum(GENDER) 
  gender!: GENDER;

  @IsOptional()
  @IsEnum(UserRole)
  role!: UserRole;
}
export class UpdateUserDto extends CreateUserDto {}
