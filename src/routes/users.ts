import { registerValidator } from './../util/validator';
import mongoose from 'mongoose';
import express from 'express';
import User from '../models/User';
import argon2 from "argon2";
import passport from 'passport';

const router = express.Router()

router.get("/", async (req, res) => {
    const users = await User.find().exec()
    res.status(200).json(users)
})

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).exec()
        res.status(200).json(user)
    } catch (err) {
        res.status(404).json(err.message)
    }
})

router.post("/register", async (req, res) => {
    const errors = await registerValidator(req.body)
    if(errors) res.status(400).json(errors)

    const hashedPassword = await argon2.hash(req.body.password)
    const user = new User({
        ...req.body,
        password: hashedPassword,
        _id: new mongoose.Types.ObjectId()
    })
    try {
        await user.save()
        console.log(user)
        // res.status(201).json(user)
    } catch (err) {
        console.log('err', err)
        res.status(400).json(err.message)
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
    //   successRedirect: '/dashboard',
    //   failureRedirect: '/users/login',
    //   failureFlash: true,
    }, () => {
        res.sendStatus(200)
    })(req, res, next);
  });

router.get('/logout', (req, res) => {
    req.logout()
    res.sendStatus(200)
});

router.put("/:id", async (req, res) => {
    try {
        const task = await User.updateOne({_id: req.params.id}, req.body)
        res.status(200).json(task)
    } catch (err) {
        res.status(400).json(err.message)
    }
})

router.delete("/:id", async (req, res) => {
    try {
        await User.deleteOne({_id: req.params.id})
    res.sendStatus(200)
    } catch (err) {
        res.status(404).json(err.message)
    }
})

export default router
