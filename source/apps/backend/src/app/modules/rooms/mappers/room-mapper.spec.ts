import RoomMapper from "./room-mapper";
import Room from "../internal/room";
import {Socket} from "socket.io";

describe("RoomMapper", () => {
  let mapper: RoomMapper

  beforeEach(() => {
    mapper = new RoomMapper()
  })

  describe("toCreatedRoomDto", () => {
    it.each([
      ["id"],
      ["anotherId"],
    ])("should map assigned id", (id: string) => {
      const room = new Room()

      const result = mapper.toCreatedRoomDto(id, room)

      expect(result).toStrictEqual({ id })
    })
  })

  describe("toJoinedRoomDto", () => {
    it.each([
      ["id", "isoString"],
      ["anotherId", "anotherIsoString"],
    ])("should map assigned id", (id: string, timestamp: string) => {
      const result = mapper.toJoinedRoomDto(id, timestamp)

      expect(result).toStrictEqual({ id, timestamp })
    })
  })

  describe("toRemovedRoomDto", () => {
    it("should map given socket", () => {
      const socket = {} as Socket

      const result = mapper.toRemovedRoomDto(socket)

      expect(result.socket).toStrictEqual(socket)
    })

    it("should map null", () => {
      const result = mapper.toRemovedRoomDto(null)

      expect(result.socket).toBeNull()
    })
  })
})
