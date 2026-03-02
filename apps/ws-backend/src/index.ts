
import { WebSocketServer, WebSocket } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
type User = {
  userId: string,
  rooms: string[],
  ws: WebSocket
}
//array of users
const users: User[] = [];


const wss = new WebSocketServer({ port: 8080 });

//check if the token is valid and return the userId
function checkUser(token: string): string | null {

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded == "string") {

      return null;
    }
    if (!decoded || !(decoded).userId) {
      return null;

    }
    return decoded.userId;
  }

  catch (e) {
    return null;
  }
}

wss.on('connection', function connection(ws, request) {

  const url = request.url;   //ws:localhost:8080?token:123212
  if (!url) { return }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);
  if (!userId) {
    ws.close();
    return;
  }

  // Add user to the array BEFORE setting up message handler to prevent race condition
  users.push({
    userId: userId,
    rooms: [],
    ws
  });

  ws.on('message', async function message(data) {
    let parsedData;
    if (typeof data != "string") {
      parsedData = JSON.parse(data.toString());
    }
    else {
      parsedData = JSON.parse(data);
    }
    if (parsedData.type == "join_room") {
      const user = users.find((user) => user.ws === ws);
      //or const user=users.find((user)=>user.userId===userId);
      // todo :first check if the room  even exist
      if (user) {
        user?.rooms.push(parsedData.roomId);
      } else { return; }
    }
    if (parsedData.type == "leave_room") {
      const user = users.find((user) => user.ws === ws);
      if (user) {
        user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
      }
    }

    if (parsedData.type == "chat") {
      const user = users.find((user) => user.ws === ws);
      if (user) {
        const roomId = parsedData.roomId;
        const message = parsedData.message;

        // Broadcast to all users in the room
        users.forEach(user => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                message,
                roomId
              })
            )
          }
        })
        
        // Store in database with error handling
        try {
          await prismaClient.chat.create({
            data: {
              message,
              roomId: Number(roomId),
              userId: user.userId
            }
          })
        } catch (error) {
          console.error("Failed to save chat to database:", error);
          // Don't crash the server, just log the error
        }
      }
    }
  });

  // Clean up when user disconnects
  ws.on('close', () => {
    const index = users.findIndex((user) => user.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });
});