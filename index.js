// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const connectToDatabase = require('./utils/db'); // MongoDB connection

// Import route handlers
// const dataRoutes = require('./api/data');
// const downloadRoutes = require('./api/download');
// const submitRoutes = require('./api/submit');

// const app = express();

// Middleware
// app.use(cors());
// app.use(bodyParser.json());

// Connect to MongoDB
// connectToDatabase();

// Route handlers
// app.use('/api/data', dataRoutes);
// app.use('/api/download', downloadRoutes);
// app.use('/api/submit', submitRoutes);

// Default route
// app.get('/', (req, res) => {
//     res.send('Backend is live and running!');
// });
// app.get('/api/data', (req, res) => {
// });
// app.get('/api/download', (req, res) => {
//     res.send('Download.js is live!');
// });
// app.get('/api/submit', (req, res) => {
//     res.send('Submit.js is live!');
// });

// Start the server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectToDatabase = require('./utils/db');

const submitRoute = require('./api/submit');
const dataRoute = require('./api/data');
const downloadRoute = require('./api/download');

const app = express();
const PORT = 3001;
connectToDatabase();

// Middleware
app.use(cors());
app.use(bodyParser.json());



// Routes
app.use('/api/submit', submitRoute);
app.use('/api/data', dataRoute);
app.use('/api/download', downloadRoute);

// Server Start
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

