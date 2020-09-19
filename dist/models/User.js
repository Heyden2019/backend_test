"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    _id: mongoose_1.default.Types.ObjectId,
    image_id: {
        type: mongoose_1.default.Types.ObjectId,
        default: null,
        ref: "Image"
    }
});
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=User.js.map