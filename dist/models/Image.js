"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Image = new mongoose_1.default.Schema({
    filename: {
        type: String
    },
    originalname: {
        type: String
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Image', Image);
//# sourceMappingURL=Image.js.map