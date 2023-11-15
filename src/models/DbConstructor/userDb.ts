import rightDb from "../../models/DbConstructor/rightDb";
import UserUtility from "../../models/utility/UserUtility";

const userUtility = new UserUtility(rightDb);
async function createUserDb() {
  return await userUtility.getUserDb({
    userMail: "test@test.com",
    userPw: "test",
  });
}

export default createUserDb();
