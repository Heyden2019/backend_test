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
exports.statusUpdateValidator = exports.statusCreateValidator = exports.taskUpdateValidator = exports.userUpdateValidator = exports.taskCreateValidator = exports.registerValidator = void 0;
const User_1 = __importDefault(require("./../models/User"));
const Status_1 = __importDefault(require("./../models/Status"));
exports.registerValidator = ({ firstName, lastName, email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!firstName || !lastName || !email || !password) {
        return { message: "Enter all fields" };
    }
    if (typeof password !== 'string') {
        return { message: "Password mush be string" };
    }
    if (password.length < 6) {
        return { message: "Password mush be at least 6 characters" };
    }
    if (!email.includes("@")) {
        return { message: "Incorrect email" };
    }
    let error = null;
    yield User_1.default.findOne({ email }, (err, user) => {
        if (err || user) {
            error = { message: "Email already exist" };
        }
    });
    return error;
});
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
exports.userUpdateValidator = ({ firstName, lastName, email }) => {
    if (typeof firstName !== 'undefined' && (typeof firstName !== 'string' || firstName.length < 1)) {
        return { message: "Invalid firstName" };
    }
    if (typeof lastName !== 'undefined' && (typeof firstName !== 'string' || lastName.length < 1)) {
        return { message: "Invalid lastName" };
    }
    if (typeof email !== 'undefined' && (typeof email !== 'string' || !email.includes('@'))) {
        return { message: "Invalid email" };
    }
    return null;
};
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