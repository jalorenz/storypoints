import Room from "./room";
import {Socket} from "socket.io";
import {OutgoingRoomEvents} from "../events";
import RoomMember from "./room-member";
import {Mock} from "proxy-mocks/sinon";

function addMembers(room: Room, members: RoomMember[]) : void {
  members.forEach(member => {
    room.addMember(member)
  })
}

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

    it.each([
      [2, 5]
    ])("should return given count of sockets", (count: number) => {
      const room = new Room()
      const members = new Array(count).fill(null).map(() => new RoomMember({} as Socket))
      addMembers(room, members)

      expect(room.getSockets()).toHaveLength(count)
    })
  })

  describe("addMember", () => {
    it("should add new member", () => {
      const room = new Room()
      const member = new RoomMember({} as Socket)

      room.addMember(member)

      expect(room.getSockets()).toHaveLength(1)
    })
  })

  describe("removeMember", () => {
    it.each([
      ["socketId"],
      ["anotherSocketId"],
    ])("should remove socket", (socketId: string) => {
      const room = new Room()
      const socket = { id: socketId } as Socket
      const member = new RoomMember(socket)
      room.addMember(member)

      room.removeMember(socket)

      expect(room.getSockets()).toHaveLength(0)
    })
  })

  describe("notifyMember", () => {
    it.each([
      [OutgoingRoomEvents.memberJoined],
      [OutgoingRoomEvents.memberLeaved],
    ])("should notify member of room with given event", (eventName: OutgoingRoomEvents) => {
      // @ts-ignore
      const socket = {
        emit: jest.fn(),
      } as Socket
      const room = new Room()
      room.addMember(new RoomMember(socket))
      const eventData = {
        some: {
          data: true,
        }
      }

      room.notifyMember(eventName, eventData)

      expect(socket.emit).toHaveBeenCalledWith(eventName, eventData)
    })
  })

  describe("isMember", () => {
    it.each([
      ["socketId"],
      ["anotherSocketId"],
    ])("should return true if socket is member of room", (socketId: string) => {
      const room = new Room()
      const socket = {
        id: socketId,
      } as Socket
      room.addMember(new RoomMember(socket))

      const result = room.isMember(socket)

      expect(result).toStrictEqual(true)
    })

    it.each([
      ["socketId"],
      ["anotherSocketId"],
    ])("should return false if socket is not member of room", (socketId: string) => {
      const room = new Room()

      const result = room.isMember({} as Socket)

      expect(result).toStrictEqual(false)
    })
  })

  describe("isReadyToReveal", () => {
    it.each([2, 3])("should return true if single member has already voted", (estimation: number) => {
      const room = new Room()
      const member = new RoomMember({} as Socket)
      member.setStoryPoints(estimation)
      room.addMember(member)

      const result = room.isReadyToReveal()

      expect(result).toBe(true)
    })

    it("should return false if single member has not voted yet", () => {
      const room = new Room()
      const member = new RoomMember({} as Socket)
      room.addMember(member)

      const result = room.isReadyToReveal()

      expect(result).toBe(false)
    })

    it.each([2, 3])("should return true if all members have already voted", (count: number) => {
      const room = new Room()
      const members = new Array(count).fill(null).map(() => {
        const member = new RoomMember({} as Socket)
        member.setStoryPoints(2)
        return member
      })
      addMembers(room, members)

      const result = room.isReadyToReveal()

      expect(result).toBe(true)
    })

    it.each([2, 3])("should return false if all members haven't voted yet", (count: number) => {
      const room = new Room()
      const members = new Array(count).fill(null).map(() => new RoomMember({} as Socket))
      addMembers(room, members)

      const result = room.isReadyToReveal()

      expect(result).toBe(false)
    })
  })

  describe("processVoteFromMember", () => {
    it.each([2, 3])("should assign given estimation to member", (estimation: number) => {
      const socket = {
        id: "socketId"
      } as Socket
      const roomMember = new RoomMember(socket)
      const setStoryPointsMock = jest.fn()
      roomMember.setStoryPoints = setStoryPointsMock
      const room = new Room()
      room.addMember(roomMember)

      room.processVoteFromMember(socket, estimation)

      expect(setStoryPointsMock).toHaveBeenCalledWith(estimation)
    })

    it.each([2, 3])("should skip assigning estimation if socket is not member", (estimation: number) => {
      const roomMember = new RoomMember({ id: "otherSocketId" } as Socket)
      const setStoryPointsMock = jest.fn()
      roomMember.setStoryPoints = setStoryPointsMock
      const room = new Room()
      room.addMember(roomMember)

      room.processVoteFromMember( {
        id: "socketId"
      } as Socket, estimation)

      expect(setStoryPointsMock).not.toHaveBeenCalled()
    })
  })
})
