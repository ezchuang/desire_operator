import React from "react";
import ReactDOM from "react-dom";
import { ReadDataProvider } from "./types/ReadDataContext";
import { UserInfoProvider } from "./types/UserInfoContext";
import { VerificationProvider } from "./types/VerificationContext";
import IndexLayout from "./component/IndexLayout";

const App: React.FC = () => {
  return (
    <VerificationProvider>
      <UserInfoProvider>
        <ReadDataProvider>
          <IndexLayout />
        </ReadDataProvider>
      </UserInfoProvider>
    </VerificationProvider>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));
