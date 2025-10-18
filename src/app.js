const express = require('express');

const app = express();

app.get(/.*fly$/, (req, res) => {
    res.send('fly');
})

app.get('/users', (req, res) => {
    res.send({name: "tanuj", age: 25});
})

app.post('/users', (req, res) => {
    res.send('data saved to db');
})

app.delete('/users', (req, res) => {
    res.send('data deleted from db');
})

app.patch('/users', (req, res) => {
    res.send('data updated on db');
})

app.use('/test', (req, res) => {
    res.send('welcome to indian railways');
})

app.get('/hello', (req, res) => {
    console.log(req.query);
    res.send('theek h');
})

app.get('/hello/:userId', (req, res) => {
    console.log(req.params);
    res.send('hellllo');
})


function fun1(req, res, next) {
    console.log('fun1');
}

function fun2(req, res, next) {
    console.log('fun2');
    res.send('fun2');
}

function fun3(req, res, next) {
    console.log('fun3');
    next();
}

function fun4(req, res, next) {
    console.log('fun4');
    res.send('fun4');
    next();
}

function fun5(req, res, next) {
    console.log('fun5');
    next();
    res.send('fun5');
}


function gun1(req, res, next) {
    console.log('gun1');
    res.send('gun1');
}

function gun2(req, res, next) {
    console.log('gun2');
    next();
}


function gun3(req, res, next) {
    console.log('gun3');
}

app.get('/middle/1', fun3, gun1); // works perfectly fine
app.get('/middle/2', fun3, gun2); // error for client, as there is no next()
app.get('/middle/3', fun3, gun3); // wait for client, as nothing is sent


app.get('/middle/4', fun1, gun1);  // wiat for client, as nothing is sent
app.get('/middle/5', fun2, gun1);  // works alright
app.get('/middle/6', fun4, gun1);  // response will be send, but there will be error in client, as now response is send and then next is called
app.get('/middle/7', fun5, gun1);  // responser will be send, but now, there is no meaning to again execute send command.


app.get('/sample', (req, res, next) => {
    console.log('first');
    next();
});

app.get('/sample', (req, res, next) => {
    console.log('second');
    // next();
    res.send('ha ha ha');
});




app.listen(3000, (req, res) => {
    console.log('my ears are working, thank you for coming at port: 3000');
})
