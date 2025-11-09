import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-dto-news.dto';
import { NewsResponseDto } from './dto/news-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new news article (Requires Authentication)',
  })
  @ApiResponse({
    status: 201,
    description: 'News article created successfully',
    type: NewsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
  })
  async create(@Body() createNewsDto: CreateNewsDto): Promise<NewsResponseDto> {
    return await this.newsService.create(createNewsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all news articles' })
  @ApiResponse({
    status: 200,
    description: 'List of all news articles',
    type: [NewsResponseDto],
  })
  async findAll(): Promise<NewsResponseDto[]> {
    return await this.newsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a news article by ID' })
  @ApiResponse({
    status: 200,
    description: 'News article found',
    type: NewsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'News article not found',
  })
  async findOne(@Param('id') id: string): Promise<NewsResponseDto> {
    return await this.newsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a news article (Requires Authentication)' })
  @ApiResponse({
    status: 200,
    description: 'News article updated successfully',
    type: NewsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
  })
  @ApiResponse({
    status: 404,
    description: 'News article not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ): Promise<NewsResponseDto> {
    return await this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a news article (Requires Authentication)' })
  @ApiResponse({
    status: 200,
    description: 'News article deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
  })
  @ApiResponse({
    status: 404,
    description: 'News article not found',
  })
  async remove(
    @Param('id') id: string,
  ): Promise<{ message: string; data: NewsResponseDto }> {
    return await this.newsService.remove(id);
  }
}
