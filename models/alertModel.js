const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema(
    {
        deviceId: { type: String, require: true },
        sensorType: { type: String, require: true },
        alert: { type: String, require: true },
    },
    {
        timestamps: true
    }
)

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;