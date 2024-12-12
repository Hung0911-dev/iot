const mongoose = require('mongoose')

const deviceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        location: { type: String, required: true },
        status: { type: Boolean, required: true },
        typeDevice: { type: String, required: true },
        type: { type: String, required: true } // Indentify whether is a detect sensor or value sensor
    },
    {
        timestamps: true
    }
)

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;