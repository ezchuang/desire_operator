import React, { useState } from "react";

export interface SignInData {
  account: string;
  password: string;
  dbHost: string;
  userName: string;
}

interface GuestSignInFormProps {
  // eslint-disable-next-line no-unused-vars
  onSignIn: (data: SignInData) => void;
  onCancel: () => void;
  // eslint-disable-next-line no-unused-vars
  setErrorMessage: (errMsg: string) => void;
  errorMessage: string;
}

const GuestSignInInput: React.FC<GuestSignInFormProps> = ({
  onSignIn,
  onCancel,
  setErrorMessage,
  errorMessage,
}) => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [dbHost, setDbHost] = useState("");
  const [userName, setUserName] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!account || !password || !dbHost || !userName) {
      setErrorMessage("請填寫所有必要資訊");
      return;
    }

    onSignIn({ account, password, dbHost, userName });
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
            {"登入外部 MySQL 資料庫"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="w-full px-8 flex flex-col items-center"
          >
            <input
              required
              type="text"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              placeholder="輸入顯示姓名 (可隨意輸入)"
              className="formField"
            />
            <input
              required
              type="password"
              value={account}
              onChange={(event) => setAccount(event.target.value)}
              placeholder="輸入登入帳號 (伺服器不紀錄，僅做登入用)"
              className="formField"
            />
            <input
              required
              type="text"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="輸入密碼 (伺服器不紀錄，僅做登入用)"
              className="formField"
            />
            <input
              required
              type="text"
              value={dbHost}
              onChange={(event) => setDbHost(event.target.value)}
              placeholder="輸入MySQL主機位置 (Port為3306，目前不開放變更)"
              className="formField"
            />
            <div>
              <button type="submit" className="primaryButton">
                {"登入帳戶"}
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
        </div>
      </div>
    </div>
  );
};

export default GuestSignInInput;
