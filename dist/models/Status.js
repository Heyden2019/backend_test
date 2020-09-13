"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const statusSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    _id: mongoose_1.default.Types.ObjectId
});
exports.default = mongoose_1.default.model("Status", statusSchema);
//# sourceMappingURL=Status.js.map