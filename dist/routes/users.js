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
const isAuthenticated_1 = __importDefault(require("./../util/isAuthenticated"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().select("-password").exec();
        res.status(200).json(users);
    }
    catch (err) {
        res.sendStatus(500);
    }
}));
router.get("/me", isAuthenticated_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.default.findById(req.session.userId, (err, user) => {
        if (err)
            return res.sendStatus(500);
        user.password = null;
        return res.status(200).json(user);
    });
}));
router.get("/logout", isAuthenticated_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy(err => {
        if (err) {
            return res.send({ message: 'Logout error' });
        }
        res.clearCookie(process.env.COOKIE_NAME);
        return res.status(200).json({ message: 'Logout success' });
    });
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.default.findById(req.params.id, (err, user) => {
        if (err || !user) {
            res.status(404).json({ message: "404 not found" });
        }
        else {
            res.status(200).json(user);
        }
    }).select("-password");
}));
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = yield validator_1.registerValidator(req.body);
    if (error) {
        return res.status(400).json(error);
    }
    console.log(req.body.password);
    const hashedPassword = yield argon2_1.default.hash(req.body.password);
    const user = new User_1.default(Object.assign(Object.assign({}, req.body), { password: hashedPassword, _id: new mongoose_1.default.Types.ObjectId() }));
    try {
        yield user.save();
        req.session.userId = user._id;
        res.status(201).json(user);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    let error;
    const user = yield User_1.default.findOne({ email: req.body.email }, (err, user) => {
        if (err || !user) {
            error = { message: "Email incorrect" };
        }
    }).select("+password");
    if (error) {
        return res.status(400).json(error);
    }
    const valid = yield argon2_1.default.verify(user.password, req.body.password.toString());
    if (!valid) {
        return res.status(400).json({ message: "Password incorrect" });
    }
    else {
        user.password = null;
        req.session.userId = user._id;
        res.status(200).json(user);
    }
}));
router.put("/", isAuthenticated_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    delete req.body._id;
    let error = validator_1.userUpdateValidator(req.body);
    if (error) {
        return res.status(400).json(error);
    }
    let body = req.body;
    if (req.body.password) {
        if (req.body.password.toString().length < 6) {
            return res.status(400).json({ message: "Password mush be at least 6 characters" });
        }
        body.password = yield argon2_1.default.hash(req.body.password.toString());
    }
    const user = yield User_1.default.updateOne({ _id: req.session.userId }, body);
    res.status(200).json(user);
}));
router.delete("/", isAuthenticated_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.default.deleteOne({ _id: req.session.userId }, error => {
        if (error) {
            res.send({ message: 'error' });
        }
        else {
            req.session.destroy(err => {
                if (err) {
                    return res.send({ message: 'error' });
                }
                res.clearCookie('qid');
                return res.status(200).json({ message: 'You were deleted successful' });
            });
        }
    });
}));
exports.default = router;
//# sourceMappingURL=users.js.map