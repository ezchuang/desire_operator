import React from "react";
import ReactDOM from "react-dom";
import { ReadDataProvider } from "./types/ReadDataContext";
import { UserNameProvider } from "./types/UserNameContext";
import { VerificationProvider } from "./types/VerificationContext";
import IndexLayout from "./component/IndexLayout";

const App: React.FC = () => {
  return (
    <VerificationProvider>
      <UserNameProvider>
        <ReadDataProvider>
          <IndexLayout />
        </ReadDataProvider>
      </UserNameProvider>
    </VerificationProvider>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));
