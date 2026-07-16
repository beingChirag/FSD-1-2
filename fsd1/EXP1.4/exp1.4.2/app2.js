const express = require("express");
const app = express();

app.use(express.json());

let cards = [
  { id: 1, suit: "hearts", value: "ace", collection: "vintage" },
  { id: 2, suit: "diamonds", value: "queen", collection: "royal" }
];

// GET all cards
app.get("/api/cards", (req, res) => {
  res.json(cards);
});

// GET single card
app.get("/api/cards/:id", (req, res) => {
  const card = cards.find(c => c.id == req.params.id);
  if (!card) return res.status(404).send("Card not found");
  res.json(card);
});

// POST - add new card
app.post("/api/cards", (req, res) => {
  const newCard = {
    id: Date.now(),
    suit: req.body.suit,
    value: req.body.value,
    collection: req.body.collection
  };

  cards.push(newCard);
  res.status(201).json(newCard);
});

// PUT - update card
app.put("/api/cards/:id", (req, res) => {
  const card = cards.find(c => c.id == req.params.id);
  if (!card) return res.status(404).send("Card not found");

  card.suit = req.body.suit;
  card.value = req.body.value;
  card.collection = req.body.collection;

  res.json(card);
});

// DELETE card
app.delete("/api/cards/:id", (req, res) => {
  const index = cards.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).send("Card not found");

  const deleted = cards.splice(index, 1);
  res.json(deleted[0]);
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});