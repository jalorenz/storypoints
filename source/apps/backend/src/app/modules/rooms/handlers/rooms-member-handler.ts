import {Injectable} from "@nestjs/common";
import CreatedRoomDto from "../dtos/created-room-dto";
import Room from "../internal/room";
import ObjectID from "bson-objectid"
import RoomMapper from "../mappers/room-mapper";
import JoinedRoomDto from "../dtos/joined-room-dto";
import {Socket} from "socket.io";

@Injectable()
export default class RoomsMemberHandler {
  constructor(
    private readonly roomMapper: RoomMapper,
    private readonly rooms = new Map<string, Room>()
  ) {}

  getRooms() : Room[] {
    return Array.from(this.rooms.values())
  }

  createRoom() : CreatedRoomDto {
    const room = new Room()
    const id = new ObjectID().toString()
    this.rooms.set(id, room)
    return this.roomMapper.toCreatedRoomDto(id, room)
  }

  joinRoom(id: string, socket: Socket) : JoinedRoomDto {
    if(!this.rooms.has(id)) {
      throw new Error(`Room ${id} does not exist`)
    }

    const room = this.rooms.get(id)
    room.addSocket(socket)
    const timestamp = new Date().toISOString()
    return this.roomMapper.toJoinedRoomDto(id, timestamp)
  }
}
