"use client"
import { useEffect,useState } from "react";
import initDraw from "@/app/draw";
import { useRef } from "react";
import { IconButton } from "./IconButton";
import {LucideRectangleHorizontal, LucideCircle, Pencil}from "lucide-react"

//Canvas component is the actual canvas that is rendered
type shape="pencil"|"rectangle"|"circle";
export default function Canvas({roomId,socket}: {roomId: string,socket: WebSocket}) {
    const [selectedTool, setSelectedTool] = useState<shape>("rectangle");
    const selectedToolRef = useRef<shape>(selectedTool);

    useEffect(() => {
        selectedToolRef.current = selectedTool;
    }, [selectedTool]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket, selectedToolRef);
        }
    }, [roomId, canvasRef, socket]);

    return <div>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} socket={socket} roomId={roomId} />
    </div>
}

function Topbar({selectedTool, setSelectedTool, socket, roomId}: {selectedTool: shape, setSelectedTool: (tool: shape) => void, socket: WebSocket, roomId: string}) {
    return <div className="fixed top-0 left-0 right-0 h-16 bg-black">
            <div className="flex items-center gap-2 p-2 h-full">
                <IconButton icon={<Pencil/>} onClick={() => {setSelectedTool("pencil")}} activated={selectedTool === "pencil"}/>
                <IconButton icon={<LucideRectangleHorizontal/>} onClick={() => {setSelectedTool("rectangle")}} activated={selectedTool === "rectangle"} />
                <IconButton icon={<LucideCircle/>} onClick={() => {setSelectedTool("circle")}} activated={selectedTool === "circle"} />
                
                <div className="flex-1"></div>
                
                <button 
                    onClick={() => {
                        socket.send(JSON.stringify({ type: "clear", roomId: roomId }));
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg transition-colors border border-red-700 text-sm font-medium"
                >
                    Erase Everything
                </button>
                
                <button 
                    onClick={() => {window.location.href = "/dashboard"}}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700 text-sm font-medium mr-4"
                >
                    Back to Dashboard
                </button>
            </div>
    </div>
}