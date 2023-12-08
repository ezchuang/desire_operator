import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";

export default function ioConstructor(server: HttpServer): void {
  const io = new SocketServer(server);
  const connectedUsers = new Map(); // 用來儲存用戶ID和對應的socket ID
  const roomUserCount = new Map(); // 用來追踪每個房間的用戶數量

  io.on("connection", (socket) => {
    socket.on("register-user", (userId) => {
      connectedUsers.set(userId, socket.id);

      console.log(
        `User with ID ${userId} connected with socket ID ${socket.id}`
      );
    });

    socket.on("join-room", (roomId, userId) => {
      socket.join(roomId);
      const currentCount = roomUserCount.get(roomId) || 0;
      roomUserCount.set(roomId, currentCount + 1);
      console.log(`${userId} joined room ${roomId}`);
    });

    socket.on("disconnect", () => {
      socket.rooms.forEach((roomId) => {
        const currentCount = roomUserCount.get(roomId) || 0;
        if (currentCount <= 1) {
          // 房間變空，可以在這裡進行一些操作
          console.log(`Room ${roomId} is now empty`);
          roomUserCount.delete(roomId); // 從計數器中移除房間
        } else {
          roomUserCount.set(roomId, currentCount - 1);
        }
        socket.to(roomId).emit("user-disconnected", socket.id);
      });
    });

    socket.on("leave-room", (roomId, userId) => {
      socket.leave(roomId);

      // 更新房間用戶計數
      const currentCount = roomUserCount.get(roomId) || 0;
      if (currentCount <= 1) {
        console.log(`Room ${roomId} is now empty`);
        roomUserCount.delete(roomId);
      } else {
        roomUserCount.set(roomId, currentCount - 1);
      }

      // 通知房間內的其他用戶
      socket.to(roomId).emit("user-left", userId);
    });

    socket.emit("connected");
  });
}
