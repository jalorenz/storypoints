import {Injectable} from "@nestjs/common";
import Room from "../internal/room";
import CreatedRoomDto from "../dtos/created-room-dto";
import JoinedRoomDto from "../dtos/joined-room-dto";
import {Socket} from "socket.io";
import {RemovedSocketDto} from "../dtos/removed-socket-dto";

@Injectable()
export default class RoomMapper {
  toCreatedRoomDto(id: string, room: Room) : CreatedRoomDto {
    return { id }
  }

  toJoinedRoomDto(id: string, timestamp: string) : JoinedRoomDto {
    return { id, timestamp }
  }

  toRemovedRoomDto(socket: Socket | null) : RemovedSocketDto {
    return { socket }
  }
}
