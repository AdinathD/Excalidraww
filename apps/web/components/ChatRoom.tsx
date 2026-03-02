import axios from "axios";
import { BACKEND_URL } from "../app/tsconfig";
import { ChatRoomClient } from "./ChatRoomClient";
async function getChats(roomId:string){
    const response=await axios.get(`${BACKEND_URL}/chats/${roomId}`)
    return response.data.messages;
}

export async function ChatRoom({roomId}: {roomId: string}) {
    const messages=await getChats(roomId);
    return <ChatRoomClient messages={messages} id={roomId}/>

}


//Server component that fetches initial messages