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
        .catch((error) => {
            res.status(404).send(`error occured while saving user: ${error}`);
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


/**
 * There is a pre-defined set of columns, which can be updated, and if the user sends anything 
 * other than those, then:
 * 
 * 1. Those invalid fields will be removed from the update payload.
 * 2. The names of the rejected keys will be collected and returned in the response.
 * 
 * This ensures that only the fields listed in ACCEPTABLE_INPUT are allowed to be updated.
 * Any extra or unauthorized fields are ignored silently but reported back.
 */

app.patch('/users/:id', async (req, res) => {
    try {
        const ACCEPTABLE_INPUT = ["about", "photoUrl", "skills"];
        let rejectedInputKeys = [];
        for(const [key,val] of Object.entries(req.body)) {
            if(!ACCEPTABLE_INPUT.includes(key)) {
                delete req.body[key];
                rejectedInputKeys.push(key);
            }
        }

        if(req.body.skills?.length > 10) {
            throw new Error("skills can't be more then 10")
        }

        const result = await User.findByIdAndUpdate(req.params.id, req.body,{runValidators: true});
        res.send({result, rejectedInputKeys});
    }
    catch(error) {
        res.status(300).send('error occured while updating: ' + error);
    }
})

app.patch('/users/by-email/:emailId', async (req, res) => {
    try {
        const result = await User.findOneAndUpdate({emailId: req.params.emailId}, req.body);
        res.send(result);
    }
    catch {
        res.status(300).send('error occured while updating using emailid');
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        res.send(result);
    }
    catch{
        res.status(300).send('some error occured while deleting the user');
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


