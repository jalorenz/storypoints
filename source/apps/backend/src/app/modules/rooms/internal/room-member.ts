import {Socket} from "socket.io";

export default class RoomMember {
  private storypointsEstimation: number | null = null

  constructor(
    private readonly socket: Socket
  ) {}

  getStoryPointEstimation() : number | null {
    return this.storypointsEstimation
  }

  setStoryPoints(estimation: number) : void {
    this.storypointsEstimation = estimation
  }

  resetEstimation() : void {
    this.storypointsEstimation = null
  }

  getSocket() : Socket {
    return this.socket
  }
}
