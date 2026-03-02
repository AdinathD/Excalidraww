import { useEffect, useState } from "react";
import { WS_URL } from "../app/tsconfig";

export function useSocket() {
    const [loading, setloading] = useState(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjY3MjY1NS0wZjhkLTQ3M2ItOTdiOC01YmUyNTIyZDkzZDQiLCJpYXQiOjE3NzAyMzYxODR9.d1cTexx_0T09e6YttquTk471WSBH4KFr_du_jOxczJk`)
        ws.onopen = () => {
            setSocket(ws);
            setloading(false);
        }
    }, [])
    return { socket, loading }
}


//Custom hook managing WebSocket connection