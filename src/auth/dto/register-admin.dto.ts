import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAuthAdminDto {
  @ApiProperty({ 
    example: 'admin',
    description: 'Admin username (3-100 characters)',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  username: string;

  @ApiProperty({ 
    example: 'admin123',
    description: 'Admin password (6-255 characters)',
    minLength: 6,
    maxLength: 255,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}