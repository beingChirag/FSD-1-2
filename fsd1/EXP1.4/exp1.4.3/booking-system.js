const express = require("express");
const Redis = require("ioredis");

const app = express();
const redis = new Redis();

app.use(express.json());

const TOTAL_SEATS = 100;

// Initialize seats (run once)
redis.setnx("available_seats", TOTAL_SEATS);

// Booking API
app.post("/api/book", async (req, res) => {
  const lockKey = "seat_lock";

  try {
    // Acquire lock (simple Redis lock)
    const lock = await redis.set(lockKey, "locked", "NX", "EX", 5);

    if (!lock) {
      return res.status(429).json({ error: "System busy, try again" });
    }

    let seats = await redis.get("available_seats");
    seats = parseInt(seats);

    if (seats <= 0) {
      return res.json({ success: false, message: "Sold out" });
    }

    // Book 1 seat
    seats -= 1;
    await redis.set("available_seats", seats);

    const bookingId = Date.now();

    // Release lock
    await redis.del(lockKey);

    res.json({
      success: true,
      bookingId,
      remaining: seats
    });

  } catch (err) {
    await redis.del(lockKey);
    res.status(500).send("Error");
  }
});

// Check remaining seats
app.get("/api/seats", async (req, res) => {
  const seats = await redis.get("available_seats");
  res.json({ remaining: parseInt(seats) });
});

// Start server
app.listen(3000, () => {
  console.log("Booking system running on port 3000");
});