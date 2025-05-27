"use client"

import {useSearchParams} from "next/navigation"
import { useState } from "react"
import { io } from "socket.io-client"

export default function RoomPage() {
    const searchParams = useSearchParams()
    const [baseUrl, setBaseUrl] = useState<string>("")

    const socket = io("/rooms")
    socket.on("connect", () => {
        console.log("Connected to the rooms WebSocket server")
    })
    socket.on("init", (data: { baseUrl: string }) => {
        setBaseUrl(data.baseUrl)
        console.log("Received base URL:", data.baseUrl)
    })

    const link = `${baseUrl}/room?id=` + searchParams.get("id")

    return <div className="flex space-between">
        <div className="flex-col flex-grow p-4">
            <h1 className="text-xl">Room: {searchParams.get("id")}</h1>
        </div>
        <div className="flex-col p-4">
            <h1 className="text-xl mb-4">Room Info</h1>
            <p className="text-m" test-id="room-info-link">{link}</p>
        </div>
    </div>
}
