// models/Email.js
import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Email || mongoose.model('Email', EmailSchema);
