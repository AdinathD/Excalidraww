import express from "express"
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client";
import cors from "cors";


const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`http-backend listening on port ${port}`);
});
app.post("/signup", async (req, res) => {
  const parseResult = CreateUserSchema.safeParse(req.body);
  if (!parseResult.success) {
    console.log(parseResult.error);
    res.status(400).json({ message: "incorrect inputs" });
    return;
  }

  const userInput = parseResult.data;

  try {
    const user = await prismaClient.user.create({
      data: {
        email: userInput.username,
        //todo:hash the password
        password: userInput.password,
        name: userInput.name,
      },
    });

    res.json({ userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "failed to create user" });
  }
});
app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "incorrect inputs"
    })
    return;
  }
  //todo:compare hashed password
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
      password: parsedData.data.password
    }

  })

  if (!user) {
    return res.json({
      message: "user not found"
    })
    return;
  }


  const token = jwt.sign({ userId: user?.id }, JWT_SECRET);


  res.json({ token })
})

//creating  a room : slug is the name of the room,addminId is userId of the user who created the room
// @ts-ignore
app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "incorrect inputs"
    })
    return;
  }
  // @ts-ignore
  const userId = req.userId;
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      }
    })
    res.json({ roomId: room.id })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "room already exists" });
  }

})
//top 50 msgs from the database with given roomId
app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    console.log(roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId
      },
      take: 100,
      orderBy: {
        id: "desc"
      }
    })
    res.json({ messages })
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "failed to get chats" });
  }
})


//given roomname or slg->return roomId
app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug: slug
    },

  })
  res.json({ room })
})

// @ts-ignore
app.get("/my-rooms", middleware, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  try {
    const rooms = await prismaClient.room.findMany({
      where: {
        adminId: userId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    res.json({ rooms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "failed to get rooms" });
  }
})