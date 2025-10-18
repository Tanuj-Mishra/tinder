const HTTPStatusCode = require('http-status-code');

const authenticatePeople = (req, res, next) => {
    if(Math.random() > 0.5) {
        res.status(401).send(HTTPStatusCode.getMessage(401));
    }
    else {
        next();
    }
}

module.exports = {
    authenticatePeople
}