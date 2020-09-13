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
exports.registerValidator = void 0;
const User_1 = __importDefault(require("./../models/User"));
exports.registerValidator = ({ firstName, lastName, email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = [];
    if (!firstName || !lastName || !email || !password) {
        errors.push({ message: "Enter all fields" });
    }
    if (password.length < 6) {
        errors.push({ message: "Password mush be at least 6 characters" });
    }
    if (!email.includes("@")) {
        errors.push({ message: "Incorrect email" });
    }
    let user = yield User_1.default.findOne({ email });
    if (user) {
        errors.push({ message: "Email already exist" });
    }
    return errors;
});
//# sourceMappingURL=validator.js.map