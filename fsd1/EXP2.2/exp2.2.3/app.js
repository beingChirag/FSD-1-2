const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/bank");

// Schemas
const accountSchema = new mongoose.Schema({
  name: String,
  balance: Number
});

const transactionSchema = new mongoose.Schema({
  from: String,
  to: String,
  amount: Number,
  status: String,
  timestamp: { type: Date, default: Date.now }
});

const Account = mongoose.model("Account", accountSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);

/* ---------------- TRANSFER API ---------------- */
app.post("/api/transfer", async (req, res) => {
  const { from, to, amount } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await Account.findOne({ name: from }).session(session);
    const receiver = await Account.findOne({ name: to }).session(session);

    if (!sender || !receiver) {
      throw new Error("Account not found");
    }

    if (sender.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Deduct & Add
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save({ session });
    await receiver.save({ session });

    // Log transaction
    await Transaction.create([{
      from,
      to,
      amount,
      status: "success"
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Transfer successful" });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    // Log failed transaction
    await Transaction.create({
      from,
      to,
      amount,
      status: "failed"
    });

    res.status(400).json({ error: err.message });
  }
});

/* ---------------- CHECK ACCOUNTS ---------------- */
app.get("/api/accounts", async (req, res) => {
  const accounts = await Account.find();
  res.json(accounts);
});

/* ---------------- START SERVER ---------------- */
app.listen(3000, () => {
  console.log("Bank server running on port 3000");
});