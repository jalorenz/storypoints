import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as process from 'node:process';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath:
        process.env.FRONTEND_DIRECTORY ?? `${__dirname}/../../frontend/out`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
