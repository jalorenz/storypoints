import RoomMember from "./room-member";
import {Socket} from "socket.io";

describe("RoomMember", () => {
  it("should be defined", () => {
    const socket = {} as Socket

    expect(new RoomMember(socket)).toBeDefined()
  })

  describe("setStoryPoints", () => {
    it.each([
      [2, 3, 5, 8, 13]
    ])("should assign given estimation", (estimation: number) => {
      const member = new RoomMember({} as Socket)

      member.setStoryPoints(estimation)

      expect(member.getStoryPointEstimation()).toStrictEqual(estimation)
    })
  })

  describe("getStoryPointEstimation", () => {
    it("should return null if member has not estimated yet", () => {
      const member = new RoomMember({} as Socket)

      expect(member.getStoryPointEstimation()).toBeNull()
    })
  })

  describe("resetEstimation", () => {
    it.each([
      [2, 3, 8]
    ])("should reset current estimation", (currentEstimation: number) => {
      const member = new RoomMember({} as Socket)
      member.setStoryPoints(currentEstimation)

      member.resetEstimation()

      expect(member.getStoryPointEstimation()).toBeNull()
    })
  })

  describe("getSocket", () => {
    it("should return socket of member", () => {
      const socket = {} as Socket
      const member = new RoomMember(socket)

      expect(member.getSocket()).toStrictEqual(socket)
    })
  })
})
