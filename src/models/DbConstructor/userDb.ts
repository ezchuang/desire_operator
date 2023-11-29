import permissionsDb from "./permissionsDb";
import UserUtility from "../utility/UserUtility";

const userUtility = new UserUtility(permissionsDb);
async function createUserDb() {
  return await userUtility.getUserDb({
    userMail: "test2@test.com",
    userPw: "test",
  });
}

export default createUserDb();
