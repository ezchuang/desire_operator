export let verified: boolean = true;

// export function linkToUrl(url: string): void {
//   window.location.href = url;
// }

function sleep(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// function delCookie(key: string): void {
//   let date = new Date();
//   date.setTime(date.getTime() - 1000);
//   document.cookie = `${key}='';expires=${date.toGMTString()}`;
// }

// 登入判斷按鈕
function signinJudge(success: boolean): void {
  let inpPageBtn = document.querySelector("#signin") as HTMLButtonElement;
  if (!success) {
    verified = false;
    inpPageBtn.textContent = `登入/註冊`;
    inpPageBtn.removeEventListener("click", logout);
    inpPageBtn.addEventListener("click", createSignin);
    return;
  }
  verified = true;
  inpPageBtn.textContent = `登出帳號`;
  inpPageBtn.removeEventListener("click", createSignin);
  inpPageBtn.addEventListener("click", logout);
}

// 顯示錯誤訊息
export function errMsg(msg: string): void {
  let errMsgFrame = document.querySelector(".errMsgFrame") as HTMLDivElement;
  errMsgFrame.style.display = "flex";
  errMsgFrame.textContent = msg;
}

// 創建登入頁面
function createSignin(): void {
  // 建立結構
  let body = document.querySelector("body")!;
  let formOuterFrame = document.createElement("div");
  body.appendChild(formOuterFrame);

  let relativeFrame = document.createElement("div");
  let formMask = document.createElement("div");
  let formStyle = document.createElement("div");
  let formBanner = document.createElement("div");
  let formMiddleFrame = document.createElement("div");
  formOuterFrame.appendChild(relativeFrame);
  relativeFrame.appendChild(formMask);
  relativeFrame.appendChild(formStyle);
  formStyle.appendChild(formBanner);
  formStyle.appendChild(formMiddleFrame);

  let formTitle = document.createElement("div");
  let formInnerFrame = document.createElement("form");
  let nameIpt = document.createElement("input");
  let emailIpt = document.createElement("input");
  let pwIpt = document.createElement("input");
  let newGroupNameIpt = document.createElement("input");
  let invitationCodeIpt = document.createElement("input");
  let signinBtn = document.createElement("button");
  let errMsgFrame = document.createElement("div");
  let switchBtnFrame = document.createElement("div");
  formMiddleFrame.appendChild(formTitle);
  formMiddleFrame.appendChild(formInnerFrame);
  formInnerFrame.appendChild(nameIpt);
  formInnerFrame.appendChild(emailIpt);
  formInnerFrame.appendChild(pwIpt);
  formInnerFrame.appendChild(newGroupNameIpt);
  formInnerFrame.appendChild(invitationCodeIpt);
  formInnerFrame.appendChild(signinBtn);
  formInnerFrame.appendChild(errMsgFrame);
  formInnerFrame.appendChild(switchBtnFrame);

  let switchBtnText = document.createElement("div");
  let signinPageSwitchBtn = document.createElement("div");
  switchBtnFrame.appendChild(switchBtnText);
  switchBtnFrame.appendChild(signinPageSwitchBtn);

  // 插入 class
  formOuterFrame.classList.add("formOuterFrame");
  relativeFrame.classList.add("relativeFrame");
  formMask.classList.add("formMask");
  formStyle.classList.add("formStyle");
  formBanner.classList.add("formBanner");

  formMiddleFrame.classList.add("formMiddleFrame");
  formTitle.classList.add("formTitle");
  formTitle.classList.add("h3");
  formTitle.classList.add("bold");
  formInnerFrame.classList.add("formInnerFrame");
  nameIpt.classList.add("nameIpt");
  nameIpt.classList.add("content");
  nameIpt.classList.add("medium");
  emailIpt.classList.add("emailIpt");
  emailIpt.classList.add("content");
  emailIpt.classList.add("medium");
  pwIpt.classList.add("pwIpt");
  pwIpt.classList.add("content");
  pwIpt.classList.add("medium");
  newGroupNameIpt.classList.add("nameIpt");
  newGroupNameIpt.classList.add("content");
  newGroupNameIpt.classList.add("medium");
  invitationCodeIpt.classList.add("nameIpt");
  invitationCodeIpt.classList.add("content");
  invitationCodeIpt.classList.add("medium");
  signinBtn.classList.add("signinBtn");
  signinBtn.classList.add("whiteText");
  signinBtn.classList.add("button");
  signinBtn.classList.add("regular");
  signinBtn.classList.add("pointer");
  errMsgFrame.classList.add("errMsgFrame");
  switchBtnFrame.classList.add("switchBtnFrame");
  switchBtnText.classList.add("switchBtnText");
  signinPageSwitchBtn.classList.add("signinPageSwitchBtn");
  signinPageSwitchBtn.classList.add("pointer");

  // 插入內容、id
  let titleText = document.createTextNode("登入會員帳號");
  formTitle.appendChild(titleText);
  formInnerFrame.setAttribute("onSubmit", "return false");
  nameIpt.setAttribute("type", "text");
  nameIpt.setAttribute("name", "nameIpt");
  nameIpt.setAttribute("id", "nameIpt");
  nameIpt.setAttribute("placeholder", "輸入姓名");
  nameIpt.style.display = "none";
  emailIpt.setAttribute("type", "email");
  emailIpt.setAttribute("name", "emailIpt");
  emailIpt.setAttribute("id", "emailIpt");
  emailIpt.setAttribute("placeholder", "輸入電子信箱");
  pwIpt.setAttribute("type", "password");
  pwIpt.setAttribute("name", "pwIpt");
  pwIpt.setAttribute("id", "pwIpt");
  pwIpt.setAttribute("placeholder", "輸入密碼");
  newGroupNameIpt.setAttribute("type", "text");
  newGroupNameIpt.setAttribute("name", "newGroupNameIpt");
  newGroupNameIpt.setAttribute("id", "newGroupNameIpt");
  newGroupNameIpt.setAttribute("placeholder", "輸入新群組名稱");
  newGroupNameIpt.style.display = "none";
  invitationCodeIpt.setAttribute("type", "password");
  invitationCodeIpt.setAttribute("name", "invitationCodeIpt");
  invitationCodeIpt.setAttribute("id", "invitationCodeIpt");
  invitationCodeIpt.setAttribute("placeholder", "輸入群組邀請碼");
  invitationCodeIpt.style.display = "none";
  let signinBtnText = document.createTextNode("登入帳戶");
  signinBtn.appendChild(signinBtnText);
  let switchBtnTextText = document.createTextNode("還沒有帳戶?");
  switchBtnText.appendChild(switchBtnTextText);
  let signinPageSwitchBtnText = document.createTextNode("點此註冊");
  signinPageSwitchBtn.appendChild(signinPageSwitchBtnText);

  // 加入 Event
  formMask.addEventListener("click", removeSigninupPage);
  signinBtn.addEventListener("click", signin);
  signinPageSwitchBtn.addEventListener("click", showSignup);
}

// 隱藏登入/註冊頁面
function removeSigninupPage(): void {
  let body = document.querySelector("body") as HTMLBodyElement;
  let formOuterFrame = document.querySelector(
    ".formOuterFrame"
  ) as HTMLDivElement;
  body.removeChild(formOuterFrame);
}

// 顯示註冊頁面
function showSignup(): void {
  let formTitle = document.querySelector(".formTitle") as HTMLDivElement;
  formTitle.textContent = "註冊會員帳號";

  let nameIpt = document.querySelectorAll(".nameIpt");
  nameIpt.forEach((element) => {
    if (element instanceof HTMLInputElement) {
      element.style.display = "block";
    }
  });

  let signinBtn = document.querySelector(".signinBtn") as HTMLDivElement;
  signinBtn.textContent = "註冊新帳戶";
  signinBtn.removeEventListener("click", signin);
  signinBtn.addEventListener("click", signup);

  let errMsgFrame = document.querySelector(".errMsgFrame") as HTMLDivElement;
  errMsgFrame.style.display = "none";

  let switchBtnText = document.querySelector(
    ".switchBtnText"
  ) as HTMLDivElement;
  switchBtnText.textContent = "已經有帳戶了?";

  let signinPageSwitchBtn = document.querySelector(
    ".signinPageSwitchBtn"
  ) as HTMLDivElement;
  signinPageSwitchBtn.textContent = "點此登入";

  signinPageSwitchBtn.removeEventListener("click", showSignup);
  signinPageSwitchBtn.addEventListener("click", showSignin);
}

// 顯示登入頁面
function showSignin(): void {
  let formTitle = document.querySelector(".formTitle") as HTMLDivElement;
  formTitle.textContent = "登入會員帳號";

  let nameIpt = document.querySelectorAll(".nameIpt");
  nameIpt.forEach((element) => {
    if (element instanceof HTMLInputElement) {
      element.style.display = "none";
    }
  });

  let signinBtn = document.querySelector(".signinBtn") as HTMLDivElement;
  signinBtn.textContent = "登入帳戶";
  signinBtn.removeEventListener("click", signup);
  signinBtn.addEventListener("click", signin);

  let errMsgFrame = document.querySelector(".errMsgFrame") as HTMLDivElement;
  errMsgFrame.style.display = "none";

  let switchBtnText = document.querySelector(
    ".switchBtnText"
  ) as HTMLDivElement;
  switchBtnText.textContent = "還沒有帳戶?";

  let signinPageSwitchBtn = document.querySelector(
    ".signinPageSwitchBtn"
  ) as HTMLDivElement;
  signinPageSwitchBtn.textContent = "點此註冊";

  signinPageSwitchBtn.removeEventListener("click", showSignin);
  signinPageSwitchBtn.addEventListener("click", showSignup);
}

// 登出
function logout(): void {
  localStorage.removeItem("token");
  signinJudge(false);
}

// 註冊
async function signup(): Promise<void> {
  let formInnerFrame = document.querySelector(
    ".formInnerFrame"
  ) as HTMLFormElement;
  let nameIpt = formInnerFrame.querySelector("#nameIpt") as HTMLInputElement;
  let emailIpt = formInnerFrame.querySelector("#emailIpt") as HTMLInputElement;
  let pwIpt = formInnerFrame.querySelector("#pwIpt") as HTMLInputElement;
  let newGroupNameIpt = formInnerFrame.querySelector(
    "#newGroupNameIpt"
  ) as HTMLInputElement;
  let invitationCodeIpt = formInnerFrame.querySelector(
    "#invitationCodeIpt"
  ) as HTMLInputElement;
  let name = nameIpt.value;
  let email = emailIpt.value;
  let password = pwIpt.value;
  let newGroupName = newGroupNameIpt.value;
  let invitationCode = invitationCodeIpt.value;
  if (!name) {
    errMsg("請輸入使用者名稱");
    return;
  } else if (!email) {
    errMsg("請輸入 e-mail");
    return;
  } else if (!password) {
    errMsg("請輸入密碼");
    return;
  } else if (!(newGroupName || invitationCode)) {
    errMsg("請輸入 新群組名稱 或 邀請碼 其中之一");
    return;
  }

  const signupResult = await fetch("/api/createUser", {
    method: "POST",
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      newGroupName: newGroupName,
      invitationCode: invitationCode,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await signupResult.json();
  if (result.error) {
    errMsg(result.message!);
    return;
  }
  removeSigninupPage();
}

// 登入邏輯
async function signin(): Promise<void> {
  let formInnerFrame = document.querySelector(
    ".formInnerFrame"
  ) as HTMLFormElement;
  let emailIpt = formInnerFrame.querySelector("#emailIpt") as HTMLInputElement;
  let pwIpt = formInnerFrame.querySelector("#pwIpt") as HTMLInputElement;
  let email = emailIpt.value;
  let password = pwIpt.value;

  if (!email) {
    errMsg("請輸入 e-mail");
    return;
  } else if (!password) {
    errMsg("請輸入密碼");
    return;
  }

  const userDataResponse = await fetch("/api/signin", {
    method: "PUT",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const userData = await userDataResponse.json();
  if (userData.error) {
    errMsg(userData.message!);
    localStorage.clear();
    return;
  } else {
    errMsg("登入成功");
  }
  localStorage.setItem("token", userData.token);

  await sleep(1000);

  removeSigninupPage();
  signinJudge(true);
  verifyUser();
}

// 驗證登入狀態
export async function verifyUser(): Promise<boolean> {
  let tokenValue = localStorage.getItem("token");
  if (!tokenValue) {
    signinJudge(false);
    return false;
  }

  let userDataResponse = await fetch("/api/auth", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenValue}`,
    },
  });

  const userData = await userDataResponse.json();
  if (!userData.data) {
    localStorage.removeItem("token");
    signinJudge(false);
    return false;
  }
  //   document.cookie = `name=${userData.data.name}; `;
  signinJudge(true);

  return true;
}

// 監聽事件
// document.addEventListener("DOMContentLoaded", async () => {
//   // 讓換面轉跳留給 JS function 控制
//   // var links = document.querySelectorAll("a");
//   // for (var i = 0; i < links.length; i++) {
//   //   links[i].addEventListener("click", function (event) {
//   //     event.preventDefault();
//   //   });
//   // }

//   // 驗證是否登入
//   await verifyUser();
// });

// const bookingPageBtn = document.querySelector(
//   "#bookingPageBtn"
// ) as HTMLButtonElement;
// bookingPageBtn.addEventListener("click", () => {
//   if (!verified) {
//     createSignin();
//   } else {
//     let url: string = "/booking";
//     linkToUrl(url);
//   }
// });
