import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class NewsResponseDto {
  @Expose()
  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'News unique identifier',
  })
  id: string;

  @Expose()
  @ApiProperty({ 
    example: 'Breaking News Title',
    description: 'News title',
  })
  title: string;

  @Expose()
  @ApiProperty({ 
    example: 'This is the full description of the news article.',
    description: 'News description',
  })
  description: string;

  @Expose()
  @ApiProperty({ 
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({ 
    example: '2024-01-01T00:00:00.000Z',
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}