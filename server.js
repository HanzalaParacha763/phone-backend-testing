const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx');
const fs = require('fs');

const app = express();

app.use(cors());

app.use(bodyParser.json()); // Use body-parser to parse JSON requests


// Function to append data to an Excel file
function appendToExcel(filePath, data) {
    let workbook;
    const sheetName = 'Sheet1';

    try {
        if (fs.existsSync(filePath)) {
            workbook = xlsx.readFile(filePath);
        } else {
            workbook = xlsx.utils.book_new();
        }

        let worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
            // Create a new worksheet with headers if it doesn't exist
            worksheet = xlsx.utils.aoa_to_sheet([['Name', 'Email', 'Phone']]);
            xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
        }

        const existingData = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        existingData.push(data);
        const newWorksheet = xlsx.utils.aoa_to_sheet(existingData);
        workbook.Sheets[sheetName] = newWorksheet;

        // Save the workbook
        xlsx.writeFile(workbook, filePath);
    } catch (error) {
        console.error('Error appending to Excel file:', error);
    }
}


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// API endpoint to handle form submission
app.post('/api/submit', (req, res) => {
    try {
        console.log('Received form data:', req.body);
        const formData = req.body;
        const filePath = 'data.xlsx';

        appendToExcel(filePath, [formData.name, formData.email, formData.phone]);

        res.status(200).json({ message: 'Form submitted successfully', phone: formData.phone });
    } catch (error) {
        console.error('Error submitting form', error);
        res.status(500).json({ message: 'Error submitting form' });
    }
});

app.get('/api/data', (req, res) => {
    const filePath = 'data.xlsx';
    try {
        if (fs.existsSync(filePath)) {
            const workbook = xlsx.readFile(filePath);
            const worksheet = workbook.Sheets['Sheet1'];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            res.status(200).json(jsonData);
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    } catch (error) {
        console.error('Error reading Excel file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/download', (req, res) => {
    const filePath = 'data.xlsx';
    if (fs.existsSync(filePath)) {
        res.download(filePath, 'data.xlsx', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading file');
            }
        });
    } else {
        res.status(404).send('File not found');
    }
});

// Port configuration
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
