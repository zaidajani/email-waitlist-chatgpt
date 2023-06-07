const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Connect to MongoDB using Mongoose
mongoose
  .connect('mongodb://localhost:27017/emailWaitlist', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');

    // Create a schema for email documents
    const emailSchema = new mongoose.Schema({
      email: {
        type: String,
        required: true,
        unique: true,
      },
    });

    // Create a model for email documents
    const Email = mongoose.model('Email', emailSchema);

    app.use(express.json());

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'index.html'));
    });

    app.post('/add-to-waitlist', (req, res) => {
      const { email } = req.body;

      // Create a new email document
      const newEmail = new Email({ email });

      // Save the email document to the database
      newEmail
        .save()
        .then(() => {
          console.log('Email stored in MongoDB:', email);
          res.status(201).json({ message: 'Email added to the waitlist' });
        })
        .catch((error) => {
          console.error('Error storing email:', error);
          res.status(500).json({ message: 'An error occurred' });
        });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
