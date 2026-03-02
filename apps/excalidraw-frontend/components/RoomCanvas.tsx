"use client"
import { useEffect, useRef, useState } from "react";

import { HTTP_URL, WS_URL } from "../config";
import initDraw from "@/app/draw";
import Canvas from "./Canvas";

//just take the roomId from the params and pass it to the RoomCanvas component
//RoomCanvas component creates a socket connection to the server
//RoomCanvas component renders the Canvas component
//Canvas component is the actual canvas that is rendered
export default function RoomCanvas({roomId}: {roomId: string}) {
  
    const [socket,setSocket]=useState<WebSocket|null>(null);
    
    useEffect(( ) => {
        const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjY3MjY1NS0wZjhkLTQ3M2ItOTdiOC01YmUyNTIyZDkzZDQiLCJpYXQiOjE3NzAyMzYxODR9.d1cTexx_0T09e6YttquTk471WSBH4KFr_du_jOxczJk`);
       ws.onopen=()=>{ setSocket(ws);
        ws.send(JSON.stringify({
            type:"join_room",
            roomId:roomId
        }))
       }
    }, []);
    

   
    if(!socket){
        return <div>connecting to the server...</div>
    }
    
    return (
        <div>   
            <Canvas roomId={roomId} socket={socket}/>
           
          
        </div>
    )
}