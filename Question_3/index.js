const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const path = require('path');

// Create Redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

redisClient.on('error', (err) => {
     console.error('Redis error:', err);
});

const app = express();

// Configure session middleware with Redis store
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'kenil',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 36000000 } // 10 hours
}));

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Set EJS as the view engine and specify views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Sample user data
const users = [
    { name: 'Kenil Vastarpara', email: 'kenilvastarpar872@gmail.com', password: 'kenil@132' },
    { name: 'Arpita Borda', email: 'arpitab4101@gmail.com', password: 'arpita123' },
    { name: 'Harsh Mendapra', email: 'harshmendapara@gmail.com', password: 'harsh123' },
    { name: 'devang shah', email: 'devang@gmail.com', password: '123' }
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
    const user = users.find(user => user.email === email && user.password === password);

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
app.listen(3000, () => {
     console.log('Server is running on port 3000');
});
