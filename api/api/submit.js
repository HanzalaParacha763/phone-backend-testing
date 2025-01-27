const express = require('express');
const router = express.Router();
const FormData = require('../models/FormData');

// POST: Submit form data
router.post('/', async (req, res) => {
    const { name, email, phone } = req.body;

    try {
        const newEntry = new FormData({ name, email, phone });
        await newEntry.save();
        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).json({ error: 'Failed to submit form' });
    }
});

// module.exports = router;

const connectToDatabase = require('../utils/db');

module.exports = async (req, res) => {
    try {
        await connectToDatabase();
        res.status(200).json({ message: 'Submit route is working!' });
    } catch (error) {
        res.status(500).json({ error: 'Error in submit route', details: error.message });
    }
};
