import {Request} from "express";

export type myReq = Request & {session: Express.Session};

export type userValidatorPropsType = {
    firstName?: string,
    lastName?: string, 
    email?: string, 
    password?: string,
}

export type taskValidatorPropsType = {
    title?: string, 
    status_id?: string, 
    desc?: string
}

export type statusValidatorPropsType = {
    title?: string,
    desc?: string
}
