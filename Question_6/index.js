const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const authRouter = require('./controllers/auth');
const catRouter = require('./controllers/category');
const productRouter = require('./controllers/product');
const authMiddleWare = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'deepganatra', resave: false, saveUninitialized: false}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res)=>{
    return res.render('login', {error: null});
});
app.get('/dashboard', authMiddleWare, (req, res)=>{
    return res.render('dashboard', {name: req.session.name});
});

app.use('/auth', authRouter);
app.use('/category', catRouter);
app.use('/product', productRouter);

app.listen(5004);