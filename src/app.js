const express = require('express');
const {peopleAuth} = require('./middlewares');

const app = express();

const fun1 = (req, res, next) => {
    console.log('ha ha ha');
    next();
};

const fun2 = (req, res, nxt) => {
    res.send('shant ho jao bacha, bs error hi to aayi h');
    console.log(`i'm here: ${err}`);
};

app.get('/users', fun1);
app.use('/', fun2);

app.listen(3000, (req, res) => {
    console.log('my ears are working, thank you for coming at port: 3000');
})
