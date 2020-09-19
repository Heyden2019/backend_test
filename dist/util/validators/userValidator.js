"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateValidator = exports.loginValidator = exports.registerValidator = void 0;
const User_1 = __importDefault(require("./../../models/User"));
const express_validator_1 = require("express-validator");
const argon2_1 = __importDefault(require("argon2"));
let _password;
exports.registerValidator = [
    express_validator_1.check('firstName')
        .trim().notEmpty().withMessage('Required')
        .matches(/^([a-zA-Z]+)$/m).withMessage('Only letters')
        .isLength({ max: 15 }).withMessage('Max length is 15'),
    express_validator_1.check('lastName')
        .trim().notEmpty().withMessage('Required')
        .matches(/^([a-zA-Z]+)$/m).withMessage('Only letters')
        .isLength({ max: 15 }).withMessage('Max length is 15'),
    express_validator_1.check('password')
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min password length - 6')
        .isLength({ max: 20 }).withMessage('Max password length - 20'),
    express_validator_1.check('email')
        .trim().notEmpty().withMessage('Required')
        .matches(/^([a-z0-9]+\.?[a-z0-9]+[@][a-z]{1,10}\.[a-z]{2,4})$/i).withMessage('Invalid')
        .isLength({ min: 6 }).withMessage('Min email length - 6')
        .isLength({ max: 50 }).withMessage('Max email length - 50')
        .normalizeEmail()
        .custom(email => {
        return User_1.default.findOne({ email }).then(user => {
            if (user) {
                return Promise.reject('Email already exist');
            }
            return Promise.resolve();
        });
    }).withMessage('Email already exist'),
];
exports.loginValidator = [
    express_validator_1.check('email')
        .trim().notEmpty().withMessage('Required')
        .matches(/^([a-z0-9]+\.?[a-z0-9]+[@][a-z]{1,10}\.[a-z]{2,4})$/i).withMessage('Invalid')
        .normalizeEmail()
        .custom(email => {
        return User_1.default.findOne({ email }).select("password").then((user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user) {
                _password = user.password;
                return Promise.resolve();
            }
            return Promise.reject('Email is not exist');
        }));
    }).withMessage('Email already exist'),
    express_validator_1.check('password')
        .trim().notEmpty().withMessage('Required')
        .custom((pwd) => __awaiter(void 0, void 0, void 0, function* () {
        if (!_password)
            return Promise.resolve();
        const valid = yield argon2_1.default.verify(_password, pwd);
        if (!valid) {
            return Promise.reject('Password incorrect');
        }
        else {
            return Promise.resolve();
        }
    })),
];
exports.userUpdateValidator = [
    express_validator_1.check('firstName').optional()
        .trim().notEmpty().withMessage('Required')
        .matches(/^([a-zA-Z]+)$/m).withMessage('Only letters')
        .isLength({ max: 15 }).withMessage('Max length is 15'),
    express_validator_1.check('lastName').optional()
        .trim().notEmpty().withMessage('Required')
        .matches(/^([a-zA-Z]+)$/m).withMessage('Only letters')
        .isLength({ max: 15 }).withMessage('Max length is 15'),
    express_validator_1.check('email').optional()
        .trim().notEmpty().withMessage('Required')
        .matches(/^([a-z0-9]+\.?[a-z0-9]+[@][a-z]{1,10}\.[a-z]{2,4})$/i).withMessage('Invalid')
        .isLength({ min: 6 }).withMessage('Min email length - 6')
        .isLength({ max: 50 }).withMessage('Max email length - 50')
        .normalizeEmail()
        .custom(email => {
        return User_1.default.findOne({ email }).then(user => {
            if (user) {
                return Promise.reject('Email already exist');
            }
            return null;
        });
    }).withMessage('Email already exist'),
    express_validator_1.check('password').optional()
        .trim().notEmpty().withMessage('Required')
        .isLength({ min: 6 }).withMessage('Min password length - 6')
        .isLength({ max: 20 }).withMessage('Max password length - 20'),
];
//# sourceMappingURL=userValidator.js.map