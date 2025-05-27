import { WebSocketGateway, OnGatewayConnection } from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway({ namespace: "rooms" })
export class RoomsGateway implements OnGatewayConnection {
    handleConnection(client: Socket) {
        client.emit("init", {
            baseUrl: process.env.FRONTEND_BASE_URL,
        })
    }
}