import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthInterceptor } from './auth.interceptor';

@Controller()
@UseInterceptors(AuthInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('searchCharacters')
  searchCharacters(
    @Query('type') type = '',
    @Query('season') season = '',
    @Query('episode') episode = '',
    @Query('title') title = '',
    @Query('character') character = ''
  ) {
    return this.appService.searchCharacters({
      type,
      season,
      episode,
      title,
      character,
    });
  }

  @Get('otherWorks')
  searchOtherWorks(@Query('actorId') actorId = '') {
    return this.appService.getOtherWorks({ actorId });
  }
}
