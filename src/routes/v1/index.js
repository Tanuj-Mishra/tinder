const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const profileRouter = require('./profile');
const requestRouter = require('./profile');

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
// router.use('/request', requestRouter);

module.exports = router;