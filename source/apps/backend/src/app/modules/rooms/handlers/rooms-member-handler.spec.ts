import RoomsMemberHandler from "./rooms-member-handler";
import CreatedRoomDto from "../dtos/created-room-dto";
import RoomMapper from "../mappers/room-mapper";
import { IMock, Mock } from "proxy-mocks/sinon"
import JoinedRoomDto from "../dtos/joined-room-dto";
import sinon = require("sinon");
import {Socket} from "socket.io";
import Room from "../internal/room";
import {RemovedSocketDto} from "../dtos/removed-socket-dto";
import RoomBroadcasterService from "../services/room-broadcaster-service";
import {OutgoingRoomEvents} from "../events";
import RoomMember from "../internal/room-member";

describe("RoomsMemberHandler", () => {
  let roomMapperMock: IMock<RoomMapper>
  let roomBroadcasterServiceMock: IMock<RoomBroadcasterService>

  let handler: RoomsMemberHandler

  beforeEach(() => {
    roomMapperMock = Mock.of(RoomMapper)
    roomBroadcasterServiceMock = Mock.of(RoomBroadcasterService)

    handler = new RoomsMemberHandler(roomMapperMock, roomBroadcasterServiceMock)
  })

  describe("getRooms", () => {
    it("should return empty set if app is initialized", () => {
      const result = handler.getRooms()

      expect(result).toHaveLength(0)
    })
  })

  describe("createRoom", () => {
    it("should create room", () => {
      const resultDto = new CreatedRoomDto()
      roomMapperMock.toCreatedRoomDto.returns(resultDto)

      const result = handler.createRoom()

      expect(result).toStrictEqual(resultDto)
      expect(handler.getRooms()).toHaveLength(1)
    })
  })

  describe("joinRoom", () => {
    it.each([
      ["id"],
      ["anotherId"],
    ])("should be able to join room", (id: string) => {
      const rooms = new Map<string, Room>()
      const room = new Room()
      rooms.set(id, room)
      handler.setRooms(rooms)
      const socket = {} as Socket
      const dto = new JoinedRoomDto()
      roomMapperMock.toJoinedRoomDto.withArgs(id, sinon.match.string).returns(dto)

      const result = handler.joinRoom(id, socket)

      expect(result).toStrictEqual(dto)
      expect(roomBroadcasterServiceMock.sendEventToRoom).toHaveBeenCalledWith(room, OutgoingRoomEvents.memberJoined, {
        timestamp: sinon.match.string
      })
    })

    it.each([
      ["id"],
      ["anotherId"],
    ])("should throw Error if room with given id not exists", (id: string) => {
      const socket = {} as Socket

      expect(() => handler.joinRoom(id, socket)).toThrow(Error)
      expect(() => handler.joinRoom(id, socket)).toThrow(`Room ${id} does not exist`)
    })
  })

  describe("removeSocket", () => {
    it("should remove socket from its connected room", () => {
      const socket = {} as Socket
      const room = new Room()
      room.addMember(new RoomMember(socket))
      const rooms = new Map<string, Room>()
      rooms.set("roomId", room)
      handler.setRooms(rooms)
      const dto = new RemovedSocketDto()
      roomMapperMock.toRemovedRoomDto.withArgs(socket).returns(dto)

      const result = handler.removeSocket(socket)

      expect(result).toStrictEqual(dto)
      expect(roomBroadcasterServiceMock.sendEventToRoom).toHaveBeenCalledWith(room, OutgoingRoomEvents.memberLeaved, {
        timestamp: sinon.match.string
      })
    })
  })

  describe("vote", () => {
    it.each([2, 3])("should be able to vote when in room", (estimation: number) => {
      const socket = {
        id: "socketId",
      } as Socket
      const room = new Room()
      room.addMember(new RoomMember(socket))
      const rooms = new Map<string, Room>()
      rooms.set("roomId", room)
      handler.setRooms(rooms)

      handler.vote(socket, estimation)

      expect(roomBroadcasterServiceMock.sendEventToRoom).toHaveBeenCalledWith(room, OutgoingRoomEvents.memberVoted, {
        estimation,
      })
    })

    it.each([2, 3])("should skip notifying room when socket was not part of room", (estimation: number) => {
      const rooms = new Map<string, Room>()
      handler.setRooms(rooms)

      handler.vote({} as Socket, estimation)

      expect(roomBroadcasterServiceMock.sendEventToRoom).not.toHaveBeenCalled()
    })

    it.each([2, 3])("should notify room to reveal when single existing member has voted", (estimation: number) => {
      const room = new Room()
      const socket = {
        id: "socketId"
      } as Socket
      room.addMember(new RoomMember(socket))
      const rooms = new Map<string, Room>()
      rooms.set("roomId", room)
      handler.setRooms(rooms)

      handler.vote(socket, estimation)

      expect(roomBroadcasterServiceMock.sendEventToRoom).toHaveBeenCalledWith(room, OutgoingRoomEvents.revealVotes, {})
    })
  })
})
