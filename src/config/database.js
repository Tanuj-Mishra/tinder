const mongoose = require('mongoose');

const connectDB = async function () {
    await mongoose.connect('mongodb+srv://tanujtmmishra_db_user:Bk2s9LSLaYvkCF2O@tinder.ukx7evm.mongodb.net/?retryWrites=true&w=majority&appName=tinder');
}


module.exports = {connectDB};

