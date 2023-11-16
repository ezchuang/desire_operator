import permissionsDb from "./permissionsDb";
import UserUtility from "../../models/utility/UserUtility";

const userUtility = new UserUtility(permissionsDb);
async function createUserDb() {
  return await userUtility.getUserDb({
    userMail: "test@test.com",
    userPw: "test",
  });
}

export default createUserDb();
