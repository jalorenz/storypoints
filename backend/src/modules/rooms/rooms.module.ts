import { Module } from '@nestjs/common';
import { RoomGateway } from './gateways/RoomGateway';
import { RoomHandler } from './domain/room.handler';

@Module({
    providers: [RoomGateway, RoomHandler],
})
export default class RoomsModule {}