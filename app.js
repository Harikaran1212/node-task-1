const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const PORT = 3000;

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a MongoDB schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mobile: {
        type: String,
        match: [/^\d{10}$/, 'Mobile number must be 10 digits']
    },
    email: {
        type: String,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    address: String,
    street: String,
    city: String,
    state: String,
    country: String,
    loginId: {
        type: String,
        match: [/^[a-zA-Z0-9]{8,}$/, 'Login ID must be at least 8 characters, alphanumeric']
    },
    password: {
        type: String,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/, 'Password must contain 6 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character']
    },
    creationTime: Date,
    lastUpdatedTime: Date
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Serve the static HTML form
app.use(express.static('public'));

// API to save data into MongoDB
app.post('/saveData', async (req, res) => {
    try {
        // Set creation and update times
        const creationTime = new Date();
        const lastUpdatedTime = creationTime;

        const newUser = new User({
            ...req.body,
            creationTime,
            lastUpdatedTime
        });

        await newUser.save();
        res.status(200).send('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error saving data');
    }
});

// API to retrieve data from MongoDB
app.get('/getData', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 

