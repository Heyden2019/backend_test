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
const isAuthenticated_1 = __importDefault(require("./../util/isAuthenticated"));
const validator_1 = require("./../util/validator");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Task_1.default.find(req.query.status_id ? { status_id: req.query.status_id } : null, (err, tasks) => {
        if (err) {
            res.sendStatus(500).json({ message: "error" });
        }
        else {
            res.status(200).json(tasks);
        }
    });
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Task_1.default.findById(req.params.id, (err, task) => {
        if (err || !task) {
            res.sendStatus(404);
        }
        else {
            res.status(200).json(task);
        }
    });
}));
router.post("/", isAuthenticated_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = yield validator_1.taskCreateValidator(req.body);
    if (error) {
        res.status(400).json(error);
        return;
    }
    const task = new Task_1.default(Object.assign(Object.assign({}, req.body), { createdAt: Date.now(), _id: new mongoose_1.default.Types.ObjectId(), user_id: req.session.userId }));
    try {
        yield task.save();
        res.status(201).json(task);
    }
    catch (err) {
        res.sendStatus(400);
    }
}));
router.put("/:id", isAuthenticated_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    delete req.body._id;
    let error = yield validator_1.taskUpdateValidator(req.body);
    if (error) {
        res.status(400).json(error);
        return;
    }
    yield Task_1.default.updateOne({ _id: req.params.id }, Object.assign(Object.assign({}, req.body), { user_id: req.session.userId })).then(() => { res.sendStatus(200); })
        .catch(() => { res.sendStatus(404); });
}));
router.delete("/:id", isAuthenticated_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let error = null;
    yield Task_1.default.deleteOne({ _id: req.params.id }, (err) => {
        err ? error = true : null;
    }).catch(() => {
        error = true;
    });
    error ? res.status(404) : res.status(200).json({ message: "Deleted successful" });
}));
exports.default = router;
//# sourceMappingURL=tasks.js.map