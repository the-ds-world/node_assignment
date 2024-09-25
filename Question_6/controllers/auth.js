const router = require('express').Router();
const Role = require('../models/Role');
const User = require('../models/User');
const {compare} = require('../functions/hashing');

router.post('/login', async(req, res)=>{
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email: email});
        if(!user)
            return res.render('login', {error: 'Invalid credentials'});
        const com = await compare(password, user.password);
        if(!com)
            return res.render('login', {error: 'Invalid credentials'});
        req.session.userId = user._id;
        req.session.name = user.name;

        res.redirect('/dashboard');
    } catch (error) {
        return res.render('login', {error: error});
    }
});
router.get('/logout', (req, res)=>{
    req.session.destroy();
    res.clearCookie('connect.sid');
    return res.redirect('/');
})

module.exports = router;