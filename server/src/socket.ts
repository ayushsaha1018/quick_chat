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

    socket.on("message", async (data) => {
      try {
        // Save message directly to DB
        await prisma.chats.create({ data: data });
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
