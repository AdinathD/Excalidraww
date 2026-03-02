import axios from "axios";
import { HTTP_URL } from "@/config";
type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    points: { x: number; y: number }[];
}

export default async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, toolRef: { current: "pencil" | "rectangle" | "circle" }) {
    const ctx = canvas.getContext("2d");
    let existingShapes: Shape[] = await getExistingShapes(roomId);
    if (!ctx) {
        return;
    }
    //on message event
    socket.onmessage = (e) => {
        const message = JSON.parse(e.data);
        if (message.type == "chat") {
            const parsedShape = JSON.parse(message.message);
            existingShapes.push(parsedShape.shape);
            clearCanvas(existingShapes, ctx, canvas); //clear the canvas and redraw the shapes with updated existingShapes

        }

    }
    //draw the existing shapes on the canvas
    clearCanvas(existingShapes, ctx, canvas);
    let clicked = false;
    let startX = 0;
    let startY = 0;
    let path: { x: number; y: number }[] = [];

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
        const selectedTool = toolRef.current;
        if (selectedTool === "pencil") {
            path = [{ x: startX, y: startY }];
        }
    })
    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        const selectedTool = toolRef.current;
        let shape: Shape | null = null;

        if (selectedTool === "rectangle") {
            shape = {
                type: "rect",
                x: startX,
                y: startY,
                width,
                height
            }
        } else if (selectedTool === "circle") {
            const centerX = startX + width / 2;
            const centerY = startY + height / 2;
            const radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
            shape = {
                type: "circle",
                centerX,
                centerY,
                radius
            }
        } else if (selectedTool === "pencil") {
            shape = {
                type: "pencil",
                points: path
            }
            path = [];
        }

        if (shape) {
            existingShapes.push(shape);
            clearCanvas(existingShapes, ctx, canvas);
            socket.send(JSON.stringify({
                type: "chat",
                roomId: roomId,
                message: JSON.stringify({ shape })
            }));
        }
    })
    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, ctx, canvas);
            ctx.strokeStyle = "white";

            const selectedTool = toolRef.current;
            if (selectedTool === "rectangle") {
                ctx.strokeRect(startX, startY, width, height);
            } else if (selectedTool === "circle") {
                const centerX = startX + width / 2;
                const centerY = startY + height / 2;
                const radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
            } else if (selectedTool === "pencil") {
                path.push({ x: e.clientX, y: e.clientY });
                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                for (let i = 1; i < path.length; i++) {
                    ctx.lineTo(path[i].x, path[i].y);
                }
                ctx.stroke();
            }
        }
    })
}

function clearCanvas(existingShapes: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white"; // Set stroke color so shapes are visible!

    existingShapes.forEach(shape => {
        if (shape.type === "rect") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
        } else if (shape.type === "pencil") {
            if (shape.points && shape.points.length > 0) {
                ctx.beginPath();
                ctx.moveTo(shape.points[0].x, shape.points[0].y);
                shape.points.forEach(point => {
                    ctx.lineTo(point.x, point.y);
                })
                ctx.stroke();
            }
        }
    })
}

async function getExistingShapes(roomId: string) {

    const res = await axios.get(`${HTTP_URL}/chats/${roomId}`)
    const messages = res.data.messages;
    const shapes = messages
        .map((x: { message: string }) => {
            try {
                const messageData = JSON.parse(x.message);
                return messageData.shape;
            } catch (error) {
                // Skip invalid JSON messages
                return undefined;
            }
        })
        .filter((shape: Shape | undefined) => shape !== undefined); // Remove undefined values
    return shapes;
}