import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
  votes: { type: Number, default: 0 }
});

const PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [OptionSchema],
  createdAt: { type: Date, default: Date.now },
  duration: { type: Number, default: 60 }, 
  isActive: { type: Boolean, default: true }
});

export default mongoose.model('Poll', PollSchema);
