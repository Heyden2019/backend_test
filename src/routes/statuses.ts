import mongoose from 'mongoose';
import express from 'express';
import Status from '../models/Status';
import isAuthenticated from "./../util/isAuthenticated"
import {statusCreateValidator} from "./../util/validator"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const statuses = await Status.find().exec()
        res.status(200).json(statuses)
    } catch (err) {
        res.sendStatus(500)
    }
})

router.get("/:id", async (req, res) => {
    let error = null as any
    await Status.findById(req.params.id, (err, status) => {
        if (err || !status) {
            error = true
        } else {
            res.status(200).json(status)
        }
    }).catch(() => {error = true})
    error ? res.sendStatus(404) : null
})

//@ts-ignore
router.post("/", isAuthenticated, async (req, res) => {
    const {title, desc} = await statusCreateValidator(req.body)
   
    const status = new Status({
        ...req.body,
        _id: new mongoose.Types.ObjectId(),
    })
    try {
        await status.save()
        res.status(201).json(status)
    } catch (err) {
        res.sendStatus(400)
    }
})

//@ts-ignore
router.put("/:id", isAuthenticated, async (req, res) => {
    delete req.body._id
    const {title, desc} = req.body
    if ((title && typeof title !== "string" )|| (desc && typeof desc !== 'string')) {
        res.status(400).json({message: "Title/desc must be string type"})
        return;
    }
    if ( (typeof title === "string" && title.length < 1) || (typeof desc === "string" && desc.length < 1)) {
        res.status(400).json({message: "Title/desc must be at least 1 character"})
        return;
    }
    let error = null as any
    await Status.updateOne({_id: req.params.id}, req.body, (err, status) => {
        if (err || !status) {
            error = true
        } else {
            res.sendStatus(200)
        }
    }).catch(() => {error = true})
    error ? res.sendStatus(404) : null
})

//@ts-ignore
router.delete("/:id", isAuthenticated, async (req, res) => {
    let error = null as any
    await Status.deleteOne({_id: req.params.id}).catch(() => { error = true})
    error ? res.sendStatus(404) : res.status(200).json({message: "Deleted successful"})
})

export default router
