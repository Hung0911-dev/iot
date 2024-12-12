const mongoose = require('mongoose')

const userInteractSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        deviceId: { type: String, require: true },
        action: { type: String, require: true },
    }, 
    {
        timestamps: true
    }
)

const UserInteract = mongoose.model('UserInteract', userInteractSchema);

module.exports = UserInteract;