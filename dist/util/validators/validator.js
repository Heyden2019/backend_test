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
exports.statusUpdateValidator = exports.statusCreateValidator = exports.taskUpdateValidator = exports.userUpdateValidator = exports.taskCreateValidator = exports.loginValidator = exports.registerValidator = void 0;
const User_1 = __importDefault(require("./../models/User"));
const Status_1 = __importDefault(require("./../models/Status"));
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
            return null;
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
exports.taskCreateValidator = ({ title, status_id, desc }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!title || !status_id || !desc) {
        return { message: "Enter all fields" };
    }
    if (typeof title !== 'string' || typeof status_id !== 'string' || typeof desc !== 'string') {
        return { message: "All fields must be 'string'" };
    }
    if (title.length < 6 || desc.length < 6) {
        return { message: "Title and Desc must be at least 6 characters" };
    }
    let error = null;
    yield Status_1.default.findById(status_id, (err, status) => {
        if (err || !status) {
            error = { message: "Invalid status_id" };
        }
    }).catch(e => error = { message: "Invalid status_id" });
    return error;
});
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
exports.taskUpdateValidator = ({ title, status_id, desc }) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof title !== 'undefined' && (typeof title !== 'string' || title.length < 6)) {
        return { message: "Invalid title" };
    }
    if (typeof desc !== 'undefined' && (typeof desc !== 'string' || desc.length < 6)) {
        return { message: "Invalid desc" };
    }
    let error = null;
    if (status_id) {
        yield Status_1.default.findOne({ _id: status_id }, (err, status) => {
            if (!status || err) {
                error = { message: "Invalid status_id" };
            }
        }).catch(() => { error = { message: "Invalid status_id" }; });
    }
    return error;
});
exports.statusCreateValidator = ({ desc, title }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!title || !desc) {
        return { message: "Enter all fields" };
    }
    if (typeof title !== 'string' || typeof desc !== 'string') {
        return { message: "All fields must be 'string'" };
    }
    if (title.length < 6 || desc.length < 6) {
        return { message: "Title and Desc must be at least 6 characters" };
    }
    return null;
});
exports.statusUpdateValidator = ({ desc, title }) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof title !== 'undefined' && (typeof title !== 'string' || title.length < 6)) {
        return { message: "Invalid title (must be string, at least 6char)" };
    }
    if (typeof desc !== 'undefined' && (typeof desc !== 'string' || desc.length < 6)) {
        return { message: "Invalid desc (must be string, at least 6char)" };
    }
    return null;
});
//# sourceMappingURL=validator.js.map