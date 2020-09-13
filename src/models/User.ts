import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    _id: mongoose.Types.ObjectId
})

export default mongoose.model("User", userSchema)