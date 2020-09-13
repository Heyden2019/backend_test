import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, select: false, required: true},
    _id: mongoose.Types.ObjectId
})

export default mongoose.model("User", userSchema)