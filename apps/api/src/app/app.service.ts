import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hi, welcome to api!' + process.env.TMDB_TOKEN };
  }
}
