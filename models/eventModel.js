import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  place: {
    type: mongoose.ObjectId,
    ref: 'place',
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  photo:{
    data: Buffer,
    contentType: String
  },
  description: {
    type: String,
    required: true,
  },
  attendees:{
    type: mongoose.ObjectId,
    ref: 'user',
    required: true
  },
  minimumAge:{
    type: Number,
    required: true
  },
  organizer:{
    type: mongoose.ObjectId,
    ref: 'user',
    required: true
  },


});

export default mongoose.model("event", eventSchema);