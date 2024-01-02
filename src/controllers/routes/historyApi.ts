import express, { Request, Response, IRouter } from "express";
import rootDb from "../../models/dbConstructor/rootDb";
import HistoryUtility from "../../models/utility/HistoryUtility";
import verifyToken from "../../controllers/verifyToken";

export default async function historyApiInit() {
  const historyApi: IRouter = express.Router();

  const historyUtility = new HistoryUtility(rootDb);

  historyApi.get(
    "/history",
    verifyToken,
    async (req: Request, res: Response) => {
      console.log("getHistoryByUser");
      /*  #swagger.tags = ['History']
        #swagger.description = 'Endpoint to get the history of a user based on their group ID.'
        #swagger.security = [{
               "Bearer": []
        }]
        #swagger.responses[200] = { 
               description: 'History data successfully obtained.',
               schema: { $ref: '#/definitions/History' } 
        }
        #swagger.responses[400] = { 
               description: 'Bad request due to SQL error'
        }
        #swagger.responses[500] = { 
               description: 'Server error'
        }
    */

      try {
        let userGroup = global.userGroupMap.get(req.user!.userId) as string;

        // Guest 身分直接中斷此程序
        if (req.user!.isGuest) {
          return res.status(200).json({ data: [], structure: [] });
        }

        const [data, structure] = await historyUtility.getHistoryByGroupId(
          userGroup
        );

        return res.status(200).json({ data: data, structure: structure });
      } catch (err: any) {
        console.error("Error in getHistoryByUser: ", err);

        if ("sqlMessage" in err) {
          return res.status(400).json({ error: true, message: err.sqlMessage });
        }
        return res.status(500).json({ error: true, message: err });
      }
    }
  );

  return historyApi;
}
