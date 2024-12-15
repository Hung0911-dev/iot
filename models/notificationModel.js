const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
    {
        userId: { type: String, require: true },
        deviceId: { type: String, require: true },
        alert: { type: String, require: true },
    },
    {
        timestamps: true
    }
)

const Noti = mongoose.model('Noti', notificationSchema);

module.exports = Noti;