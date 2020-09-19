"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusUpdateValidator = exports.statusCreateValidator = void 0;
const express_validator_1 = require("express-validator");
exports.statusCreateValidator = [
    express_validator_1.check('title')
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
    express_validator_1.check('desc')
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
];
exports.statusUpdateValidator = [
    express_validator_1.check('title').optional()
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
    express_validator_1.check('desc').optional()
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min length is 6')
        .isLength({ max: 250 }).withMessage('Max length is 250'),
];
//# sourceMappingURL=statusValidator.js.map