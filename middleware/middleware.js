// Middleware function to determine if the API endpoint request is from an authenticated user
const jwt = require('jsonwebtoken');

function isAuth(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, process.env.TOKEN_SECRET, (err, authData) => {
            if (err) {
                res.status(403).send({
                    status: 'error',
                    message: 'Forbidden - Invalid token',
                });
            } else {
                req.user = authData;
                next();
            }
        });
    } else {
        res.status(403).send({
            status: 'error',
            message: 'Forbidden - No token provided',
        });
    }
}

module.exports = isAuth;


