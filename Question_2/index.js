const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Configure session management
app.use(session({
    store: new FileStore({
        path: './sessions',
        ttl: 3600, // Time-to-live in seconds
        retries: 5
    }),
    saveUninitialized: false,
    resave: false,
    secret: 'kenil'
}));

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Sample user data
const users = [
    { name: 'Kenil Vastarpara', email: 'kenilvastarpar872@gmail.com', password: 'kenil@132' },
    { name: 'Arpita Borda', email: 'arpitab4101@gmail.com', password: 'arpita123' },
    { name: 'Harsh Mendapra', email: 'harshmendapara@gmail.com', password: 'harsh123' }
];

// Route for the home page or dashboard
app.get('/', (req, res) => {
    if (req.session.name) {
        return res.redirect('/dashboard');
    } else {
        return res.redirect('/login');
    }
});

// Route for the login page
app.get('/login', (req, res) => {
    return res.render('login', { error: null });
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        req.session.name = user.name;
        return res.redirect('/dashboard');
    } else {
        return res.render('login', { error: 'Invalid email or password' });
    }
});

// Route for the dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.name) {
        return res.render('dashboard', { name: req.session.name });
    } else {
        return res.redirect('/login');
    }
});

// Route for logging out
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
        console.error('Error destroying session:', err);
        }
        res.clearCookie('connect.sid');
        return res.redirect('/login');
    });
});

// Start the server
app.listen(5001, () => {
    console.log('Server is running on port 5000');
});
