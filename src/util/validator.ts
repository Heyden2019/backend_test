import User from "./../models/User"
import {taskValidatorPropsType, userValidatorPropsType, statusValidatorPropsType} from "./../types"
import Status from "./../models/Status"

export const registerValidator = async ({firstName, lastName, email, password}: userValidatorPropsType) => {

    if (!firstName || !lastName || !email || !password) {
        return {message: "Enter all fields"}
    }
    if (typeof password !== 'string') {
        return {message: "Password mush be string"}
    }
    if (password.length < 6) {
        return {message: "Password mush be at least 6 characters"}
    }
    if(!email.includes("@")) {
       return {message: "Incorrect email"}
    }
    let error = null as any
    await User.findOne({email}, (err, user) => {
        if (err || user) {
            error = {message: "Email already exist"}
        }
    })
    return error
}

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

export const userUpdateValidator = ({firstName, lastName, email}: userValidatorPropsType) => {
    
    if(typeof firstName !== 'undefined' && (typeof firstName !== 'string' || firstName.length < 1)) {
        return {message: "Invalid firstName"}
        
    }
    if(typeof lastName !== 'undefined' && (typeof firstName !== 'string' || lastName.length < 1)) {
        return {message: "Invalid lastName"}
        
    }
    if(typeof email !== 'undefined' && (typeof email !== 'string' || !email.includes('@'))) {
        return {message: "Invalid email"}
        
    }
    return null
}

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