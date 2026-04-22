import Payment from "../models/Payment.js";

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ patient: req.user._id })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "full_name" },
      })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const initiatePayment = async (req, res) => {
  try {
    const { doctor, appointment, amount, gateway } = req.body;
    const tx_ref = `RPHMS-${Date.now()}`;
    const payment = await Payment.create({
      patient: req.user._id,
      doctor,
      appointment,
      amount,
      gateway,
      tx_ref,
    });
    res
      .status(201)
      .json({ payment, tx_ref, message: `${gateway} payment initiated` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
