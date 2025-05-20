"use client"

import {useSearchParams} from "next/navigation"

export default function RoomPage() {
    const searchParams = useSearchParams()
    const link = "http://localhost:3333/room?id=" + searchParams.get("id")

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
