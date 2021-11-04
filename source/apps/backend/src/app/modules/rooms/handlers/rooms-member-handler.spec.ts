import RoomsMemberHandler from "./rooms-member-handler";
import CreatedRoomDto from "../dtos/created-room-dto";
import RoomMapper from "../mappers/room-mapper";
import { IMock, Mock } from "proxy-mocks/sinon"
import JoinedRoomDto from "../dtos/joined-room-dto";
import sinon = require("sinon");
import {Socket} from "socket.io";
import Room from "../internal/room";

describe("RoomsMemberHandler", () => {
  let roomMapperMock: IMock<RoomMapper>

  let handler: RoomsMemberHandler

  beforeEach(() => {
    roomMapperMock = Mock.of(RoomMapper)

    handler = new RoomsMemberHandler(roomMapperMock)
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
      rooms.set(id, new Room())
      handler = new RoomsMemberHandler(roomMapperMock, rooms)
      const socket = {} as Socket
      const dto = new JoinedRoomDto()
      roomMapperMock.toJoinedRoomDto.withArgs(id, sinon.match.string).returns(dto)

      const result = handler.joinRoom(id, socket)

      expect(result).toStrictEqual(dto)
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
})
