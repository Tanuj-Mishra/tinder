const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            require: true,
            minLength: 3,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        emailId: {
            type: String,
            require: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            require: true,
            trim: true,
            unique: true
        },
        age: {
            type: Number,
            min: 18
        },
        photoUrl: {
            type: String,
            default: "https://wallpapers.com/images/high/cool-profile-picture-ld8f4n1qemczkrig.webp"
        },
        about: {
            type: String,
            default: "software engineer"
        },
        skills: {
            type: [String]
        },
        gender: {
            type: String,
            validate: (value) => {
                if(!["male", "female"].includes(value)) {
                    throw new Error("incorrect gender provided");        
                }
                else {
                    return true;
                }
            }
        }
    }, 
    {
        timestamps: true
    }
)


module.exports = mongoose.model('User', userSchema);