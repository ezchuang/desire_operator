import express, { Request, Response, IRouter } from "express";


const apiRoute: IRouter = express.Router();


apiRoute.get("/test", (req: Request, res: Response) => {
    const data = {a:100, b:200}
    
    return res.status(200).json({ "data": data })
});




export default apiRoute;