import Room from "../internal/room";
import RoomBroadcasterService from "./room-broadcaster-service";
import {OutgoingRoomEvents} from "../events";
import { Mock } from "proxy-mocks/sinon";

describe("RoomBroadcasterService", () => {
  let service: RoomBroadcasterService

  beforeEach(() => {
    service = new RoomBroadcasterService()
  })

  it.each([
    ["event"],
    ["anotherEvent"],
  ])("should notify all sockets of a room with given event", (eventName: OutgoingRoomEvents) => {
    const room = Mock.of(Room)
    const eventData = {
      some: {
        data: true,
      }
    }

    service.sendEventToRoom(room, eventName, eventData)

    expect(room.notifyMember).toHaveBeenCalledWith(eventName, eventData)
  })
})
