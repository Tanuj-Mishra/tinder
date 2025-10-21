const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const {User} = require('../../models');
const saltRounds = 10;

router.post('/signup', async (req, res) => {
    try {

        if(!req.body.password) {
            throw new Error('Password absent');
        }

        const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
        req.body.password = encryptedPassword;
        const result = await User.insertOne(req.body);
        res.send(result);
    } 
    catch (error) {
        res.status(404).send(`error occured while saving user: ${error}`);
    }

});

router.post('/login', async (req, res) => {
    try {
        const inputEmailId = req.body.emailId;
        const inputPassword = req.body.password;

        if (!inputEmailId && !inputPassword) {
            throw new Error("Email and Password missing");
        }
        else if(!inputEmailId) {
            throw new Error("Email missing");
        }
        else if(!inputPassword) {
            throw new Error("Password missing");
        }
        const result = await User.findOne({emailId: req.body.emailId});
        if(!result) {
            // throw new Error("User not present");
            throw new Error("Invalid credentials");
        }
        const compare = await result.validatePassword(inputPassword);
        if(!compare) {
            // throw new Error("Incorrect password");
            throw new Error("Invalid credentials");
        }
        const token = await result.getJWT();
        res.cookie('token', token, {expires: new Date(Date.now() + 24 * 3600000)});
        res.send('logged in');

    } catch (error) {
        res.status(300).send(`error occured while logging in: ${error}`);
    }

});

router.get('/logout', (req, res) => {
    res.cookie('token', null, {'expires': new Date(Date.now())}).send('Logged out successfully');
});


module.exports = router;
