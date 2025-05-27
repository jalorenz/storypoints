import { NestFactory } from '@nestjs/core';
import RoomsModule from './modules/rooms/rooms.module';
import { Module } from '@nestjs/common';
import StaticFrontendModule from './modules/static-frontend/static-frontend.module';

@Module({
  imports: [RoomsModule, StaticFrontendModule]
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
