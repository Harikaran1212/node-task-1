const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Enable CORS for a specific origin
app.use(cors({
    origin: 'https://node-task-1-l2scdd7sb-harikarans-projects-17414b93.vercel.app' // Allow requests from this origin
}));

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
const uri = 'mongodb+srv://kavitharaghu2003:9jsuE5sE3eX4p2Mz@mine.fjzpv.mongodb.net/?retryWrites=true&w=majority&appName=mine';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas', err));

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
    creationTime: { type: Date, default: Date.now },
    lastUpdatedTime: { type: Date, default: Date.now }
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Define your routes
// API to read data
app.get('https://node-task-1-9.onrender.com/api/read', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    }
});

// API to save data
app.post('https://node-task-1-9.onrender.com/api/save', async (req, res) => {
    try {
        const { firstName, lastName, mobile, email, address, street, city, state, country, loginId, password } = req.body;

        const newUser = new User({
            firstName,
            lastName,
            mobile,
            email,
            address,
            street,
            city,
            state,
            country,
            loginId,
            password
        });

        await newUser.save();
        res.status(201).send('User data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Error saving data');
    }
});

// Start your server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

