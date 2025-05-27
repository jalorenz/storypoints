import { Module } from '@nestjs/common';
import { RoomsGateway } from './gateways/RoomsGateway';

@Module({
    providers: [RoomsGateway],
})
export default class RoomsModule {}