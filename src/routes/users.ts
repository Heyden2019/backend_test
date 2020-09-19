import { myReq } from './../types';
import { registerValidator, userUpdateValidator, loginValidator } from './../util/validators/userValidator';
import mongoose from 'mongoose';
import express from 'express';
import User from '../models/User';
import argon2 from "argon2";
import isAuthenticated from "./../util/isAuthenticated"
import { validationResult } from 'express-validator';

const router = express.Router()

router.get("/", (req, res) => {
    User.find().select("-password")
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({message: "Server error"})
    })
})

//@ts-ignore
router.get("/me", isAuthenticated, (req: myReq, res) => {
    User.findById(req.session.userId)
    .then((user: any) => {
        user = user.toObject()
        delete user.password
        res.status(200).json(user)
    })
    .catch(err => {
        res.status(500).json({message: "Server error"})
    })
})

//@ts-ignore
router.get("/logout", isAuthenticated, async (req: myReq, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send({ message: 'Logout error' })
        }
        res.clearCookie(process.env.COOKIE_NAME as string)
        return res.status(200).json({ message: 'Logout success' })
    })
})

router.get("/:id", (req, res) => {
    User.findById(req.params.id).select("-password")
    .then(user => {
        user 
        ? res.status(200).json(user) 
        : res.status(404).json({ message: "404 not found" })
    })
    .catch(err => {
        res.status(404).json({ message: "404 not found" })
    })
})

//@ts-ignore
router.post("/register", registerValidator, async (req: myReq, res) => {
    delete req.body.image_id
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array({onlyFirstError: true})}) 
    }

    const hashedPassword = await argon2.hash(req.body.password)
    const user = await new User({
        ...req.body,
        password: hashedPassword,
        _id: new mongoose.Types.ObjectId()
    })

    user.save()
    .then((user: any) => {
        req.session.userId = user._id
        user = user.toObject()
        delete user.password
        res.status(201).json(user)
    })
    .catch(err => {
        res.status(500).send('Server Error')
    })
})

//@ts-ignore
router.post("/login", loginValidator, (req: myReq, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array({onlyFirstError: true})})
    }
    User.findOne({ email: req.body.email })
    .then((user: any) => {
        req.session.userId = user._id
        user = user.toObject()
        delete user.password
        res.status(200).json(user)
    })
    .catch(() => {
        res.status(500).json({message: "Server error"})
    })
})

//@ts-ignore
router.put("/", isAuthenticated, userUpdateValidator, async (req: myReq, res) => {
    delete req.body._id
    delete req.body.image_id

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array({onlyFirstError: true})})
    }

    if(req.body.password) {
        req.body.password = await argon2.hash(req.body.password)
    } 

    User.findOneAndUpdate({_id: req.session.userId}, req.body).select('-password')
    .then((user: any) => {
        user
        ? res.status(200).json(user)
        : res.status(500).json({message: "Server error"})
    })
    .catch(err => {
        res.status(500).json({message: "Server error"})
    })
})

//@ts-ignore
router.delete("/", isAuthenticated, async (req: myReq, res) => {
    await User.deleteOne({ _id: req.session.userId })
    .then(() => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({message: "Server error"})
            }
            res.clearCookie(process.env.COOKIE_NAME as string)
            return res.status(200).json({ message: 'You were deleted successful' })
        })
    })
    .catch(err => {
        res.status(500).json({message: "Server error"})
    })
})

export default router
