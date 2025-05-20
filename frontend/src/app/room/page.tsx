"use client"

import { useSearchParams } from "next/navigation"

export default function RoomPage() {
    const searchParams = useSearchParams()

    return <div>Room: {searchParams.get("id")}</div>
}
