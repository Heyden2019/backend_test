import { myReq } from './../types';
import { Response} from "express";

export default (req: myReq, res: Response, next: any) => {
    if (req.session.userId === req.params.id) {
            return next()
    }
    res.sendStatus(403)
}