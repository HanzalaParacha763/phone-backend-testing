const express = require('express');
const router = express.Router();
const FormData = require('../models/FormData');

// GET: Fetch all form data
router.get('/', async (req, res) => {
    try {
        const data = await FormData.find();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;
