const express = require('express');

const app = express();

app.use('/hello', (req, res) => {
    res.send('hello');
})

app.use('/hello/2', (req, res) => {
    res.send('hey hey hey hello');
})



app.use('/test', (req, res) => {
    res.send('welcome to indian railways');
})

app.listen(3000, (req, res) => {
    console.log('my ears are working, thank you for coming at port: 3000');
})
