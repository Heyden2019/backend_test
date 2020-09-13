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
const Task_1 = __importDefault(require("../models/Task"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield Task_1.default.find().exec();
    console.log(tasks);
    res.status(200).json(tasks);
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield Task_1.default.findById(req.params.id).exec();
    res.status(200).json(task);
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = new Task_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        user_id: req.body.user_id,
        status_id: req.body.status_id,
        title: req.body.title,
        desc: req.body.desc
    });
    yield task.save();
    res.status(201).json(task);
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const task = yield Task_1.default.updateOne({ _id: req.params.id }, req.body);
    res.status(200).json(task);
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hrer");
    yield Task_1.default.deleteOne({ _id: req.params.id });
    res.sendStatus(200);
}));
exports.default = router;
//# sourceMappingURL=tasks copy.js.map