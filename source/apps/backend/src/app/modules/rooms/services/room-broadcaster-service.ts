import {Injectable} from "@nestjs/common";
import Room from "../internal/room";
import {OutgoingRoomEvents} from "../events";

@Injectable()
export default class RoomBroadcasterService {
  constructor() {}

  sendEventToRoom(room: Room, eventName: OutgoingRoomEvents, eventData: any) : void {
    room.notifyMember(eventName, eventData)
  }
}
