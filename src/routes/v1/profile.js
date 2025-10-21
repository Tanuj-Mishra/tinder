const express = require('express');
const {User} = require('../../models');
const bcrypt = require('bcrypt');
const {user} = require('../../middlewares');
const router = express.Router();
const saltRounds = 10;


router.post('/view', user.userAuth, async(req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(401).send(`error occured while getting profile: ${error}`);
    }
});

router.patch('/edit', user.userAuth, async(req, res) => {
    try {
        const user = req.user;
        const ACCEPTABLE_INPUT = ["about", "photoUrl", "skills"];
        let rejectedInputKeys = [];
        for(const [key,val] of Object.entries(req.body)) {
            if(!ACCEPTABLE_INPUT.includes(key)) {
                delete req.body[key];
                rejectedInputKeys.push(key);
            }
        }

        if(req.body.skills?.length > 10) {
            throw new Error("skills can't be more then 10")
        }
        const result = await User.findByIdAndUpdate(user._id, req.body,{runValidators: true});
        res.send({result, rejectedInputKeys});
    }
    catch(error) {
        res.status(300).send('error occured while updating: ' + error);
    }
})

router.patch('/forgotPassword', user.optionalUserAuth, async(req, res) => {

    try {
        const user = req.user;

        if(user) {

            if(!req.body.newPassword) {
                throw new Error('password missing');
            }
            const encryptedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);

            user.password = encryptedPassword;
            const result = await User.findByIdAndUpdate(user._id, user,{runValidators: true});
            res.send({result});

        }
        else {
            const {emailId, newPassword} = req.body;

            // validations
            if(!emailId && !newPassword) {
                throw new Error("email and new password missing");
            }
            else if(!emailId) {
                throw new Error("email missing");
            }
            else if(!newPassword) {
                throw new Error("password missing");
            }

            // getting for given emailId
            const user = await User.findOne({emailId: emailId});

            if(!user) {
                throw new Error('user not defined');
            }

            const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);

            user.password = encryptedPassword;
            const result = await User.findByIdAndUpdate(user._id, user,{runValidators: true});
            res.send({result});

        }
        
    } catch (error) {
        res.status(300).send(`error occured while changing password: ${error}`);
    }

});
    

module.exports = router;