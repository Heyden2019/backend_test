import { myReq } from './../types';
import { registerValidator, userUpdateValidator } from './../util/validator';
import mongoose from 'mongoose';
import express from 'express';
import User from '../models/User';
import argon2 from "argon2";
import isAuthenticated from "./../util/isAuthenticated"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-password").exec()
        res.status(200).json(users)
    } catch (err) {
        res.sendStatus(500)
    }
})

//@ts-ignore
router.get("/logout", isAuthenticated, async (req: myReq, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send({ message: 'Logout error' })
        }
        res.clearCookie('qid')
        return res.status(200).json({ message: 'Logout success' })
    })
})

router.get("/:id", async (req, res) => {
    await User.findById(req.params.id, (err, user) => {
        if (err || !user) {
            res.status(404).json({ message: "404 not found" })
        } else {
            res.status(200).json(user)
        }
    }).select("-password")
})

//@ts-ignore
router.post("/register", async (req: myReq, res) => {
    const error = await registerValidator(req.body)
    if (error) {
        res.status(400).json(error)
        return;
    }

    console.log(req.body.password)

    const hashedPassword = await argon2.hash(req.body.password)
    const user = new User({
        ...req.body,
        password: hashedPassword,
        _id: new mongoose.Types.ObjectId()
    })
    try {
        await user.save()
        req.session.userId = user._id
        res.status(201).json(user)
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

//@ts-ignore
router.post("/login", async (req: myReq, res) => {
    if(!req.body.email || !req.body.password) {
        res.status(400).json({ message: "All fields are required" })
        return;
    }

    let error
    const user = await User.findOne({ email: req.body.email }, (err, user) => {
        if (err || !user) {
            error = { message: "Email incorrect" }
        }
    }).select("+password") as any

    if (error) {
        res.status(400).json(error)
        return;
    }

    //@ts-ignore
    const valid = await argon2.verify(user.password, req.body.password.toString())
    if (!valid) {
        res.status(400).json({ message: "Password incorrect" })
        return;
    } else {
        user.password = null
        req.session.userId = user._id
        res.status(200).json(user)
    }
})

//@ts-ignore
router.put("/", isAuthenticated, async (req: myReq, res) => {
    delete req.body._id
    let error = userUpdateValidator(req.body)
    if(error) {
        res.status(400).json(error)
        return;
    }
    let body = req.body
    if(req.body.password) {
        if (req.body.password.toString().length < 6) {
            res.status(400).json({message: "Password mush be at least 6 characters"})
            return;
        }
        body.password = await argon2.hash(req.body.password.toString())
    } 
    const user = await User.updateOne({ _id: req.session.userId }, body)
    res.status(200).json(user)
})

//@ts-ignore
router.delete("/", isAuthenticated, async (req: myReq, res) => {
    await User.deleteOne({ _id: req.session.userId }, error => {
        if (error) {
            res.send({ message: 'error' })
        } else {
            req.session.destroy(err => {
                if (err) {
                    return res.send({ message: 'error' })
                }
                res.clearCookie('qid')
                return res.status(200).json({ message: 'You were deleted successful' })
            })
        }
    })
})

export default router
