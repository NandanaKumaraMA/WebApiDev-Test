// router/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// POST /v1/api/auth/token
// Body: { "sub": "TUK-DEV-520651", "role": "device", "expiresIn": "12h" }
// NOTE: this issues a token to anyone who calls it — there's no credential
// check yet, since there's no Users/Drivers collection to validate against.
// Fine for dev/testing; lock this down (or replace with a real login) before
// this goes anywhere near production.
router.post('/token', (req, res) => {
    try {
        const { sub, role = 'device', expiresIn = '12h' } = req.body || {};

        if (!sub) {
            return res.status(400).json({ error: 'Missing required field: sub' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: 'Server misconfigured: missing JWT_SECRET' });
        }

        const token = jwt.sign({ sub, role }, process.env.JWT_SECRET, { expiresIn });

        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;