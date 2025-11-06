import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './db/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './news/news.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    NewsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
