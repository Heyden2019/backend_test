import { myReq } from './../types';
import express from 'express';
import path from "path"
import isAuthenticated from "./../util/isAuthenticated"
import Image from "./../models/Image"
import fs from "fs"
import multer from 'multer';

const UPLOAD_PATH = path.resolve(__dirname, '../images')
const upload = multer({
  dest: UPLOAD_PATH ,
  limits: {fileSize: 1000000, files: 1}
})

const router = express.Router()

// upload image
//@ts-ignore
router.post('/', isAuthenticated, upload.single('Image'), async (req: myReq, res, next) => {
    const prevImage: any = await Image.findOne({ user_id: req.session.userId }, (err): any => { if (err) return res.sendStatus(404) })
    if (prevImage) {
        prevImage.filename = req.file.filename
        prevImage.originalname = req.file.originalname
        await prevImage.save()
        return res.json({message: "Upload successful"})
    } else {
        const image = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            user_id: req.session.userId
        }

        await Image.create(image, (err: any, result: any) => {
            if (err) return res.sendStatus(404)
            return res.json(result)
        })
    }
})

// get image with id
//@ts-ignore
router.get('/', isAuthenticated, (req: myReq, res, next) => {
    Image.findOne({ user_id: req.session.userId }, (err, image: any): any => {
        if (err || !image) return res.sendStatus(404)
        fs.createReadStream(path.resolve(UPLOAD_PATH, image.filename)).pipe(res)
    })
})

export default router