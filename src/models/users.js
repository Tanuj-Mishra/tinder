const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const privateKey = 'abra_ka_dabra';

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
            lowercase: true,
            validate(value) {
                if(!validator.isEmail(value)) {
                    throw new Error("incorrect email id");
                }
            }
        },
        password: {
            type: String,
            require: true,
            trim: true,
            unique: true,
            validate(value) {
                if(!validator.isStrongPassword(value)) {
                    throw new Error("weak password");
                }
            }
        },
        age: {
            type: Number,
            min: 18
        },
        photoUrl: {
            type: String,
            default: "https://wallpapers.com/images/high/cool-profile-picture-ld8f4n1qemczkrig.webp",
            validate(value) {
                if(!validator.isURL(value)) {
                    throw new Error("invalid url");
                }
            }
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
            enum: {
                values: ["male", "female"],
                // message: `${VALUE} is not valid gender`
            },
            // validate: (value) => {
            //     if(!["male", "female"].includes(value)) {
            //         throw new Error("incorrect gender provided");        
            //     }
            //     else {
            //         return true;
            //     }
            // }
        }
    }, 
    {
        timestamps: true
    }
)


userSchema.methods.getJWT = async function() {
    return await jwt.sign({_id: this._id}, privateKey, {expiresIn: '1d'});
}

userSchema.methods.validatePassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);