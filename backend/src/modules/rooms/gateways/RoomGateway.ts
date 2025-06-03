import { WebSocketGateway, OnGatewayConnection, WebSocketServer, OnGatewayDisconnect } from "@nestjs/websockets";
import {Server, Socket } from "socket.io";
import { RoomHandler } from "../domain/room.handler";

@WebSocketGateway({ namespace: "rooms" })
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly roomHandler: RoomHandler,
    ) {}

    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        const roomId = client.handshake.query.roomId as string;
        console.log(`Client connected to room: ${roomId}, client ID: ${client.id}`);
        const roomUser = { id: client.id, name: "Jannik" }
        
        this.roomHandler.handleNewRoomUser(
            roomId,
            roomUser,
            (updatedRoom) => client.emit("room-joined", updatedRoom),
            (newUser) => this.server.to(roomId).emit("user-joined", newUser),
            () => client.join(roomId)
        )
    }

    handleDisconnect(client: Socket) {
        const roomId = client.handshake.query.roomId as string;
        console.log(`Client disconnected from room: ${roomId}, client ID: ${client.id}`);

        this.roomHandler.handleLeftRoomUser(
            roomId,
            client.id,
            (leftUserId) => this.server.to(roomId).emit("user-left", leftUserId)
        )
    }
}