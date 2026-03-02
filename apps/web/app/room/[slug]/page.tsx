import axios from "axios";
import { BACKEND_URL } from "../../tsconfig";
import { ChatRoom } from "../../../components/ChatRoom";
export async function getRooms(slug: string) {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
    return response.data.room.id;
}

export default async function ChatRoom1({ params }: { params: {  slug: string }}) {
    const slug =(await params).slug;
    const roomId=await getRooms(slug);
    
    return <ChatRoom roomId={roomId}/>
} 



//get slug as parameter then pass it to getRooms function to get the roomId , pass that roomId to ChatRoom component