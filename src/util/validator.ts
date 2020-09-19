import User from "./../models/User"
import {taskValidatorPropsType, statusValidatorPropsType} from "./../types"
import Status from "./../models/Status"
import { check } from "express-validator"
import argon2 from "argon2";

let _password: any

export const registerValidator = [
    check('firstName')
        .trim().notEmpty().withMessage('Required')
        .matches(/^([a-zA-Z]+)$/m).withMessage('Only letters')
        .isLength({max: 15}).withMessage('Max length is 15'),
    check('lastName')
        .trim().notEmpty().withMessage('Required')
        .matches(/^([a-zA-Z]+)$/m).withMessage('Only letters')
        .isLength({max: 15}).withMessage('Max length is 15'),
    check('password')
        .trim().notEmpty().withMessage('Required')
        .isLength({min: 6}).withMessage('Min password length - 6')
        .isLength({max: 20}).withMessage('Max password length - 20'),
    check('email')
        .trim().notEmpty().withMessage('Required')
        .matches(/^([a-z0-9]+\.?[a-z0-9]+[@][a-z]{1,10}\.[a-z]{2,4})$/i).withMessage('Invalid')
        .isLength({min: 6}).withMessage('Min email length - 6')
        .isLength({max: 50}).withMessage('Max email length - 50')
        .normalizeEmail()
        .custom(email => {
            return User.findOne({email}).then(user => {
                if (user) {
                  return Promise.reject('Email already exist');
                }
                return null
            })
        }).withMessage('Email already exist'),
]

export const loginValidator = [
    check('email')
        .trim().notEmpty().withMessage('Required')
        .matches(/^([a-z0-9]+\.?[a-z0-9]+[@][a-z]{1,10}\.[a-z]{2,4})$/i).withMessage('Invalid')
        .normalizeEmail()
        .custom(email => {
            return User.findOne({email}).select("password").then(async (user: any) => {
                if (user) {
                    _password = user.password
                    return Promise.resolve()
                }
                return Promise.reject('Email is not exist')
            })
        }).withMessage('Email already exist'),
    check('password')
        .trim().notEmpty().withMessage('Required')
        .custom(async (pwd) => {
            if(!_password) return Promise.resolve()
            const valid = await argon2.verify(_password, pwd)
            if (!valid) {
                return Promise.reject('Password incorrect')
            } else {
                return Promise.resolve()
            }
        }),
]


export const taskCreateValidator = async ({title, status_id, desc}: taskValidatorPropsType) => {
    
    if (!title || !status_id || !desc ) {
        return {message: "Enter all fields"}
    }
    if (typeof title !== 'string' || typeof status_id !== 'string' || typeof desc !== 'string' ) {
        return {message: "All fields must be 'string'"}
    }
    if(title.length < 6 || desc.length < 6) {
        return {message: "Title and Desc must be at least 6 characters"}
    }
   
    let error = null as any
    await Status.findById(status_id, (err, status) => {
        if(err || !status) {
            error = {message: "Invalid status_id"}
        }
    }).catch(e=>  error = {message: "Invalid status_id"})
    return error
}

export const userUpdateValidator = [
    check('firstName').optional()
        .trim().notEmpty().withMessage('Required')
        .matches(/^([a-zA-Z]+)$/m).withMessage('Only letters')
        .isLength({max: 15}).withMessage('Max length is 15'),
    check('lastName').optional()
        .trim().notEmpty().withMessage('Required')
        .matches(/^([a-zA-Z]+)$/m).withMessage('Only letters')
        .isLength({max: 15}).withMessage('Max length is 15'),
    check('email').optional()
        .trim().notEmpty().withMessage('Required')
        .matches(/^([a-z0-9]+\.?[a-z0-9]+[@][a-z]{1,10}\.[a-z]{2,4})$/i).withMessage('Invalid')
        .isLength({min: 6}).withMessage('Min email length - 6')
        .isLength({max: 50}).withMessage('Max email length - 50')
        .normalizeEmail()
        .custom(email => {
            return User.findOne({email}).then(user => {
                if (user) {
                  return Promise.reject('Email already exist');
                }
                return null
            })
        }).withMessage('Email already exist'),
    check('password').optional()
        .trim().notEmpty().withMessage('Required')
        .isLength({min: 6}).withMessage('Min password length - 6')
        .isLength({max: 20}).withMessage('Max password length - 20'),
]

export const taskUpdateValidator = async ({title, status_id, desc}: taskValidatorPropsType) => {
    
    if(typeof title !== 'undefined' && (typeof title !== 'string' || title.length < 6)) {
        return {message: "Invalid title"}
        
    }
    if(typeof desc !== 'undefined' && (typeof desc !== 'string' || desc.length < 6)) {
        return {message: "Invalid desc"}
        
    }

    let error = null as any
    if(status_id) {
        await Status.findOne({_id: status_id}, (err, status) => {
            if(!status || err) {
                error = {message: "Invalid status_id"}
            }
        }).catch(() => {error = {message: "Invalid status_id"}})
    }
    return error
}

export const statusCreateValidator = async ({desc, title}: statusValidatorPropsType) => {
    
    if (!title ||  !desc ) {
        return {message: "Enter all fields"}
    }
    if (typeof title !== 'string' || typeof desc !== 'string' ) {
        return {message: "All fields must be 'string'"}
    }
    if(title.length < 6 || desc.length < 6) {
        return {message: "Title and Desc must be at least 6 characters"}
    }
   
    return null
}

export const statusUpdateValidator = async ({desc, title}: statusValidatorPropsType) => {
    
    if(typeof title !== 'undefined' && (typeof title !== 'string' || title.length < 6)) {
        return {message: "Invalid title (must be string, at least 6char)"}
        
    }
    if(typeof desc !== 'undefined' && (typeof desc !== 'string' || desc.length < 6)) {
        return {message: "Invalid desc (must be string, at least 6char)"}
        
    }

    return null
}



const errorCreator = () => {


    return {
        errors:
    }
}