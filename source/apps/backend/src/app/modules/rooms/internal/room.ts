import {Socket} from "socket.io";

export default class Room {
  private readonly sockets: Socket[] = []

  constructor() {}

  getSockets() : Socket[] {
    return this.sockets
  }

  addSocket(socket: Socket) : void {
    this.sockets.push(socket)
  }
}
