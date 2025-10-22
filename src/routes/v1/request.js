const express = require('express');
const router = express.Router();
const {user} = require('../../middlewares');
const {User, ConnectionRequest} = require('../../models');


router.post('/send/:status/:toUserId', user.userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const status = req.params.status;
        const toUserId = req.params.toUserId;

        // whether they are present or not
        if(!status && !toUserId) {
            throw new Error("status and receiverId missing");
        }
        else if(!status) {
            throw new Error("status missing");
        }
        else if(!toUserId) {
            throw new Error("receiverId missing");
        }

        // whether they are valid or not
        if(!["interested", "ignored"].includes(status)) {
            throw new Error("Invalid status");
        }

        const receiverUser = await User.findById(toUserId);
        if(!receiverUser) {
            throw new Error("Invalid receiver id");
        }

        // check if reverse is present or not
        const duplicateRequest = await ConnectionRequest.findOne({
            $or: [{fromUserId: fromUserId, toUserId: toUserId}, {fromUserId: toUserId, toUserId: fromUserId}]
        })

        if(duplicateRequest) {
            throw new Error('request already present');
        }

        // create request
        const result = await ConnectionRequest.insertOne({
            fromUserId: fromUserId, 
            toUserId: toUserId, 
            status: status
        });
        res.send(result);

    } catch (error) {
        res.status(400).send(`error occured while making request for connection: ${error}`);
    }
})

module.exports = router;