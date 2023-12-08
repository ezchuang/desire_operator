import io from "socket.io-client";

export default function socketConnection() {
  const socket = io("/");

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  socket.on("connected", () => {
    console.log("connected to server2");
  });

  socket.emit("join-room", 10);

  // 發送一個事件到伺服器
  socket.emit("someEvent", { someData: "data" });

  // 接收從伺服器發送的事件
  socket.on("anotherEvent", (data) => {
    console.log("Received data:", data);
  });
}
