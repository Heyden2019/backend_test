"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskUpdateValidator = exports.taskCreateValidator = void 0;
const Status_1 = __importDefault(require("./../../models/Status"));
const express_validator_1 = require("express-validator");
exports.taskCreateValidator = [
    express_validator_1.check('title')
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
    express_validator_1.check('desc')
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
    express_validator_1.check('status_id')
        .trim().notEmpty().withMessage('Required')
        .matches(/^([0-9a-f]{24})$/i).withMessage('Invalid')
        .custom(status_id => {
        return Status_1.default.findById(status_id)
            .then(status => {
            return status
                ? Promise.resolve()
                : Promise.reject('Status is not exist');
        })
            .catch(err => {
            return Promise.reject('Invalid');
        });
    }),
];
exports.taskUpdateValidator = [
    express_validator_1.check('title').optional()
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
    express_validator_1.check('desc').optional()
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
    express_validator_1.check('status_id').optional()
        .trim().notEmpty().withMessage('Required')
        .matches(/^([0-9a-f]{24})$/i).withMessage('Invalid')
        .custom(status_id => {
        return Status_1.default.findById(status_id)
            .then(status => {
            return status
                ? Promise.resolve()
                : Promise.reject('Status is not exist');
        })
            .catch(err => {
            return Promise.reject('Invalid');
        });
    }),
];
//# sourceMappingURL=taskValidator.js.map