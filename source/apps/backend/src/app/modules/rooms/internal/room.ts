import {Socket} from "socket.io";
import {OutgoingRoomEvents} from "../events";
import RoomMember from "./room-member";

export default class Room {
  private members: RoomMember[] = []

  constructor() {}

  getSockets() : Socket[] {
    return this.members.map(member => member.getSocket())
  }

  addMember(member: RoomMember) : void {
    this.members.push(member)
  }

  removeMember(socket: Socket) : void {
    this.members = this.members.filter(member => member.getSocket().id !== socket.id)
  }

  notifyMember(eventName: OutgoingRoomEvents, eventData: any) : void {
    for(const member of this.getSockets()) {
      member.emit(eventName, eventData)
    }
  }

  isMember(socket: Socket): boolean {
    return this.members.find(member => member.getSocket().id === socket.id) !== undefined
  }

  isReadyToReveal() : boolean {
    return this.members.every(member => member.getStoryPointEstimation() !== null)
  }

  private getMemberBySocket(socket: Socket) : RoomMember | null {
    return this.members.find(member => member.getSocket().id === socket.id)
  }

  processVoteFromMember(socket: Socket, estimation: number) : void {
    const member = this.getMemberBySocket(socket)
    if(member) {
      member.setStoryPoints(estimation)
    }
  }
}
