import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email (Must be a valid email address)',
    example: 'mock@mock.com',
  })
  declare email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword()
  @ApiProperty({
    description:
      'Strong password (Must be at least 8 characters, include uppercase, lowercase, number, and special character)',
    example: 'M0ck!123',
  })
  declare password: string;
}

