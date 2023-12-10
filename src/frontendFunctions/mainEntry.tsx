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
import { SocketProvider } from "./types/SocketContext";
import MainLayout from "./component/MainLayout";

const App: React.FC = () => {
  return (
    <SocketProvider>
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
    </SocketProvider>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));
