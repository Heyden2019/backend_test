"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const Status_1 = __importDefault(require("../models/Status"));
const isAuthenticated_1 = __importDefault(require("./../util/isAuthenticated"));
const statusValidator_1 = require("./../util/validators/statusValidator");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    Status_1.default.find()
        .then(statuses => {
        res.status(200).json(statuses);
    })
        .catch(err => {
        res.status(500).json({ message: "Server error" });
    });
});
router.get("/:id", (req, res) => {
    Status_1.default.findById(req.params.id)
        .then(status => {
        status
            ? res.status(200).json(status)
            : res.status(404).json({ message: "404 not found" });
    })
        .catch(err => {
        res.status(404).json({ message: "404 not found" });
    });
});
router.post("/", isAuthenticated_1.default, statusValidator_1.statusCreateValidator, (req, res) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    const status = new Status_1.default(Object.assign(Object.assign({}, req.body), { _id: new mongoose_1.default.Types.ObjectId() }));
    status.save()
        .then(status => {
        res.status(201).json(status);
    })
        .catch(err => {
        res.status(500).json({ message: "Server error" });
    });
});
router.put("/:id", isAuthenticated_1.default, statusValidator_1.statusUpdateValidator, (req, res) => {
    delete req.body._id;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    Status_1.default.findByIdAndUpdate(req.params.id, req.body)
        .then((status) => {
        status
            ? res.status(200).json(status)
            : res.status(404).json({ message: "404 not found" });
    })
        .catch(() => {
        res.status(404).json({ message: "404 not found" });
    });
});
router.delete("/:id", isAuthenticated_1.default, (req, res) => {
    Status_1.default.findByIdAndDelete(req.params.id)
        .then(status => {
        status
            ? res.status(200).json({ message: "Deleted successful" })
            : res.status(404).json({ message: "404 not found" });
    })
        .catch(() => {
        res.status(404).json({ message: "404 not found" });
    });
});
exports.default = router;
//# sourceMappingURL=statuses.js.map