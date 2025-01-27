const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        const uri = 'mongodb://localhost:27017/backendApp'; // Replace with your MongoDB URI
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process if connection fails
    }
};

module.exports = connectToDatabase;
