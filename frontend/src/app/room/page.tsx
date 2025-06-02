"use client"

import {useSearchParams} from "next/navigation"
import {useEffect, useState} from "react"
import {io} from "socket.io-client"

interface Room {
    baseUrl: string
    users: RoomUser[]
}

interface RoomUser {
    id: string
    name: string
}

export default function RoomPage() {
    const searchParams = useSearchParams()
    const roomId = searchParams.get("id")
    const [baseUrl, setBaseUrl] = useState<string>("")
    const [users, setUsers] = useState<RoomUser[]>([])

    // eslint-disable-next-line  @typescript-eslint/no-extra-non-null-assertion
    useRoomSocket(roomId!!, setBaseUrl, setUsers)

    const link = `${baseUrl}/room?id=` + roomId

    return <div className="flex space-between">
        <div className="flex-col flex-grow p-4">
            <h1 className="text-xl">Room: {searchParams.get("id")}</h1>
            <h2 className="text-lg mt-4">Users in this room:</h2>
            <ul className="list-disc pl-5">
                {users.map((user) => (
                    <li key={user.id}
                        test-id={`room-user-${user.id}`}
                        className="text-m">{user.name} ({user.id})</li>
                ))}
            </ul>
        </div>
        <div className="flex-col p-4">
            <h1 className="text-xl mb-4">Room Info</h1>
            <p className="text-m" test-id="room-info-link">{link}</p>
        </div>
    </div>
}


function useRoomSocket(
    roomId: string,
    setBaseUrl: (url: string) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setUsers: any
) {
    useEffect(() => {
        const socket = io("/rooms?roomId=" + roomId)
        socket.on("connect", () => {
            console.log("Connected to the rooms WebSocket server")
        })
        socket.on("room-joined", (room: Room) => {
            setBaseUrl(room.baseUrl)
            setUsers(room.users)
            console.log("Joined room:", room)
        })

        socket.on("user-joined", (newUser: RoomUser) => {
            console.log("New user joined:", newUser)
            setUsers((prevUsers: RoomUser[]) => [...prevUsers, newUser])
        })
        
        socket.on("user-left", (leftUserId: string) => {
            console.log("User left:", leftUserId)
            setUsers((prevUsers: RoomUser[]) => prevUsers.filter(user => user.id !== leftUserId))
        })
        
        return () => {
            socket.disconnect()
        }
    }, [roomId, setBaseUrl, setUsers])
}
