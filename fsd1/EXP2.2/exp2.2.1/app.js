const express = require("express");
const app = express();

app.use(express.json());

/* ------------------ LOGGER MIDDLEWARE ------------------ */
function logger(req, res, next) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next(); // pass control
}

/* ------------------ AUTH MIDDLEWARE ------------------ */
function auth(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  if (token !== "Bearer mysecrettoken") {
    return res.status(403).json({ error: "Invalid token" });
  }

  next(); // authorized
}

/* ------------------ APPLY GLOBAL MIDDLEWARE ------------------ */
app.use(logger);

/* ------------------ ROUTES ------------------ */

// Public route
app.get("/", (req, res) => {
  res.send("Public Route");
});

// Protected route
app.get("/secure", auth, (req, res) => {
  res.send("Protected Route Accessed!");
});

/* ------------------ ERROR HANDLING MIDDLEWARE ------------------ */
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Something went wrong" });
});

/* ------------------ START SERVER ------------------ */
app.listen(3000, () => {
  console.log("Server running on port 3000");
});