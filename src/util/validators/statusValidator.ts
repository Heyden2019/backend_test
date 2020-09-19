import { check } from "express-validator"

export const statusCreateValidator = [
    check('title')
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
    check('desc')
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
]

export const statusUpdateValidator = [
    check('title').optional()
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
    check('desc').optional()
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
]
