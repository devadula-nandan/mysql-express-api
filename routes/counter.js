const express = require('express');
const router = express.Router();
// db models
const db = require("../models");

router.get('/count/:uuid?', async (req, res) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      // If no UUID is provided, create a new counter with a generated UUID
      const newCounter = await db.Counter.create({});
      return res.json({ id: newCounter.id, count: newCounter.count });
    }

    // Find the counter by UUID
    const counter = await db.Counter.findOne({ where: { id: uuid } });

    if (!counter) {
      // If counter doesn't exist, return an error
      return res.status(404).json({ error: 'Counter not found' });
    }

    // Increment the count
    counter.count++;
    await counter.save();

    res.json({ id: counter.id, count: counter.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
