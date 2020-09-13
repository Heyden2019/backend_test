import mongoose from 'mongoose'

const Image = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  },
  user_id: {
      type: String,
      required: true
  }
}, {timestamps: true})

export default mongoose.model('Image', Image)