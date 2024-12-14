const mongoose = require('mongoose')

const detectSchema = new mongoose.Schema(
    {
        deviceId: { type: String, required: true },
        sensorType: { type: String, required: true },
        value: { type: Boolean, default: false, required: true }
    },
    {
        timestamps: true
    }
)

const Detect = mongoose.model('Detect', detectSchema);

module.exports = Detect;