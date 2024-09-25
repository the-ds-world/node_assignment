const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://127.0.0.1/assignment2quest1').then(()=>{console.log('MongoDB connected successfully');})

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const userSchema = mongoose.Schema({
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
const User = mongoose.model('users', userSchema);

app.get('/students', async(req, res)=>{
    const users = await User.find();
    return res.status(200).json(users);
})
app.get('/students/:id', async(req, res)=>{
    const user = await User.findById(req.params.id);
    return res.status(200).json(user);
})
app.delete('/students/delete/:id', async(req, res)=>{
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({});
})
app.post('/students/add', async(req, res)=>{
    const {name, email, password} = req.body;
    const hash = await bcrypt.hash(password, 10);

    const user = new User({
        name: name,
        email: email,
        password: hash
    });
    await user.save();
    return res.status(200).json({});
})
app.put('/students/update/:id', async(req, res)=>{
    const {email, name} = req.body;
    const id = req.params.id;

    const user = await User.findById(id);

    if(!user)
        return res.status(404);

    user.name = name;
    user.email = email;

    if(req.body.password)
    {
        const password = await bcrypt.hash(req.body.password, 10);
        user.password = password;
    }

    await user.save();
    return res.status(200).json({});
})
app.listen(5003);