const express = require('express');
const { getDB } = require('../db');

const router = express.Router();

// ---------------------------------------------------------
// 5. Pings
// ---------------------------------------------------------

// GET /pings (Collection)
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const pings = await db.collection('pings').find({}).toArray();
        res.status(200).json(pings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /pings/:pingId (Atomic member)
router.get('/:pingId', async (req, res) => {
    try {
        const db = getDB();
        const rawId = req.params.pingId;

        // Seed pings use numeric ids; pings created via POST /vehicles/:id/pings
        // use string ids like "p-<timestamp>". Match whichever type applies.
        const numericId = Number(rawId);
        const query = Number.isNaN(numericId) ? { id: rawId } : { id: numericId };

        const ping = await db.collection('pings').findOne(query);

        if (ping) {
            res.status(200).json(ping);
        } else {
            res.status(404).json({ error: "Ping not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;