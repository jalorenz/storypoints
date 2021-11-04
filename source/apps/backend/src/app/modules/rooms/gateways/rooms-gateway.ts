import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway
} from "@nestjs/websockets";
import CreatedRoomDto from "../dtos/created-room-dto";
import { RoomEvents } from "../events";
import RoomsMemberHandler from "../handlers/rooms-member-handler";
import {Socket} from "socket.io";
import JoinedRoomDto from "../dtos/joined-room-dto";

@WebSocketGateway({ namespace: "rooms" })
export default class RoomsGateway implements OnGatewayDisconnect {
  constructor(private readonly roomsMemberHandler: RoomsMemberHandler) {}

  @SubscribeMessage(RoomEvents.createRoom)
  createRoom() : CreatedRoomDto {
    return this.roomsMemberHandler.createRoom()
  }

  @SubscribeMessage(RoomEvents.joinRoom)
  joinRoom(
    @MessageBody("id") id: string,
    @ConnectedSocket() socket: Socket,
  ) : JoinedRoomDto {
    return this.roomsMemberHandler.joinRoom(id, socket)
  }

  handleDisconnect(client: Socket): void {

  }
}
