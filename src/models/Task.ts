import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    user_id: {
        type:  mongoose.Types.ObjectId,
        ref: 'User',
        required: true
        },
    status_id: {
        type:  mongoose.Types.ObjectId,
        ref: 'Status',
        required: true
        },
    title: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    desc: {type: String, required: true}
})

export default mongoose.model("Task", taskSchema)