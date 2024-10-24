import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // Set global prefix
  app.enableCors(); // Enable CORS
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
