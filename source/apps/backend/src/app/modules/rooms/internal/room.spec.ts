import Room from "./room";
import {Socket} from "socket.io";

describe("Room", () => {
  it("should create room", () => {
    const room = new Room()

    expect(room).toBeDefined()
  })

  describe("getSockets", () => {
    it("should return empty list of sockets", () => {
      const room = new Room()

      const sockets = room.getSockets()

      expect(sockets).toHaveLength(0)
    })
  })

  describe("addSocket", () => {
    it("should add socket", () => {
      const room = new Room()
      const socket = {} as Socket

      room.addSocket(socket)

      expect(room.getSockets()).toHaveLength(1)
    })
  })
})
