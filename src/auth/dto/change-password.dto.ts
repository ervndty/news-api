import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ 
    example: 'oldPassword123',
    description: 'Current password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  oldPassword: string;

  @ApiProperty({ 
    example: 'newPassword456',
    description: 'New password (minimum 6 characters)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}