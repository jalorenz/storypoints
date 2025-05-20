"use client"

import {useRouter} from 'next/navigation'
import {useState} from 'react'

export const dynamic = 'force-static'

export default function Home() {
    const router = useRouter()
    const [enteredRoomId, setEnteredRoomId] = useState("")

    const onCreateNewRoomClicked = () => {
        const randomRoomId = Math.floor(Math.random() * 10000)
        router.push(`/rooms/${randomRoomId}`)
    }

    const onJoinRoomClicked = () => {
        if (enteredRoomId) {
            router.push(`/rooms/${enteredRoomId}`)
        }
    }

    return <div className="flex justify-center">
        <div className="flex-col p-4">
            <button className="text-xl" onClick={onCreateNewRoomClicked}>Create a new room</button>
        </div>
        <div className="flex-col p-4">
            <h1 className="text-xl mb-4">Join an existing room</h1>
            <div className="mb-4">
                <input type="text" value={enteredRoomId} onChange={(e) => setEnteredRoomId(e.target.value)}
                       placeholder="ID of the room" className="border-2 border-gray-300 rounded-md p-2"/>
            </div>
            <button className="border-2 border-gray-300 rounded-md p-2" onClick={onJoinRoomClicked}>Join</button>
        </div>
    </div>
}
