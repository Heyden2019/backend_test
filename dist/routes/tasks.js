"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const Task_1 = __importDefault(require("../models/Task"));
const isAuthenticated_1 = __importDefault(require("./../util/isAuthenticated"));
const taskValidator_1 = require("./../util/validators/taskValidator");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    Task_1.default.find(req.query.status_id ? { status_id: req.query.status_id } : {})
        .then(tasks => {
        res.status(200).json(tasks);
    })
        .catch(err => {
        res.status(404).json({ message: "404 not found" });
    });
});
router.get("/:id", (req, res) => {
    Task_1.default.findById(req.params.id)
        .then(task => {
        task
            ? res.status(200).json(task)
            : res.status(404).json({ message: "404 not found" });
    })
        .catch(err => {
        res.status(404).json({ message: "404 not found" });
    });
});
router.post("/", isAuthenticated_1.default, taskValidator_1.taskCreateValidator, (req, res) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    const task = new Task_1.default(Object.assign(Object.assign({}, req.body), { createdAt: Date.now(), _id: new mongoose_1.default.Types.ObjectId(), user_id: req.session.userId }));
    task.save()
        .then(task => {
        res.status(201).json(task);
    })
        .catch(err => {
        res.status(500).json({ message: "Server error" });
    });
});
router.put("/:id", isAuthenticated_1.default, taskValidator_1.taskUpdateValidator, (req, res) => {
    delete req.body._id;
    delete req.body.createdAt;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    Task_1.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { user_id: req.session.userId }))
        .then(task => {
        task
            ? res.status(200).json(task)
            : res.status(404).json({ message: "404 not found" });
    })
        .catch(err => {
        res.status(404).json({ message: "404 not found" });
    });
});
router.delete("/:id", isAuthenticated_1.default, (req, res) => {
    Task_1.default.findByIdAndDelete(req.params.id)
        .then(task => {
        task
            ? res.status(200).json({ message: "Deleted successful" })
            : res.status(404).json({ message: "404 not found" });
    })
        .catch(err => {
        res.status(404).json({ message: "404 not found" });
    });
});
exports.default = router;
//# sourceMappingURL=tasks.js.map