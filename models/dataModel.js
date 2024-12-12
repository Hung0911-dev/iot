const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema(
    {
        deviceId: { type: String, required: true },
        sensorType: { type: String, required: true },
        value: { type: Double, required: true }
    },
    {
        timestamps: true
    }
)

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;