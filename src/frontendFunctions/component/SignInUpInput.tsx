import React, { useState } from "react";

export interface SignInData {
  email: string;
  password: string;
}

interface SignInUpFormProps {
  // eslint-disable-next-line no-unused-vars
  onSignIn: (data: SignInData) => void;
  // eslint-disable-next-line no-unused-vars
  onSignUp: (data: SignUpData) => void;
  onCancel: () => void;
  // eslint-disable-next-line no-unused-vars
  setErrorMessage: (errMsg: string) => void;
  errorMessage: string;
}

export interface SignUpData extends SignInData {
  name: string;
  newGroupName?: string;
  invitationCode?: string;
}

const SignInUpInput: React.FC<SignInUpFormProps> = ({
  onSignIn,
  onSignUp,
  onCancel,
  setErrorMessage,
  errorMessage,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  // const [errMsg, setErrorMessage] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSignUp) {
      onSignUp({ name, email, password, newGroupName, invitationCode });
    } else {
      onSignIn({ email, password });
    }
  };

  const toggleSignUp = () => {
    setErrorMessage("");
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="fullScreenCentered">
      <div
        className="absolute top-0 left-0 h-full w-full bg-black opacity-30"
        onClick={onCancel}
      ></div>
      <div className="formContainer">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 w-full"></div>
        <div className="formInner">
          <h3 className="text-lg font-bold mb-4 text-black">
            {isSignUp ? "註冊會員帳號" : "登入會員帳號"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="w-full px-8 flex flex-col items-center"
          >
            {isSignUp && (
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="輸入姓名"
                className="formField"
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="輸入電子信箱"
              className="formField"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="輸入密碼"
              className="formField"
            />
            {isSignUp && (
              <>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(event) => setNewGroupName(event.target.value)}
                  placeholder="輸入新群組名稱"
                  className="formField"
                />
                <input
                  type="password"
                  value={invitationCode}
                  onChange={(event) => setInvitationCode(event.target.value)}
                  placeholder="輸入群組邀請碼"
                  className="formField"
                />
              </>
            )}
            <div>
              <button type="submit" className="primaryButton">
                {isSignUp ? "註冊新帳戶" : "登入帳戶"}
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={onCancel}
                className="secondaryButton"
              >
                取消
              </button>
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}
          </form>
          <div className="mt-4 text-sm">
            {isSignUp ? (
              <span className="text-black">
                已有帳戶？{" "}
                <button
                  onClick={toggleSignUp}
                  className="text-blue-500 hover:text-blue-700"
                >
                  登入
                </button>
              </span>
            ) : (
              <span className="text-black">
                還沒有帳戶？{" "}
                <button
                  onClick={toggleSignUp}
                  className="text-blue-500 hover:text-blue-700"
                >
                  註冊
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInUpInput;
