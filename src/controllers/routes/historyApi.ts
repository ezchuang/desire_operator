import express, { Request, Response, IRouter } from "express";
import rootDb from "../../models/dbConstructor/rootDb";
import HistoryUtility from "../../models/utility/HistoryUtility";
import verifyToken from "../../controllers/verifyToken";

export default async function historyApiInit() {
  const historyApi: IRouter = express.Router();

  const historyUtility = new HistoryUtility(rootDb);

  historyApi.get(
    "/getHistoryByUser",
    verifyToken,
    async (req: Request, res: Response) => {
      console.log("getHistoryByUser");
      try {
        let userGroup = global.userGroupMap.get(req.user!.userId) as string;

        const [data, structure] = await historyUtility.getHistoryByGroupId(
          userGroup
        );

        return res.status(200).json({ data: data, structure: structure });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    }
  );

  return historyApi;
}
