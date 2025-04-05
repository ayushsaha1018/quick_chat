import { Server, Socket } from "socket.io";
import prisma from "./config/db.config.js";

interface CustomSocket extends Socket {
  room?: string;
}
export function setupSocket(io: Server) {
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    if (!room) {
      return next(new Error("Invalid room"));
    }
    socket.room = room;
    next();
  });

  io.on("connection", (socket: CustomSocket) => {
    // * Join the room
    socket.join(socket.room);
    console.log("A user connected to room:", socket.room);

    socket.on("message", async (data) => {
      try {
        console.log("Received message data:", data);

        // Find the GroupUsers entry for this user
        const groupUser = await prisma.groupUsers.findFirst({
          where: {
            group_id: data.group_id,
            name: data.name,
          },
        });

        if (!groupUser) {
          console.error("Group user not found:", data.name);
          return;
        }

        // Save message with proper relationships
        const savedMessage = await prisma.chats.create({
          data: {
            id: data.id,
            message: data.message,
            name: data.name,
            group: {
              connect: {
                id: data.group_id,
              },
            },
            sender: {
              connect: {
                id: groupUser.id,
              },
            },
          },
        });

        console.log("Message saved successfully:", savedMessage.id);

        // Emit message to other clients in the room
        socket.to(socket.room!).emit("message", data);
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
}
