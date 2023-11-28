import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";

export default function ioConstructor(server: HttpServer): void {
  const io = new SocketServer(server);

  io.on("connection", (socket) => {
    socket.on("join-room", (userId) => {
      console.log(userId);
    });
    socket.emit("connected");
  });
}
