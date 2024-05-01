import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastname:{
        type: String,
        required: true,
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }, 
    age:{
        type: Number,
        required: true
    },
    genre:{
        type: String,
        required: true
    },
    events:{
       type: mongoose.ObjectId,
       ref: 'event',
       
    },
    role:{
       type: String,
       default: 'user'
    }   
  },
  {timestamps: true}
);

export default mongoose.model("user", userSchema);