const express = require('express');
const router = express.Router();
const {user} = require('../../middlewares');
const {User, ConnectionRequest} = require('../../models');


router.post('/send/:status/:toUserId', user.userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const {status, toUserId} = req.params;

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

router.post('/review/:status/:requestId', user.userAuth, async (req, res) => {
    try {
        const user = req.user;
        const {status, requestId} = req.params;

        if(!status && !requestId) {
            throw new Error('status and requestId missing');
        }
        else if(!status) {
            throw new Error('status missing');
        }
        else if(!requestId) {
            throw new Error('requestid missing');
        }

        if(!["accepted", "rejected"].includes(status)) {
            throw new Error(`invalid status: ${status}`);
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: user._id,
            status: "interested"
        })

        if(!connectionRequest) {
            throw new Error('Connection request not found');
        }

        connectionRequest.status = status;
        const result = await connectionRequest.save();

        res.send(result);


    } catch (error) {
        res.status(301).send(`error occur while reviewing request: ${error}`);
    }
})

module.exports = router;