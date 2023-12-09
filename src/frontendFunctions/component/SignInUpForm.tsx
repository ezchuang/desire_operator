import React, { useEffect, useState } from "react";
import { useVerification } from "../types/VerificationContext";
import { useUserInfo } from "../types/UserInfoContext";
import SignInUpInput, { SignInData, SignUpData } from "./SignInUpInput";

const SignInUpForm: React.FC = () => {
  const { setUserInfo } = useUserInfo();
  const { isVerified, setIsVerified } = useVerification();

  const [signInUpVisible, setSignInUpVisible] = useState(false);
  const [errMsg, setErrorMessage] = useState("");

  function linkToUrl(url: string): void {
    window.location.href = url;
  }

  // 登入
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

      if (response.status !== 200 && !result.success) {
        setErrorMessage(result.message || "未知錯誤");
        return;
      }

      // 將 Token 寫入 localStorage
      localStorage.setItem("token", result.data.token);

      setUserInfo({
        userName: result.data.userName,
        groupName: result.data.groupName,
        invitationCode: result.data.invitationCode,
      });
      setIsVerified(true);
      setSignInUpVisible(false);

      // 轉跳判斷
      if (window.location.pathname !== "/main") {
        const url = "/main";
        linkToUrl(url);
      }
    } catch (error) {
      setErrorMessage("服務器錯誤");
    }
  };

  // 創建使用者
  const handleSignUp = async (data: SignUpData) => {
    try {
      // 註冊驗證
      const signUpResponse = await fetch("/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const signUpResult = await signUpResponse.json();

      if (signUpResponse.status !== 200 || !signUpResult.success) {
        setErrorMessage(signUpResult.message || "未知錯誤");
        return;
      }

      // 直接做登入驗證
      const signInResponse = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const signInResult = await signInResponse.json();

      // 將 Token 寫入 localStorage
      localStorage.setItem("token", signInResult.data.token);

      // 轉跳判斷
      if (window.location.pathname !== "/main") {
        const url = "/main";
        linkToUrl(url);
      }
    } catch (error) {
      setErrorMessage("服務器錯誤");
    }
  };

  // 關閉登入註冊頁
  const handleCancel = () => {
    setSignInUpVisible(false);
  };

  // 登出按鈕，包含轉跳頁面
  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsVerified(false);

    if (window.location.pathname !== "/") {
      const url = "/";
      linkToUrl(url);
    }
  };

  // 抓取是否有 Token，有的話打去後端驗證
  // 順利的話 (在非 main 頁) 會轉跳到 /main
  const verifyUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsVerified(false);

        // 轉跳判斷
        if (window.location.pathname !== "/") {
          const url = "/";
          linkToUrl(url);
        }

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
      setUserInfo({
        userName: result.data.userName,
        groupName: result.data.groupName,
        invitationCode: result.data.invitationCode,
      });

      if (response.status === 200 && result.success) {
        setIsVerified(true);

        // 轉跳判斷
        if (window.location.pathname !== "/main") {
          const url = "/main";
          linkToUrl(url);
        }
      } else {
        localStorage.removeItem("token");

        setIsVerified(false);

        // 轉跳判斷
        // if (window.location.pathname !== "/") {
        //   const url = "/";
        //   linkToUrl(url);
        // }

        // 因為錯誤了，無論如何都轉跳
        const url = "/";
        linkToUrl(url);
      }
    } catch (error) {
      console.error("Error verifying user:", error);

      localStorage.removeItem("token");

      setIsVerified(false);

      // 轉跳判斷
      if (window.location.pathname !== "/") {
        const url = "/";
        linkToUrl(url);
      }
    }
  };

  // 初始化，確認是否已登入
  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <div>
      {signInUpVisible && (
        <SignInUpInput
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onCancel={handleCancel}
          setErrorMessage={setErrorMessage}
          errorMessage={errMsg}
        />
      )}

      {isVerified ? (
        <button onClick={handleSignOut}>登出帳號</button>
      ) : (
        <button onClick={() => setSignInUpVisible(true)}>登入/註冊</button>
      )}
    </div>
  );
};

export default SignInUpForm;
