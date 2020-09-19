import Status from "./../../models/Status"
import { check } from "express-validator"


export const taskCreateValidator = [
    check('title')
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
    check('desc')
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
    check('status_id')
        .trim().notEmpty().withMessage('Required')
        .matches(/^([0-9a-f]{24})$/i).withMessage('Invalid')
        .custom(status_id => {
            return Status.findById(status_id)
            .then(status => {
                return status
                ? Promise.resolve()
                : Promise.reject('Status is not exist') 
            })
            .catch(err => {
                return Promise.reject('Invalid')
            })
        }),
]

export const taskUpdateValidator = [
    check('title').optional()
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
    check('desc').optional()
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
    check('status_id').optional()
        .trim().notEmpty().withMessage('Required')
        .matches(/^([0-9a-f]{24})$/i).withMessage('Invalid')
        .custom(status_id => {
            return Status.findById(status_id)
            .then(status => {
                return status
                ? Promise.resolve()
                : Promise.reject('Status is not exist') 
            })
            .catch(err => {
                return Promise.reject('Invalid')
            })
        }),
]