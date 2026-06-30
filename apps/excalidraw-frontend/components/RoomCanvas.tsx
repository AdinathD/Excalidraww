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
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/";
            return;
        }
        const ws=new WebSocket(`${WS_URL}?token=${token}`);
        ws.onopen=()=>{ setSocket(ws);
            ws.send(JSON.stringify({
                type:"join_room",
                roomId:roomId
            }))
        }
    }, [roomId]);
    

   
    if(!socket){
        return <div>connecting to the server...</div>
    }
    
    return (
        <div>   
            <Canvas roomId={roomId} socket={socket}/>
           
          
        </div>
    )
}