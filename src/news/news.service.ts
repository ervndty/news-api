import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { eq, isNull, and } from 'drizzle-orm';
import * as schema from '../db/schema/news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-dto-news.dto';
import { NewsResponseDto } from './dto/news-response.dto';
import type { DbType } from '../db/drizzle.module';
import type { News } from '../db/schema/news.schema';

@Injectable()
export class NewsService {
  constructor(@Inject('DB') private db: DbType) {}

  async create(createNewsDto: CreateNewsDto): Promise<NewsResponseDto> {
    const [newNews] = await this.db
      .insert(schema.news)
      .values({
        title: createNewsDto.title,
        description: createNewsDto.description,
      })
      .returning();

    if (!newNews) {
      throw new NotFoundException('Failed to create news');
    }

    return this.mapToResponseDto(newNews);
  }

  async findAll(): Promise<NewsResponseDto[]> {
    const newsList = await this.db
      .select()
      .from(schema.news)
      .where(isNull(schema.news.deleted_at))
      .orderBy(schema.news.created_at);

    return newsList.map((item) => this.mapToResponseDto(item));
  }

  async findOne(id: string): Promise<NewsResponseDto> {
    const [newsItem] = await this.db
      .select()
      .from(schema.news)
      .where(and(eq(schema.news.id, id), isNull(schema.news.deleted_at)));

    if (!newsItem) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return this.mapToResponseDto(newsItem);
  }

  async update(
    id: string,
    updateNewsDto: UpdateNewsDto,
  ): Promise<NewsResponseDto> {
    await this.findOne(id);

    const updateData: Partial<typeof schema.news.$inferInsert> = {
      updated_at: new Date(),
    };

    if (updateNewsDto.title !== undefined) {
      updateData.title = updateNewsDto.title;
    }

    if (updateNewsDto.description !== undefined) {
      updateData.description = updateNewsDto.description;
    }

    const [updatedNews] = await this.db
      .update(schema.news)
      .set(updateData)
      .where(eq(schema.news.id, id))
      .returning();

    if (!updatedNews) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return this.mapToResponseDto(updatedNews);
  }

  async remove(
    id: string,
  ): Promise<{ message: string; data: NewsResponseDto }> {
    const existing = await this.findOne(id);

    const [deletedNews] = await this.db
      .update(schema.news)
      .set({
        deleted_at: new Date(),
        updated_at: new Date(),
      })
      .where(eq(schema.news.id, id))
      .returning();

    if (!deletedNews) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return {
      message: `News "${existing.title}" berhasil dihapus.`,
      data: this.mapToResponseDto(deletedNews),
    };
  }

  async forceRemove(
    id: string,
  ): Promise<{ message: string; data: NewsResponseDto }> {
    const [deletedNews] = await this.db
      .delete(schema.news)
      .where(eq(schema.news.id, id))
      .returning();

    if (!deletedNews) {
      throw new NotFoundException(`News dengan ID ${id} tidak ditemukan.`);
    }

    return {
      message: `News "${deletedNews.title}" telah dihapus permanen.`,
      data: this.mapToResponseDto(deletedNews),
    };
  }

  private mapToResponseDto(news: News): NewsResponseDto {
    return {
      id: news.id,
      title: news.title,
      description: news.description,
      created_at: news.created_at ?? null,
      updated_at: news.updated_at ?? null,
      deleted_at: news.deleted_at ?? null,
    };
  }
}
