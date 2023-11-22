import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
// import { signinJudge } from "./signinVerify";
import SignInUpForm, { SignInData, SignUpData } from "./signinForm";

const App: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [signInUpVisible, setSignInUpVisible] = useState(false);
  const [errMsg, setErrorMessage] = useState("");

  function linkToUrl(url: string): void {
    window.location.href = url;
  }

  const handleSignIn = async (data: SignInData) => {
    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.status === 200 && result.success) {
        // 將 Token 寫入 localStorage
        localStorage.setItem("token", result.token);

        setIsVerified(true);
        setSignInUpVisible(false);

        const url = "/main";
        linkToUrl(url);
      } else {
        setErrorMessage(result.message || "未知錯誤");
      }
    } catch (error) {
      setErrorMessage("服務器錯誤");
    }
  };

  const handleSignUp = async (data: SignUpData) => {
    try {
      const response = await fetch("/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setIsVerified(true);
        setSignInUpVisible(false);
      } else {
        setErrorMessage(result.message || "未知錯誤");
      }
    } catch (error) {
      setErrorMessage("服務器錯誤");
    }
  };

  const handleCancel = () => {
    setSignInUpVisible(false);
  };

  const verifyUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsVerified(false);
        return;
      }

      const response = await fetch("/api/auth", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (response.status === 200 && result.success) {
        setIsVerified(true);

        const url = "/main";
        linkToUrl(url);
      } else {
        localStorage.removeItem("token");

        setIsVerified(false);
      }
    } catch (error) {
      console.error("Error verifying user:", error);

      localStorage.removeItem("token");

      setIsVerified(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <div>
      {signInUpVisible && (
        <SignInUpForm
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onCancel={handleCancel}
          setErrorMessage={setErrorMessage}
          errorMessage={errMsg}
        />
      )}

      {isVerified ? (
        <button
          onClick={() => {
            return false;
          }}
        >
          登出帳號
        </button>
      ) : (
        <button onClick={() => setSignInUpVisible(true)}>登入/註冊</button>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));
