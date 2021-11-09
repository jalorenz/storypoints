import {Injectable} from "@nestjs/common";
import CreatedRoomDto from "../dtos/created-room-dto";
import Room from "../internal/room";
import ObjectID from "bson-objectid"
import RoomMapper from "../mappers/room-mapper";
import JoinedRoomDto from "../dtos/joined-room-dto";
import {Socket} from "socket.io";
import {RemovedSocketDto} from "../dtos/removed-socket-dto";
import RoomBroadcasterService from "../services/room-broadcaster-service";
import {OutgoingRoomEvents} from "../events";
import RoomMember from "../internal/room-member";

@Injectable()
export default class RoomsMemberHandler {
  private rooms = new Map<string, Room>()

  constructor(
    private readonly roomMapper: RoomMapper,
    private readonly roomBroadcasterService: RoomBroadcasterService,

  ) {}

  setRooms(rooms: Map<string, Room>) : void {
    this.rooms = rooms
  }

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
    room.addMember(new RoomMember(socket))
    const timestamp = new Date().toISOString()
    this.roomBroadcasterService.sendEventToRoom(room, OutgoingRoomEvents.memberJoined, {
      timestamp,
    })
    return this.roomMapper.toJoinedRoomDto(id, timestamp)
  }

  removeSocket(socket: Socket) : RemovedSocketDto {
    let removedSocket = null
    this.rooms.forEach(room => {
      if(room.isMember(socket)) {
        room.removeMember(socket)
        removedSocket = socket
        this.roomBroadcasterService.sendEventToRoom(room, OutgoingRoomEvents.memberLeaved, {
          timestamp: new Date().toISOString(),
        })
      }
    })

    return this.roomMapper.toRemovedRoomDto(removedSocket)
  }

  getRoomBySocket(socket: Socket) : Room | null {
    let matchingRoom = null
    this.rooms.forEach(room => {
      if(room.isMember(socket)) {
        matchingRoom = room
      }
    })

    return matchingRoom
  }

  vote(socket: Socket, estimation: number) : void {
    const room = this.getRoomBySocket(socket)

    if(room) {
      room.processVoteFromMember(socket, estimation)

      this.roomBroadcasterService.sendEventToRoom(room, OutgoingRoomEvents.memberVoted, {
        estimation,
      })

      if(room.isReadyToReveal()) {
       this.roomBroadcasterService.sendEventToRoom(room, OutgoingRoomEvents.revealVotes, {})
      }
    }
  }
}
