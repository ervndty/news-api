// src/news/dto/create-news.dto.ts
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateNewsDto {
  @ApiProperty({ 
    example: 'Breaking News Title',
    description: 'News title',
    maxLength: 255,
    minLength: 3,
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiProperty({ 
    example: 'This is the full description of the news article.',
    description: 'News description',
    minLength: 10,
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  @Transform(({ value }) => value?.trim())
  description: string;
}