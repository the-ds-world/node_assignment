const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/assignment2quest1', {
}).then(() => {
  console.log('MongoDB Connected Successfully.');
}).catch(err => {
  console.error('MongoDB Connection Error:', err);
});

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  email: {
    required: true,
    unique: true,
    type: String
  }
});

const User = mongoose.model('User', userSchema);

const SECRET_KEY = 'ganatradeep';
const app = express();

// Setup EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.render('register');
});

app.post('/', async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      name: name,
      password: hash,
      email: email
    });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Server error');
  }
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.render('login', { error: 'Credentials invalid' });
    }

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', 'Bearer ' + token, { httpOnly: true });
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server error');
  }
});

app.get('/dashboard', (req, res) => {
  const auth = req.cookies.token;
  if (!auth) {
    return res.redirect('/login');
  }

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    res.render('dashboard', { token: payload });
  } catch (error) {
    console.error('Invalid token:', error);
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// Start the server
app.listen(5002, () => {
  console.log('Server is running on port 5000');
});
