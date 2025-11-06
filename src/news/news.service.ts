import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { eq, isNull, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { db } from '../db/drizzle.module';
import * as schema from '../db/schema/news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-dto-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createNewsDto: CreateNewsDto) {
    const [newNews] = await this.db
      .insert(schema.news)
      .values({
        title: createNewsDto.title,
        description: createNewsDto.description,
      })
      .returning();

    return newNews;
  }

  async findAll() {
    return await this.db
      .select()
      .from(schema.news)
      .where(isNull(schema.news.deleted_at))
      .orderBy(schema.news.created_at);
  }

  async findOne(id: string) {
    const [newsItem] = await this.db
      .select()
      .from(schema.news)
      .where(
        and(
          eq(schema.news.id, id),
          isNull(schema.news.deleted_at)
        )
      );

    if (!newsItem) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return newsItem;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    await this.findOne(id); 

    const [updatedNews] = await this.db
      .update(schema.news)
      .set({
        ...updateNewsDto,
        updated_at: new Date(),
      })
      .where(eq(schema.news.id, id))
      .returning();

    return updatedNews;
  }

  async remove(id: string) {
    await this.findOne(id); 

    const [deletedNews] = await this.db
      .update(schema.news)
      .set({
        deleted_at: new Date(),
      })
      .where(eq(schema.news.id, id))
      .returning();

    return deletedNews;
  }

  
  async forceRemove(id: string) {
    const [deletedNews] = await this.db
      .delete(schema.news)
      .where(eq(schema.news.id, id))
      .returning();

    if (!deletedNews) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return deletedNews;
  }
}
