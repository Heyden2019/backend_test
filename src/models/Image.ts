import mongoose from 'mongoose'

const Image = new mongoose.Schema({
  filename: {
    type: String
  },
  originalname: {
    type: String
  },
  user_id: {
      type:  mongoose.Types.ObjectId,
      required: true,
      ref: 'User'
  }
}, {timestamps: true})

export default mongoose.model('Image', Image)