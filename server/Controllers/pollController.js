import Poll from '../Models/Poll.js';

export const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ isActive: false }).sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

