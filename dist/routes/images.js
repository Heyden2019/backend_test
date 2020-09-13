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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const isAuthenticated_1 = __importDefault(require("./../util/isAuthenticated"));
const Image_1 = __importDefault(require("./../models/Image"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const UPLOAD_PATH = path_1.default.resolve(__dirname, '../images');
const upload = multer_1.default({
    dest: UPLOAD_PATH,
    limits: { fileSize: 1000000, files: 1 }
});
const router = express_1.default.Router();
router.post('/', isAuthenticated_1.default, upload.single('Image'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prevImage = yield Image_1.default.findOne({ user_id: req.session.userId }, (err) => { if (err)
        return res.sendStatus(404); });
    if (prevImage) {
        prevImage.filename = req.file.filename;
        prevImage.originalname = req.file.originalname;
        yield prevImage.save();
        return res.json({ message: "Upload successful" });
    }
    else {
        const image = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            user_id: req.session.userId
        };
        yield Image_1.default.create(image, (err, result) => {
            if (err)
                return res.sendStatus(404);
            return res.json(result);
        });
    }
}));
router.get('/', isAuthenticated_1.default, (req, res, next) => {
    Image_1.default.findOne({ user_id: req.session.userId }, (err, image) => {
        if (err || !image)
            return res.sendStatus(404);
        fs_1.default.createReadStream(path_1.default.resolve(UPLOAD_PATH, image.filename)).pipe(res);
    });
});
exports.default = router;
//# sourceMappingURL=images.js.map