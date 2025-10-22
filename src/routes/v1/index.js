const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const profileRouter = require('./profile');
const requestRouter = require('./request');
const userRequest = require('./user');

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/request', requestRouter);
router.use('/user', userRequest);


module.exports = router;