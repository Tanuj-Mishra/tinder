const express = require('express');
const {database} = require('./config');
const app = express();


database.connectDB()
    .then(() => {
        app.listen(3000, (req, res) => {
            console.log('my ears are working, thank you for coming at port: 3000');
        })
        console.log('database connected');
    })
    .catch(() => {
        console.log('error occured');
    })


