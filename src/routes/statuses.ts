import mongoose from 'mongoose';
import express from 'express';
import Status from '../models/Status';
import isAuthenticated from "./../util/isAuthenticated"
import {statusCreateValidator, statusUpdateValidator} from "./../util/validators/statusValidator"
import { validationResult } from 'express-validator';
import { myReq } from 'src/types';

const router = express.Router()

router.get("/", (req, res) => {
    Status.find()
    .then(statuses => {
        res.status(200).json(statuses)
    })
    .catch(err => {
        res.status(500).json({message: "Server error"})
    })
})

router.get("/:id", (req, res) => {
    Status.findById(req.params.id)
    .then(status => {
        status
        ? res.status(200).json(status)
        : res.status(404).json({ message: "404 not found" })
    })
    .catch(err => {
        res.status(404).json({ message: "404 not found" })
    })
})

//@ts-ignore
router.post("/", isAuthenticated, statusCreateValidator, (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array({onlyFirstError: true})})
    }

    const status = new Status({
        ...req.body,
        _id: new mongoose.Types.ObjectId(),
    })

    status.save()
    .then(status => {
        res.status(201).json(status)
    })
    .catch(err => {
        res.status(500).json({message: "Server error"})
    })
})

//@ts-ignore
router.put("/:id", isAuthenticated, statusUpdateValidator, (req: myReq, res) => {
    delete req.body._id
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array({onlyFirstError: true})})
    }
    
    Status.findByIdAndUpdate(req.params.id, req.body)
    .then((status) => {
        status
        ? res.status(200).json(status)
        : res.status(404).json({ message: "404 not found" })
    })
    .catch(() => {
        res.status(404).json({ message: "404 not found" })
    })
})

//@ts-ignore
router.delete("/:id", isAuthenticated, (req, res) => {
    Status.findByIdAndDelete(req.params.id)
    .then(status => {
        status
        ? res.status(200).json({ message: "Deleted successful" })
        : res.status(404).json({ message: "404 not found" })
    })
    .catch(() => {
        res.status(404).json({ message: "404 not found" })
    })
})

export default router
