

import RoomCanvas from "@/components/RoomCanvas";

//just take the roomId from the params and pass it to the RoomCanvas component
    
export default async function CanvasPage({params}:{params:{roomId:string}}) {
    const roomId=(await params).roomId;
    console.log(roomId);
   return <RoomCanvas roomId={roomId}/>
}