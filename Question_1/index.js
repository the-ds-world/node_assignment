const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/assignment2quest1')
  .then(() => {
    console.log('Mongo connected successfully.');
  })
  .catch((err) => {
    console.log(`Error : ${err}`);
  });

// Define Schemas and Models
const filesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    aadhar: {
        type: String,
        required: true,
    },
});

const documentSchema = new mongoose.Schema({
    fileId: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'files',
    },
    name: {
        required: true,
        type: String,
    },
});

const File = mongoose.model('files', filesSchema);
const Document = mongoose.model('docs', documentSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
        cb('Only PDF files are supported');
        } else {
        cb(null, './uploads');
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const uploads = multer({ storage });

// Initialize Express application
const app = express();

// Serve static HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.get('/documents', (req, res) => {
     res.sendFile(path.join(__dirname, 'documents.html'));
});

app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'download.html'));
});

// Retrieve files with associated documents
app.get('/files', async (req, res) => {
    try {
        const files = await File.aggregate([
        {
            $lookup: {
            from: 'docs',
            localField: '_id',
            foreignField: 'fileId',
            as: 'doc',
            },
        },
        ]);
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Register a new user
app.post('/register', uploads.single('aadhar'), async (req, res) => {
    const { name, email, password } = req.body;
    const aadhar = req.file.filename;
    const newUser = new File({ name, email, password, aadhar });
    await newUser.save();
    res.redirect('/documents?id=' + newUser._id);
});

// Handle document uploads
app.post('/document-uploads', uploads.array('docs'), async (req, res) => {
    try {
        const id = req.body.id;
        const files = req.files;
        const docs = files.map(file => ({
        fileId: new mongoose.Types.ObjectId(id),
        name: file.filename,
        }));
        await Document.insertMany(docs);
        res.redirect('/docs');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
