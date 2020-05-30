module.exports = function checkToken(req, res, next) {
    const header = req.headers['authorization'];
    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        req.token = bearer[1];
        next();
    } else {
        res.sendStatus(401);
    }
};
