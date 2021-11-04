import RoomsGateway from "./rooms-gateway";
import CreatedRoomDto from "../dtos/created-room-dto";
import RoomsMemberHandler from "../handlers/rooms-member-handler";
import {IMock, Mock} from "proxy-mocks/sinon"
import JoinedRoomDto from "../dtos/joined-room-dto";
import {Socket} from "socket.io";

describe("RoomsGateway", () => {
  let roomsMemberHandlerMock: IMock<RoomsMemberHandler>

  let gateway: RoomsGateway

  beforeEach(() => {
    roomsMemberHandlerMock = Mock.of(RoomsMemberHandler)

    gateway = new RoomsGateway(roomsMemberHandlerMock)
  })

  describe("createRoom", () => {
    it("should create room", () => {
      const dto = new CreatedRoomDto()
      roomsMemberHandlerMock.createRoom.returns(dto)

      const result = gateway.createRoom()

      expect(result).toStrictEqual(dto)
      expect(roomsMemberHandlerMock.createRoom).toHaveBeenCalledTimes(1)
    })
  })

  describe("joinRoom", () => {
    it.each([
      ["id"],
      ["anotherId"],
    ])("should be able to join room", (id: string) => {
      const socket = {} as Socket
      const dto = new JoinedRoomDto()
      roomsMemberHandlerMock.joinRoom.withArgs(id, socket).returns(dto)

      const result = gateway.joinRoom(id, socket)

      expect(result).toStrictEqual(dto)
    })
  })

  describe("handleDisconnect", () => {

  })
})
