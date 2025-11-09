import { ApiProperty } from '@nestjs/swagger';

export class NewsResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'News UUID',
  })
  id: string;

  @ApiProperty({
    example: 'Breaking News',
    description: 'News title',
  })
  title: string;

  @ApiProperty({
    example: 'This is the news description...',
    description: 'News description',
  })
  description: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation timestamp',
    nullable: true,
  })
  created_at: Date | null;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Last update timestamp',
    nullable: true,
  })
  updated_at: Date | null;

  @ApiProperty({
    example: null,
    description: 'Deletion timestamp (soft delete)',
    nullable: true,
  })
  deleted_at: Date | null;
}
