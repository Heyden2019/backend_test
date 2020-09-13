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
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const statuses = yield Status_1.default.find().exec();
    res.status(200).json(statuses);
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = yield Status_1.default.findById(req.params.id).exec();
        res.status(200).json(status);
    }
    catch (err) {
        res.status(404).json(err.message);
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = new Status_1.default(Object.assign(Object.assign({}, req.body), { _id: new mongoose_1.default.Types.ObjectId() }));
    try {
        yield status.save();
        res.status(201).json(status);
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = yield Status_1.default.updateOne({ _id: req.params.id }, req.body);
        res.status(200).json(status);
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Status_1.default.deleteOne({ _id: req.params.id });
        res.sendStatus(200);
    }
    catch (err) {
        res.status(404).json(err.message);
    }
}));
exports.default = router;
//# sourceMappingURL=statuses.js.map