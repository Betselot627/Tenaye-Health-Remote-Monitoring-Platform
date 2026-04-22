import Tracker from "../models/Tracker.js";

export const addTracker = async (req, res) => {
  try {
    const tracker = await Tracker.create({
      ...req.body,
      patient: req.user._id,
    });
    res.status(201).json(tracker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTrackers = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { patient: req.user._id };
    if (type) filter.tracker_type = type;
    const trackers = await Tracker.find(filter).sort({ recorded_at: -1 });
    res.json(trackers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTracker = async (req, res) => {
  try {
    await Tracker.findOneAndDelete({
      _id: req.params.id,
      patient: req.user._id,
    });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
