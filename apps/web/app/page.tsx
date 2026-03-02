"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("")
  const router = useRouter();
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "black" }}>
      <div>
        <input value={roomId} onChange={(e) => {
          setRoomId(e.target.value)
        }} type="text" placeholder="room id"
          style={{ padding: "10px", backgroundColor: "white", color: "black" }}
        ></input>
        <button onClick={() => {
          router.push(`/room/${roomId}`)

        }}
          style={{ padding: "10px", backgroundColor: "white", color: "black" }}>join room</button>
      </div>
    </div>
  );
}
