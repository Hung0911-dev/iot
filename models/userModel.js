const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        deviceId: { type: String, require: true },
        action: { type: String, require: true },
    }, 
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema);

module.exports = User;