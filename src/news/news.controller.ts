import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from '../news/dto/create-news.dto';
import { UpdateNewsDto } from '../news/dto/update-dto-news.dto';
import { NewsResponseDto } from '../news/dto/news-response.dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('News')
@Controller('news')
@UseInterceptors(ClassSerializerInterceptor)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new news article' })
  @ApiResponse({
    status: 201,
    description: 'News article created successfully',
    type: NewsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createNewsDto: CreateNewsDto) {
    const news = await this.newsService.create(createNewsDto);
    return plainToInstance(NewsResponseDto, news);
  }

  @Get()
  @ApiOperation({ summary: 'Get all news articles' })
  @ApiResponse({
    status: 200,
    description: 'List of all news articles',
    type: [NewsResponseDto],
  })
  async findAll() {
    const newsList = await this.newsService.findAll();
    return plainToInstance(NewsResponseDto, newsList);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a news article by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'News article found',
    type: NewsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'News not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const news = await this.newsService.findOne(id);
    return plainToInstance(NewsResponseDto, news);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a news article' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'News article updated successfully',
    type: NewsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'News not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    const news = await this.newsService.update(id, updateNewsDto);
    return plainToInstance(NewsResponseDto, news);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a news article' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'News article deleted successfully' })
  @ApiResponse({ status: 404, description: 'News not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.newsService.remove(id);
    return result;
  }
}