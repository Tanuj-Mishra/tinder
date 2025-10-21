const express = require('express');
const cookieParser = require('cookie-parser');
const {database} = require('./config');
const apiRoutes = require('./routes');
const app = express();


app.use(express.json());
app.use(cookieParser());

app.use('/api', apiRoutes);



// app.post('/sendConnectionRequst', user.userAuth, async (req, res) => {
//     try {
//         res.send(`request was sent by: ${req.user.firstName} ${req.user.lastName}`)
//     } catch (error) {
//         res.status(400).send('error occured while sending connection request: ' + error);
//     }
// })




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

// app.patch('/users/:id', async (req, res) => {
//     try {
//         const ACCEPTABLE_INPUT = ["about", "photoUrl", "skills"];
//         let rejectedInputKeys = [];
//         for(const [key,val] of Object.entries(req.body)) {
//             if(!ACCEPTABLE_INPUT.includes(key)) {
//                 delete req.body[key];
//                 rejectedInputKeys.push(key);
//             }
//         }

//         if(req.body.skills?.length > 10) {
//             throw new Error("skills can't be more then 10")
//         }

//         const result = await User.findByIdAndUpdate(req.params.id, req.body,{runValidators: true});
//         res.send({result, rejectedInputKeys});
//     }
//     catch(error) {
//         res.status(300).send('error occured while updating: ' + error);
//     }
// })

// app.patch('/users/by-email/:emailId', async (req, res) => {
//     try {
//         const result = await User.findOneAndUpdate({emailId: req.params.emailId}, req.body);
//         res.send(result);
//     }
//     catch {
//         res.status(300).send('error occured while updating using emailid');
//     }
// })

// app.delete('/users/:id', async (req, res) => {
//     try {
//         const result = await User.findByIdAndDelete(req.params.id);
//         res.send(result);
//     }
//     catch{
//         res.status(300).send('some error occured while deleting the user');
//     }
// })

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


