const express = require('express');
const { getDB } = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();

// ---------------------------------------------------------
// 4. Vehicles
// ---------------------------------------------------------

// GET /vehicles (Collection)
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const vehicles = await db.collection('vehicles').find({}).toArray();
        res.status(200).json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /vehicles/:vehicleId
router.get('/:vehicleId', async (req, res) => {
    try {
        const db = getDB();
        const id = Number(req.params.vehicleId);

        const vehicle = await db.collection('vehicles').findOne({ id });
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        // Most recent ping for this vehicle
        const lastPing = await db.collection('pings').findOne(
            { vehicle_id: id },
            { sort: { timestamp: -1 } }
        );

        res.status(200).json({
            ...vehicle,
            last_ping: lastPing || null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /vehicles/:vehicle-id/pings (Scoped collection)
router.get('/:vehicleId/pings', async (req, res) => {
    try {
        const db = getDB();
        const id = Number(req.params.vehicleId);

        const vehicle = await db.collection('vehicles').findOne({ id });
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        const vehiclePings = await db.collection('pings')
            .find({ vehicle_id: id })
            .sort({ timestamp: 1 })
            .toArray();

        res.status(200).json(vehiclePings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /vehicles/:vehicle-id/last-position
// NOTE: the old in-memory version returned every ping here instead of just
// the latest one (flagged as a known bug in project.md). Fixed below now
// that we're querying Mongo directly with a sort + single findOne.
router.get('/:vehicleId/last-position', async (req, res) => {
    try {
        const db = getDB();
        const id = Number(req.params.vehicleId);

        const vehicle = await db.collection('vehicles').findOne({ id });
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        const lastPing = await db.collection('pings').findOne(
            { vehicle_id: id },
            { sort: { timestamp: -1 } }
        );

        if (!lastPing) {
            return res.status(404).json({ error: "No pings found for this vehicle" });
        }

        res.status(200).json(lastPing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /vehicles/:vehicleId/pings
// key_v01 : Key
router.post('/:vehicleId/pings', authenticate, async (req, res) => {
    try {
        const db = getDB();
        const { vehicleId } = req.params;
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const id = Number(vehicleId);
        const vehicle = await db.collection('vehicles').findOne({ id });
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        const newPing = {
            id: `p-${Date.now()}`,
            // NOTE: the old code stored this as `vehicleId` (camelCase), which
            // didn't match the `vehicle_id` field every GET route filters on —
            // so pings created through this endpoint were invisible to the
            // rest of the API. Fixed to `vehicle_id` so it's queryable.
            vehicle_id: id,
            latitude,
            longitude,
            timestamp: new Date().toISOString()
        };

        await db.collection('pings').insertOne(newPing);

        res.setHeader('Location', `/v1/api/vehicles/${vehicleId}/pings/${newPing.id}`);
        res.status(201).json(newPing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;