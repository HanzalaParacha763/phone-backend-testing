const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb'); // Assuming you're using MongoDB

// Replace this with your MongoDB connection details
const uri = 'mongodb://localhost:27017';
const dbName = 'backendApp';
const collectionName = 'formdatas';

// GET: Generate and Download Excel File
router.get('/', async (req, res) => {
    try {
        // Connect to MongoDB
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Fetch data from the database
        const data = await collection.find().toArray();

        // Transform data for the Excel file
        const formattedData = data.map(({ _id, ...rest }) => rest); // Remove `_id` field if present

        // Create a new workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Write workbook to buffer
        const filePath = path.join(__dirname, 'data.xlsx');
        XLSX.writeFile(workbook, filePath);

        // Download the file
        res.download(filePath, 'data.xlsx', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading file');
            }

            // Clean up the file after download
            fs.unlinkSync(filePath);
        });

        // Close MongoDB connection
        client.close();
    } catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).send('Error generating Excel file');
    }
});

module.exports = router;
