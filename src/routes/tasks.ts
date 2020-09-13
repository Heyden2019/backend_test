import { myReq } from './../types';
import mongoose from 'mongoose';
import express from 'express';
import Task from '../models/Task';
import isAuthenticated from "./../util/isAuthenticated"
import {taskCreateValidator, taskUpdateValidator} from './../util/validator';

const router = express.Router()

router.get("/", async (req, res) => {
    await Task.find(req.query.status_id ? { status_id: req.query.status_id } : null, (err, tasks) => {
        if(err) {
            res.sendStatus(500).json({message: "error"})
        } else {
            res.status(200).json(tasks)
        }
    })
})

router.get("/:id", async (req, res) => {
    await Task.findById(req.params.id, (err, task) => {
        if (err || !task) {
            res.sendStatus(404)
        } else {
            res.status(200).json(task)
        }
    }) 
})

//@ts-ignore
router.post("/", isAuthenticated, async (req: myReq, res) => {
   const error = await taskCreateValidator(req.body)
   if (error) {
       res.status(400).json(error)
       return;
   }
    const task = new Task({
        ...req.body,
        createdAt: Date.now(),
        _id: new mongoose.Types.ObjectId(),
        user_id: req.session.userId
    })
    try {
        await task.save()
        res.status(201).json(task)
    } catch (err) {
        res.sendStatus(400)
    }
})

//@ts-ignore
router.put("/:id", isAuthenticated, async (req: myReq, res) => {
    delete req.body._id
    let error = await taskUpdateValidator(req.body)
    
    if (error) {
        res.status(400).json(error)
        return;
    }
    await Task.updateOne({ _id: req.params.id }, {
        ...req.body,
        user_id: req.session.userId
    }).then(() => {res.sendStatus(200)})
    .catch(() => {res.sendStatus(404)})
})

//@ts-ignore
router.delete("/:id", isAuthenticated, async (req: myReq, res) => {
    let error = null as any
    await Task.deleteOne({ _id: req.params.id }, (err) => {
        err ? error = true : null
    }).catch(() => {
        error = true
    })
    error ? res.status(404) : res.status(200).json({message: "Deleted successful"})
})

export default router
