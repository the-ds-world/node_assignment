function authMiddleWare(req, res, next)
{
    if(!req.session.name)
        return res.redirect('/');
    next();
}

module.exports = authMiddleWare;