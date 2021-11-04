import { Module } from '@nestjs/common';
import RoomsModule from "./modules/rooms/rooms-module";

@Module({
  imports: [
    RoomsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
