const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/user-routes');

const app = express();

// MongoDB configuration
const mongoURI = 'mongodb://localhost:27017/mydatabase'; // Replace with your MongoDB connection string
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose.connect(mongoURI, mongoOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

// Middleware
app.use(express.json());

// Routes
app.use('/users', usersRouter);

// Start the server
const port = 3000; // Replace with your desired port
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
