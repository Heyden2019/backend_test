import { myReq } from './../types';
import mongoose from 'mongoose';
import express from 'express';
import Task from '../models/Task';
import isAuthenticated from "./../util/isAuthenticated"
import {taskCreateValidator, taskUpdateValidator} from './../util/validators/taskValidator';
import { validationResult } from 'express-validator';

const router = express.Router()

router.get("/", (req, res) => {
    Task.find(req.query.status_id ? { status_id: req.query.status_id } : {})
    .then(tasks => {
        res.status(200).json(tasks)
    })
    .catch(err => {
        res.status(404).json({ message: "404 not found" })
    })
})

router.get("/:id", (req, res) => {
    Task.findById(req.params.id)
    .then(task => {
        task
        ? res.status(200).json(task)
        : res.status(404).json({ message: "404 not found" })
    })
    .catch(err => {
        res.status(404).json({ message: "404 not found" })
    })
})

//@ts-ignore
router.post("/", isAuthenticated, taskCreateValidator, (req: myReq, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
       return res.status(400).json({errors: errors.array({onlyFirstError: true})})
   }

    const task = new Task({
        ...req.body,
        createdAt: Date.now(),
        _id: new mongoose.Types.ObjectId(),
        user_id: req.session.userId
    })
    task.save()
    .then(task => {
        res.status(201).json(task)
    })
    .catch(err => {
        res.status(500).json({message: "Server error"})
    })
})

//@ts-ignore
router.put("/:id", isAuthenticated, taskUpdateValidator, (req: myReq, res) => {
    delete req.body._id
    delete req.body.createdAt
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array({onlyFirstError: true})})
    }
    
    Task.findByIdAndUpdate(req.params.id, {
        ...req.body,
        user_id: req.session.userId
    })
    .then(task => {
        task
        ? res.status(200).json(task)
        : res.status(404).json({ message: "404 not found" })
    })
    .catch(err=> {
        res.status(404).json({ message: "404 not found" })
    })
})

//@ts-ignore
router.delete("/:id", isAuthenticated, (req: myReq, res) => {
    Task.findByIdAndDelete(req.params.id)
    .then(task => {
        task
        ? res.status(200).json({message: "Deleted successful"})
        : res.status(404).json({ message: "404 not found" })
    })
    .catch(err => {
        res.status(404).json({ message: "404 not found" })
    })
})

export default router
