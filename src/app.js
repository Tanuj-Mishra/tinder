const express = require('express');
const {database} = require('./config');
const {User} = require('./models');
const app = express();

const sampleUser = {
    firstName: "tanuj",
    lastName: "mishra",
    emailId: "tanuj@mishra.com",
    password: "tanuj@123"
}

const user = new User(sampleUser);

app.post('/signup', async (req, res) => {
    await user.save()
        .then(() =>{
            res.send('user added successfully');
        })
        .catch(() => {
            res.status(404).send('error occured while saving user');
        })
    ;

})


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


