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
  const [isNewUserOrInvited, setIsNewUserOrInvited] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [invitationCode, setInvitationCode] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage("請填寫所有必要資訊");
      return;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setErrorMessage("電子郵箱格式不正確");
      return;
    }

    if (password.length < 4) {
      setErrorMessage("密碼至少需要 4 個字");
      return;
    }

    if (isSignUp) {
      if (!name) {
        setErrorMessage("請輸入使用者名稱");
        return;
      }
      if (isNewUserOrInvited && !newGroupName) {
        setErrorMessage("請輸入新群組名稱");
        return;
      } else if (!isNewUserOrInvited && !invitationCode) {
        setErrorMessage("請輸入邀請碼");
        return;
      }

      onSignUp({ name, email, password, newGroupName, invitationCode });
    } else {
      onSignIn({ email, password });
    }
  };

  const toggleSignUp = () => {
    setErrorMessage("");
    setIsSignUp(!isSignUp);
  };

  const toggleNewUserOrInvited = () => {
    setErrorMessage("");
    setIsNewUserOrInvited(!isNewUserOrInvited);
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
                required
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="輸入姓名"
                className="formField"
              />
            )}
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="輸入電子信箱"
              className="formField"
            />
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="輸入密碼"
              className="formField"
            />
            {isSignUp && isNewUserOrInvited ? (
              <input
                required
                type="text"
                value={newGroupName}
                onChange={(event) => setNewGroupName(event.target.value)}
                placeholder="輸入新群組名稱"
                className="formField"
              />
            ) : (
              <></>
            )}
            {isSignUp && !isNewUserOrInvited ? (
              <input
                required
                type="password"
                value={invitationCode}
                onChange={(event) => setInvitationCode(event.target.value)}
                placeholder="輸入群組邀請碼"
                className="formField"
              />
            ) : (
              <></>
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
            )}{" "}
          </div>
          {isSignUp && (
            <div className="mt-4 text-sm">
              <span className="text-black">
                {isNewUserOrInvited ? (
                  <>
                    有邀請碼？{" "}
                    <button
                      onClick={toggleNewUserOrInvited}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      輸入邀請碼
                    </button>
                  </>
                ) : (
                  <>
                    沒有邀請碼？{" "}
                    <button
                      onClick={toggleNewUserOrInvited}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      輸入新群組名稱
                    </button>
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInUpInput;
