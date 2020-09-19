import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    _id: mongoose.Types.ObjectId,
    image_id: {
        type: mongoose.Types.ObjectId,
        default: null,
        ref: "Image"
    }
})

export default mongoose.model("User", userSchema)