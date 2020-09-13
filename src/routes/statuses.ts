import mongoose from 'mongoose';
import express from 'express';
import Status from '../models/Status';

const router = express.Router()

router.get("/", async (req, res) => {
    const statuses = await Status.find().exec()
    res.status(200).json(statuses)
})

router.get("/:id", async (req, res) => {
    try {
        const status = await Status.findById(req.params.id).exec()
        res.status(200).json(status)
    } catch (err) {
        res.status(404).json(err.message)
    }
})

router.post("/", async (req, res) => {
    const status = new Status({
        ...req.body,
        _id: new mongoose.Types.ObjectId(),
    })
    try {
        await status.save()
        res.status(201).json(status)
    } catch (err) {
        res.status(400).json(err.message)
    }
})

router.put("/:id", async (req, res) => {
    try {
        const status = await Status.updateOne({_id: req.params.id}, req.body)
        res.status(200).json(status)
    } catch (err) {
        res.status(400).json(err.message)
    }
})

router.delete("/:id", async (req, res) => {
    try {
        await Status.deleteOne({_id: req.params.id})
        res.sendStatus(200)
    } catch (err) {
        res.status(404).json(err.message)
    }
})

export default router
