const jwt = require('jsonwebtoken');
const {User} = require('../models');
const privateKey = 'abra_ka_dabra';

const userAuth = async (req, res, next) => {

    try {
        const {token} = req.cookies;
        if(!token) {
            throw new Error("User logged out");
        }
        
        // finding id from token
        const {_id} = await jwt.verify(token, privateKey);

        // find user from given id
        req.user = await User.findById(_id);

        next();
    } catch (error) {
        res.status(401).send(`login again, error occured: ${error}`);
    }

}

module.exports = {userAuth};