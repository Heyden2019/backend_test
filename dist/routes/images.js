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
const User_1 = __importDefault(require("../models/User"));
const UPLOAD_PATH = path_1.default.resolve(__dirname, '../images');
const upload = multer_1.default({
    dest: UPLOAD_PATH,
    limits: { fileSize: 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => {
        if (['.jpg', '.jpeg', '.png'].includes(path_1.default.extname(file.originalname))) {
            return cb(null, true);
        }
        return cb(new Error("Wrong format"));
    }
}).single('Image');
const router = express_1.default.Router();
router.post('/', isAuthenticated_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json(err);
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json(err);
            }
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }
        const image = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            user_id: req.session.userId
        };
        let prevImg;
        Image_1.default.findOne({ user_id: req.session.userId })
            .then(img => {
            prevImg = img || null;
        })
            .catch(() => { });
        Image_1.default.create(image)
            .then((img) => __awaiter(void 0, void 0, void 0, function* () {
            if (!img) {
                res.status(500).json({ message: "Server error" });
            }
            else {
                if (prevImg) {
                    yield fs_1.default.unlink(path_1.default.resolve(UPLOAD_PATH, prevImg.filename), () => { });
                    yield prevImg.remove().catch(() => { });
                }
                User_1.default.findByIdAndUpdate(req.session.userId, { image_id: img._id })
                    .then(user => {
                    user
                        ? res.status(200).json(img)
                        : res.status(500).json({ message: "Server error" });
                });
            }
        }))
            .catch(() => res.status(500).json({ message: "Server error" }));
    });
}));
router.get('/:id', isAuthenticated_1.default, (req, res, next) => {
    Image_1.default.findById(req.params.id)
        .then((img) => {
        img
            ? fs_1.default.createReadStream(path_1.default.resolve(UPLOAD_PATH, img.filename)).pipe(res)
            : res.status(404).json({ message: "404 not found" });
    })
        .catch(() => {
        res.status(404).json({ message: "404 not found" });
    });
});
exports.default = router;
//# sourceMappingURL=images.js.map