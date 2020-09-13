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
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const Status_1 = __importDefault(require("../models/Status"));
const isAuthenticated_1 = __importDefault(require("./../util/isAuthenticated"));
const validator_1 = require("./../util/validator");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const statuses = yield Status_1.default.find().exec();
        res.status(200).json(statuses);
    }
    catch (err) {
        res.sendStatus(500);
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let error = null;
    yield Status_1.default.findById(req.params.id, (err, status) => {
        if (err || !status) {
            error = true;
        }
        else {
            res.status(200).json(status);
        }
    }).catch(() => { error = true; });
    error ? res.sendStatus(404) : null;
}));
router.post("/", isAuthenticated_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = yield validator_1.statusCreateValidator(req.body);
    if (error) {
        return res.status(400).json(error);
    }
    const status = new Status_1.default(Object.assign(Object.assign({}, req.body), { _id: new mongoose_1.default.Types.ObjectId() }));
    try {
        yield status.save();
        res.status(201).json(status);
    }
    catch (err) {
        res.sendStatus(400);
    }
}));
router.put("/:id", isAuthenticated_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    delete req.body._id;
    let error = validator_1.statusUpdateValidator(req.body);
    if (error) {
        res.sendStatus(400).json(error);
    }
    yield Status_1.default.updateOne({ _id: req.params.id }, req.body, (err, status) => {
        if (err || !status) {
            error = true;
        }
        else {
            res.sendStatus(200);
        }
    }).catch(() => { error = true; });
    error ? res.sendStatus(404) : null;
}));
router.delete("/:id", isAuthenticated_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let error = null;
    yield Status_1.default.deleteOne({ _id: req.params.id }).catch(() => { error = true; });
    error ? res.sendStatus(404) : res.status(200).json({ message: "Deleted successful" });
}));
exports.default = router;
//# sourceMappingURL=statuses.js.map