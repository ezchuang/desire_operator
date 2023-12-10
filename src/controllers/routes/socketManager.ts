// 記得加 try error
import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { EventEmitter } from "events";
import jwt from "jsonwebtoken";

interface UserListElement {
  userName: string;
  userColor: string | undefined;
}

class SocketManager extends EventEmitter {
  private io: SocketServer | null = null;
  private roomUserList = new Map<string, UserListElement[]>([]); // 每個房間的用戶列表
  private colorList = ["#FF5733", "#33FF57", "#3357FF", "#FFFF33", "#33FFFF"];

  initialize(server: HttpServer): void {
    if (!this.io) {
      this.io = new SocketServer(server);
      this.configureSocket();
    }
  }

  private getColorForUser() {
    // private getColorForUser(colorList:string[], userIndex: number) {
    const color = this.colorList.shift();
    if (color) {
      this.colorList.push(color);
    }
    return color;
  }

  // get room id from token when new connection connected
  private getRoomIdFromToken(token: string) {
    try {
      const decoded = jwt.verify(token, global.publicKey, {
        algorithms: ["RS256"],
      }) as jwt.JwtPayload;

      if (!decoded) {
        throw new Error("這裡有問題");
      }
      return [
        decoded.userId,
        decoded.userName,
        global.userGroupMap.get(decoded.userId),
      ];
    } catch (error) {
      console.error("Token verification failed:", error);
      return [null, null, null];
    }
  }

  // 建立 io methods 在 io 中
  private configureSocket(): void {
    if (!this.io) return;

    this.io.on("connection", (socket: Socket) => {
      const token = socket.handshake.query.token as string;
      const [userId, userName, roomId] = this.getRoomIdFromToken(token);

      // 建立連線後直接跑邏輯進入 room
      if (roomId) {
        socket.join(roomId);
        // 保存用戶資訊
        socket.data = { userId, userName, roomId };

        // room 內人數計數器
        this.roomUserList.get(roomId) ?? this.roomUserList.set(roomId, []);
        const userList = this.roomUserList.get(roomId);
        if (userList) {
          userList.push({
            userName,
            userColor: this.getColorForUser(),
          });
          this.roomUserList.set(roomId, userList);
        }

        this.io?.to(roomId).emit("userListUpdated", userList);
      }

      // 向同一房間的所有用戶廣播新歷史記錄
      socket.on("refreshHistory", () => {
        console.log("refreshHistory on socket");

        socket.to(socket.data.roomId).emit("newHistoryAvailable");
      });

      socket.on("refreshColumns", () => {
        console.log("refreshColumns on socket");

        socket.to(socket.data.roomId).emit("columnsUpdated");
      });

      socket.on("refreshReadData", () => {
        console.log("refreshReadData on socket");

        // 處理刷新 readData 資料的邏輯
        socket.to(socket.data.roomId).emit("readDataUpdated");
      });

      socket.on("refreshUserList", () => {
        console.log("refreshUserList on socket");

        // 處理刷新 userList 資料的邏輯
        // socket.to(socket.data.roomId).emit("userListUpdated");
        // 包含自己
        this.io?.to(socket.data.roomId).emit("userListUpdated");
      });

      // 斷線清除多餘資料
      socket.on("disconnect", () => {
        const { userId, roomId } = socket.data || {};

        if (!roomId) {
          return;
        }

        if (userId) {
          global.userGroupMap.delete(userId);
        }

        // 刷新列表
        const userList = this.roomUserList.get(roomId) || [];
        const updatedUserList = userList.filter(
          (user) => user.userName !== userName
        );
        this.roomUserList.set(roomId, updatedUserList);

        // 廣播更新後的用戶列表
        socket.to(roomId).emit("userListUpdated", updatedUserList);

        // 非空判斷
        if (updatedUserList.length > 0) {
          return;
        }
        console.log(`Room ${roomId} is now empty and closing DB connection`);

        // 清除資料庫連線
        const dbPool = global.groupDbMap.get(roomId);
        if (dbPool) {
          dbPool.closePool();
          global.groupDbMap.delete(roomId);
        }
      });

      socket.emit("connected");
    });
  }

  getIo(): SocketServer | null {
    return this.io;
  }
}

export const socketManager = new SocketManager();
