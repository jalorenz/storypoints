import RoomMapper from "./room-mapper";
import Room from "../internal/room";

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
})
