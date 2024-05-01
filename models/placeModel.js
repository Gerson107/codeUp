import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  photo:{
    data: Buffer,
    contentType: String
  },
  date:{
    type: mongoose.ObjectId,
    ref: 'event',
    required: true
  },
  occupancy: {
    type: Number,
    required: true
  },
});

export default mongoose.model("place", placeSchema);
