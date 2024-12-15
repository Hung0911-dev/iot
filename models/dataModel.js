const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema(
    {
        deviceId: { type: String, required: true },
        sensorType: { type: String, required: true },
        value: { type: Number, default: 0, required: true }
    },
    {
        timestamps: true
    }
)

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;