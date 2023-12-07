import React from "react";
import ReactDOM from "react-dom";
import { ReadDataProvider } from "./types/ReadDataContext";
import { ColumnDataProvider } from "./types/ColumnDataContext";
import { ColumnOnShowProvider } from "./types/ColumnOnShowContext";
import { MessageProvider } from "./types/MessageContext";
import { DbsAndTablesProvider } from "./types/DbsAndTablesContext";
import { UserInfoProvider } from "./types/UserInfoContext";
import { VerificationProvider } from "./types/VerificationContext";
import { RefreshDataFlagProvider } from "./types/RefreshDataFlagContext";
import MainLayout from "./component/MainLayout";

// import io from "socket.io-client";

// const socket = io("/");

// socket.on("connect", () => {
//   console.log("Connected to server");
// });

// socket.on("disconnect", () => {
//   console.log("Disconnected from server");
// });

// socket.on("connected", () => {
//   console.log("connected to server2");
// });

// socket.emit("join-room", 10);

// // 發送一個事件到伺服器
// socket.emit("someEvent", { someData: "data" });

// // 接收從伺服器發送的事件
// socket.on("anotherEvent", (data) => {
//   console.log("Received data:", data);
// });

const App: React.FC = () => {
  return (
    <VerificationProvider>
      <MessageProvider>
        <UserInfoProvider>
          <ReadDataProvider>
            <DbsAndTablesProvider>
              <ColumnDataProvider>
                <ColumnOnShowProvider>
                  <RefreshDataFlagProvider>
                    <MainLayout />
                  </RefreshDataFlagProvider>
                </ColumnOnShowProvider>
              </ColumnDataProvider>
            </DbsAndTablesProvider>
          </ReadDataProvider>
        </UserInfoProvider>
      </MessageProvider>
    </VerificationProvider>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));
