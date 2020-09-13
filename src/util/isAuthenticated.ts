import { myReq } from './../types';
import { Response} from "express";

export default (req: myReq, res: Response, next: any) => {
    if (req.session.userId) {
            return next()
    }
    res.sendStatus(401)
}