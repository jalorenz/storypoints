import {Injectable} from "@nestjs/common";
import Room from "../internal/room";
import CreatedRoomDto from "../dtos/created-room-dto";
import JoinedRoomDto from "../dtos/joined-room-dto";

@Injectable()
export default class RoomMapper {
  toCreatedRoomDto(id: string, room: Room) : CreatedRoomDto {
    return { id }
  }

  toJoinedRoomDto(id: string, timestamp: string) : JoinedRoomDto {
    return { id, timestamp }
  }
}
