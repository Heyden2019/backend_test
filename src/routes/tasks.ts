import mongoose from 'mongoose';
import express from 'express';
import Task from '../models/Task';

const router = express.Router()

router.get("/", async (req, res) => {
    const tasks = await Task.find(req.query.status_id ? {status_id: req.query.status_id} : null).exec()
    res.status(200).json(tasks)
})

router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).exec()
        res.status(200).json(task)
    } catch (err) {
        res.status(404).json(err.message)
    }
})

router.post("/", async (req, res) => {
    const task = new Task({
        ...req.body,
        createdAt: Date.now(),
        _id: new mongoose.Types.ObjectId(),
    })
    try {
        await task.save()
        res.status(201).json(task)
    } catch (err) {
        res.status(400).json(err.message)
    }
})

router.put("/:id", async (req, res) => {
    try {
        const task = await Task.updateOne({_id: req.params.id}, req.body)
        res.status(200).json(task)
    } catch (err) {
        res.status(400).json(err.message)
    }
})

router.delete("/:id", async (req, res) => {
    try {
        await Task.deleteOne({_id: req.params.id})
        res.sendStatus(200)
    } catch (err) {
        res.status(404).json(err.message)
    }
})

export default router
