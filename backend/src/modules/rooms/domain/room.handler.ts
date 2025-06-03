import {Injectable} from "@nestjs/common";
import { RoomUser } from "./room-user";
import { Room } from "./room";

@Injectable()
export class RoomHandler {
    private rooms: Map<string, Room> = new Map<string, Room>()

    handleNewRoomUser(
        roomId: string,
        roomUser: RoomUser,
        onUpdatedRoom: (updatedRoom: Room) => void,
        onUserJoined: (roomUser: RoomUser) => void,
        onFinished: () => void
    ) {
        const room = this.getRoomOrCreate(roomId)
        console.log(`Count of users for room with ID: ${roomId}`, room.users.length)
        room.users.push(roomUser)
        console.log(`Count of users for room with ID: ${roomId}`, room.users.length)
        onUpdatedRoom(room)
        onUserJoined(roomUser)
        onFinished()
    }
    
    handleLeftRoomUser(
        roomId: string,
        userId: string,
        onRoomUserLeft: (userId: string) => void
    ) {
        const room = this.rooms.get(roomId)

        if(!room) {
            throw new Error(`Room with ID: ${roomId} does not exist`)
        }

        const userIndex = room.users.findIndex(user => user.id === userId)

        if(userIndex === -1) {
            throw new Error(`User with ID: ${userId} not found in room with ID: ${roomId}`)
        }

        const [leftUser] = room.users.splice(userIndex, 1)
        onRoomUserLeft(leftUser.id)

        if(room.users.length === 0) {
            this.rooms.delete(roomId)
            console.log(`Room with ID: ${roomId} deleted as it has no users left`)
        }
    }

    private getRoomOrCreate(roomId: string): Room {
        const room = this.rooms.get(roomId)

        if(room) {
            return room
        }

        const newRoom = { users: [], baseUrl: process.env.FRONTEND_BASE_URL!! }
        this.rooms.set(roomId, newRoom)

        return newRoom
    }
}