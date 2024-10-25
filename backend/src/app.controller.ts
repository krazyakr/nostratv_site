import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/list')
  getItems() {
    return [
      { id: 1, name: 'Item One' },
      { id: 2, name: 'Item Two' },
      { id: 3, name: 'Item Three' },
    ];
  }
}
