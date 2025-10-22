const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionRequestSchema = new Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true
        },
        status: {
            type: String,
            require: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                // message: `${VALUES} is not acceptable status`
            }
        }
    },
    {
        timestamps: true
    }

);

connectionRequestSchema.pre('save', function(next) {
    
    if(this.toUserId.equals(this.fromUserId)) {
        throw new Error("atleast find someone else here");
    }

    next();
})

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);