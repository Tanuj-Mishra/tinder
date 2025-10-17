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

app.listen(3000, (req, res) => {
    console.log('my ears are working, thank you for coming at port: 3000');
})
