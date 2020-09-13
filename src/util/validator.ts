import User from "./../models/User"

type registerValidatorPropsType = {
    firstName: string,
    lastName: string, 
    email: string, 
    password: string
}

export const registerValidator = async ({firstName, lastName, email, password}: registerValidatorPropsType) => {

    const errors = []
    if (!firstName || !lastName || !email || !password) {
        errors.push({message: "Enter all fields"})
    }
    if (password.length < 6) {
        errors.push({message: "Password mush be at least 6 characters"})
    }
    if(!email.includes("@")) {
        errors.push({message: "Incorrect email"})
    }
    let user = await User.findOne({email})
    if (user) {
        errors.push({message: "Email already exist"})
    }
    return errors
}