const express = require('express');
const bycrpt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {database} = require('./config');
const {User} = require('./models');
const {user} = require('./middlewares');
const app = express();

const privateKey = 'abra_ka_dabra';

app.use(express.json());
app.use(cookieParser());

app.post('/signup', user.userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } 
    catch (error) {
        res.status(404).send(`error occured while saving user: ${error}`);
    }

})

app.post('/sendConnectionRequst', user.userAuth, async (req, res) => {
    try {
        res.send(`request was sent by: ${req.user.firstName} ${req.user.lastName}`)
    } catch (error) {
        res.status(400).send('error occured while sending connection request: ' + error);
    }
})

/**
 * Handles user login.
 *
 * Process:
 * 1. Accepts email and plaintext password from the request body.
 * 2. Validates that both email and password are provided.
 * 3. Retrieves the user from the database using the provided email.
 * 4. If the user exists, compares the provided plaintext password with the hashed password stored in the database using bcrypt.
 * 5. Returns appropriate responses based on validation, authentication success, or failure.
 * 6. Handles errors gracefully and returns meaningful error messages.
 */


app.post('/login', async (req, res) => {
    
    try {
        const inputEmailId = req.body.emailId;
        const inputPassword = req.body.password;

        if (!inputEmailId && !inputPassword) {
            throw new Error("Email and Password missing");
        }
        else if(!inputEmailId) {
            throw new Error("Email missing");
        }
        else if(!inputPassword) {
            throw new Error("Password missing");
        }
        const result = await User.findOne({emailId: req.body.emailId});
        if(!result) {
            // throw new Error("User not present");
            throw new Error("Invalid credentials");
        }
        const compare = await result.validatePassword(inputPassword);
        if(!compare) {
            // throw new Error("Incorrect password");
            throw new Error("Invalid credentials");
        }
        const token = await result.getJWT();
        res.cookie('token', token, {expires: new Date(Date.now() + 24 * 3600000)});
        res.send('logged in');

    } catch (error) {
        res.status(300).send(`error occured while logging in: ${error}`);
    }

})

app.post('/profile', async(req, res) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            throw new Error("User logged out");
        }
        
        // finding id from token
        const {_id} = await jwt.verify(token, privateKey);

        // find id from given emailid
        const result = await User.findById(_id);

        res.send(result);
        
    } catch (error) {
        res.status(401).send(`error occured while getting profile: ${error}`);
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
    .catch((error) => {
        console.log('error occured', error);
    })


