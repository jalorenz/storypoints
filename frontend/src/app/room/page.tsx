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

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("")
}

function TableView({ users }: { users: RoomUser[] }) {
    const tableRadius = 120
    const avatarRadius = 160
    const avatarSize = 56

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: avatarRadius * 2 + avatarSize, height: avatarRadius * 2 + avatarSize }}
        >
            {/* Round table */}
            <div
                className="absolute rounded-full bg-amber-800 opacity-80"
                style={{
                    width: tableRadius * 2,
                    height: tableRadius * 2,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            />

            {/* User avatars around the table */}
            {users.map((user, index) => {
                const angle = (index / Math.max(users.length, 1)) * 2 * Math.PI - Math.PI / 2
                const x = Math.cos(angle) * avatarRadius
                const y = Math.sin(angle) * avatarRadius
                return (
                    <div
                        key={user.id}
                        test-id={`room-user-${user.id}`}
                        className="absolute flex flex-col items-center"
                        style={{
                            top: "50%",
                            left: "50%",
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        }}
                    >
                        <div
                            className="rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold select-none"
                            style={{ width: avatarSize, height: avatarSize, fontSize: 18 }}
                            title={user.name}
                        >
                            {getInitials(user.name)}
                        </div>
                        <span className="mt-1 text-xs text-center max-w-16 truncate">{user.name}</span>
                    </div>
                )
            })}
        </div>
    )
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
            <h1 className="text-xl mb-6">Room: {searchParams.get("id")}</h1>
            <TableView users={users} />
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
