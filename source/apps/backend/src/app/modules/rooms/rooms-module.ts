import { Module } from "@nestjs/common"
import RoomsGateway from "./gateways/rooms-gateway";
import RoomsMemberHandler from "./handlers/rooms-member-handler";
import RoomMapper from "./mappers/room-mapper";
import RoomBroadcasterService from "./services/room-broadcaster-service";

@Module({
  providers: [RoomsGateway, RoomsMemberHandler, RoomMapper, RoomBroadcasterService],
})
export default class RoomsModule {}
