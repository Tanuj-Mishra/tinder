const express = require('express');
const {database} = require('./config');
const {User} = require('./models');
const app = express();


app.use(express.json());

app.post('/signup', async (req, res) => {
    const user = new User(req.body);
    await user.save()
        .then(() =>{
            res.send('user added successfully');
        })
        .catch(() => {
            res.status(404).send('error occured while saving user');
        })
    ;

})

app.get('/feed', async(req, res) => {
    try {
        const result = await User.find({});
        if(Object.keys(result).length !== 0) {
            res.send(result);
        }
        else {
            res.status(300).send('no user defined');
        }
    } catch (error) {
        res.status(401).send('internal server error');
    }
})

// find user from given id
// here whenever we provide incorrect id from postman, this directly hits the catch block.

app.get('/users/:_id', async(req, res) => {
    try {
        const result = await User.findById(req.params._id).exec();
        if(!result) {
            res.status(301).send('no user found for given id');
        }
        else {
            res.send(result);
        }
    } catch (error) {
        console.log(error);
        res.status(401).send('internal server errror');
    }
})


// find one user by given email id
app.get('/users', async(req, res) => {
    try {
        const result = await User.findOne({emailId: req.body.emailId});
        if(!result) {
            res.status(301).send('no user found for given email id');
        }
        else {
            res.send(result);
        }
    } catch (error) {
        res.status(401).send('internal server errror');
    }
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


