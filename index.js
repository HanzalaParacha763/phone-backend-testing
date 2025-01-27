const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/backendApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// FormData Mongoose Model
const formDataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
});
const FormData = mongoose.model('FormData', formDataSchema);

// Routes

// POST: Submit form data
app.post('/api/submit', async (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newEntry = new FormData({ name, email, phone });
        await newEntry.save();
        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).json({ error: 'Failed to submit form' });
    }
});

// GET: Fetch all form data
app.get('/api/data', async (req, res) => {
    try {
        const data = await FormData.find();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// GET: Generate and Download Excel File
app.get('/api/download', async (req, res) => {
    try {
        // Fetch data from the database
        const data = await FormData.find().lean();

        // Create a new workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Write the Excel file to a buffer
        const filePath = path.join(__dirname, 'data.xlsx');
        XLSX.writeFile(workbook, filePath);

        // Send the file for download
        res.download(filePath, 'data.xlsx', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                return res.status(500).send('Error downloading file');
            }

            // Clean up the file after download
            fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).send('Error generating Excel file');
    }
});

// Root route
app.get('/', (req, res) => {
    try {
        res.status(200).send("Welcome to phone-form-backend");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error with something");
    }
});

// Server Start
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
