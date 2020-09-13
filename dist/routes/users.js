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
const validator_1 = require("./../util/validator");
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const argon2_1 = __importDefault(require("argon2"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find().exec();
    res.status(200).json(users);
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id).exec();
        res.status(200).json(user);
    }
    catch (err) {
        res.status(404).json(err.message);
    }
}));
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = yield validator_1.registerValidator(req.body);
    if (errors)
        res.status(400).json(errors);
    const hashedPassword = yield argon2_1.default.hash(req.body.password);
    const user = new User_1.default(Object.assign(Object.assign({}, req.body), { password: hashedPassword, _id: new mongoose_1.default.Types.ObjectId() }));
    try {
        yield user.save();
        console.log(user);
    }
    catch (err) {
        console.log('err', err);
        res.status(400).json(err.message);
    }
}));
router.post('/login', (req, res, next) => {
    passport_1.default.authenticate('local', {}, () => {
        res.sendStatus(200);
    })(req, res, next);
});
router.get('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
});
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield User_1.default.updateOne({ _id: req.params.id }, req.body);
        res.status(200).json(task);
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.default.deleteOne({ _id: req.params.id });
        res.sendStatus(200);
    }
    catch (err) {
        res.status(404).json(err.message);
    }
}));
exports.default = router;
//# sourceMappingURL=users.js.map