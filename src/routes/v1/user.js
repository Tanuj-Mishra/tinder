const express = require('express');
const router = express.Router();

const {ConnectionRequest} = require('../../models');
const {user} = require('../../middlewares');
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// get all the pending connection request for the loggedIn user
router.get('/requests/received', user.userAuth, async(req, res) => {
    try {
        const user = req.user;

        const result = await ConnectionRequest.find({
            toUserId: user._id
        }).populate('fromUserId', USER_SAFE_DATA);

        res.send(result);
    } catch (error) {
        res.status(400).send(`error occured while fetching received requests: ${error}`);
    }
});

router.get('/connections', user.userAuth, async(req, res) => {
    try {
        const user = req.user;
        const result = await ConnectionRequest.find({
            $and: [
                {status: "accepted"},
                {$or: [{fromUserId: user._id}, {toUserId: user._id}]}
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const finalResult = [];
        result.forEach((val) => {
            if(val.fromUserId._id.equals(user._id)) {
                finalResult.push(val.toUserId);
            }
            else {
                finalResult.push(val.fromUserId);
            }
        })
        res.send(finalResult);
    } catch (error) {
        res.status(400).send(`error occured while fetching connections: ${error}`);
    }
})

module.exports = router;