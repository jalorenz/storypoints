import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway
} from "@nestjs/websockets";
import CreatedRoomDto from "../dtos/created-room-dto";
import {IncomingRoomEvents} from "../events";
import RoomsMemberHandler from "../handlers/rooms-member-handler";
import {Socket} from "socket.io";
import JoinedRoomDto from "../dtos/joined-room-dto";

@WebSocketGateway({ namespace: "rooms" })
export default class RoomsGateway implements OnGatewayDisconnect {
  constructor(private readonly roomsMemberHandler: RoomsMemberHandler) {}

  @SubscribeMessage(IncomingRoomEvents.createRoom)
  createRoom() : CreatedRoomDto {
    return this.roomsMemberHandler.createRoom()
  }

  @SubscribeMessage(IncomingRoomEvents.joinRoom)
  joinRoom(
    @MessageBody("id") id: string,
    @ConnectedSocket() socket: Socket,
  ) : JoinedRoomDto {
    return this.roomsMemberHandler.joinRoom(id, socket)
  }

  @SubscribeMessage(IncomingRoomEvents.vote)
  vote(
    @MessageBody("estimation") estimation: number,
    @ConnectedSocket() socket: Socket,
  ) : void {
    this.roomsMemberHandler.vote(socket, estimation)
  }

  handleDisconnect(@ConnectedSocket() client: Socket): void {
    this.roomsMemberHandler.removeSocket(client)
  }
}
