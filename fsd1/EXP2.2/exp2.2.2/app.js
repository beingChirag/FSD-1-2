const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

const SECRET = "mysecretkey";

// In-memory users (replace with DB in real apps)
let users = [];

/* ---------------- REGISTER ---------------- */
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  const existing = users.find(u => u.username === username);
  if (existing) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ username, password: hashedPassword });

  res.json({ message: "User registered successfully" });
});

/* ---------------- LOGIN ---------------- */
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

/* ---------------- AUTH MIDDLEWARE ---------------- */
function auth(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
}

/* ---------------- PROTECTED ROUTE ---------------- */
app.get("/api/balance", auth, (req, res) => {
  res.json({
    message: `Welcome ${req.user.username}`,
    balance: 5000
  });
});

/* ---------------- START SERVER ---------------- */
app.listen(3000, () => {
  console.log("Server running on port 3000");
});