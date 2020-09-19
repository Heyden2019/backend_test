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
const userValidator_1 = require("./../util/validators/userValidator");
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const argon2_1 = __importDefault(require("argon2"));
const isAuthenticated_1 = __importDefault(require("./../util/isAuthenticated"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    User_1.default.find().select("-password")
        .then(users => {
        res.status(200).json(users);
    })
        .catch(err => {
        res.status(500).json({ message: "Server error" });
    });
});
router.get("/me", isAuthenticated_1.default, (req, res) => {
    User_1.default.findById(req.session.userId)
        .then((user) => {
        user = user.toObject();
        delete user.password;
        res.status(200).json(user);
    })
        .catch(err => {
        res.status(500).json({ message: "Server error" });
    });
});
router.get("/logout", isAuthenticated_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy(err => {
        if (err) {
            return res.send({ message: 'Logout error' });
        }
        res.clearCookie(process.env.COOKIE_NAME);
        return res.status(200).json({ message: 'Logout success' });
    });
}));
router.get("/:id", (req, res) => {
    User_1.default.findById(req.params.id).select("-password")
        .then(user => {
        user
            ? res.status(200).json(user)
            : res.status(404).json({ message: "404 not found" });
    })
        .catch(err => {
        res.status(404).json({ message: "404 not found" });
    });
});
router.post("/register", userValidator_1.registerValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    delete req.body.image_id;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    const hashedPassword = yield argon2_1.default.hash(req.body.password);
    const user = yield new User_1.default(Object.assign(Object.assign({}, req.body), { password: hashedPassword, _id: new mongoose_1.default.Types.ObjectId() }));
    user.save()
        .then((user) => {
        req.session.userId = user._id;
        user = user.toObject();
        delete user.password;
        res.status(201).json(user);
    })
        .catch(err => {
        res.status(500).send('Server Error');
    });
}));
router.post("/login", userValidator_1.loginValidator, (req, res) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    User_1.default.findOne({ email: req.body.email })
        .then((user) => {
        req.session.userId = user._id;
        user = user.toObject();
        delete user.password;
        res.status(200).json(user);
    })
        .catch(() => {
        res.status(500).json({ message: "Server error" });
    });
});
router.put("/", isAuthenticated_1.default, userValidator_1.userUpdateValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    delete req.body._id;
    delete req.body.image_id;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    if (req.body.password) {
        req.body.password = yield argon2_1.default.hash(req.body.password);
    }
    User_1.default.findOneAndUpdate({ _id: req.session.userId }, req.body).select('-password')
        .then((user) => {
        user
            ? res.status(200).json(user)
            : res.status(500).json({ message: "Server error" });
    })
        .catch(err => {
        res.status(500).json({ message: "Server error" });
    });
}));
router.delete("/", isAuthenticated_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.default.deleteOne({ _id: req.session.userId })
        .then(() => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: "Server error" });
            }
            res.clearCookie(process.env.COOKIE_NAME);
            return res.status(200).json({ message: 'You were deleted successful' });
        });
    })
        .catch(err => {
        res.status(500).json({ message: "Server error" });
    });
}));
exports.default = router;
//# sourceMappingURL=users.js.map