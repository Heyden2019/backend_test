import { myReq } from './../types';
import express from 'express';
import path from "path"
import isAuthenticated from "./../util/isAuthenticated"
import Image from "./../models/Image"
import fs from "fs"
import multer from 'multer';
import User from '../models/User';

const UPLOAD_PATH = path.resolve(__dirname, '../images')
const upload = multer({
  dest: UPLOAD_PATH ,
  limits: {fileSize: 1024*1024, files: 1},
  fileFilter: (req, file, cb) => {
     if (['.jpg', '.jpeg', '.png'].includes(path.extname(file.originalname))) {
         return cb(null, true)
     }
     return cb(new Error("Wrong format"))
  }
}).single('Image')

const router = express.Router()

//@ts-ignore
router.post('/', isAuthenticated, async (req: myReq, res, next) => {
    upload(req, res, (err: any): any => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json(err)
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json(err)
            }
            return res.status(400).json({ message: err.message });
        }
        if(!req.file) {
            return res.status(400).json({ message: "File is required" });
        }

        const image = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            user_id: req.session.userId
        }

        let prevImg: any

        Image.findOne({ user_id: req.session.userId })
            .then(img => {
                prevImg = img || null
            })
            .catch(() => { })

        Image.create(image)
            .then(async (img) => {
                if (!img) {
                    res.status(500).json({ message: "Server error" })
                } else {
                    if (prevImg) {
                        await fs.unlink(path.resolve(UPLOAD_PATH, prevImg.filename), () => { })
                        await prevImg.remove().catch(() => { })
                    }
                    User.findByIdAndUpdate(req.session.userId, { image_id: img._id })
                        .then(user => {
                            user
                                ? res.status(200).json(img)
                                : res.status(500).json({ message: "Server error" })
                        })
                }
            })
            .catch(() => res.status(500).json({ message: "Server error" }))
    })
})

//@ts-ignore
router.get('/:id', isAuthenticated, (req: myReq, res, next) => {
    Image.findById(req.params.id)
    .then((img: any) => {
        img
        ? fs.createReadStream(path.resolve(UPLOAD_PATH, img.filename)).pipe(res)
        : res.status(404).json({ message: "404 not found" })
    })
    .catch(() => {
        res.status(404).json({ message: "404 not found" })
    })
})

export default router