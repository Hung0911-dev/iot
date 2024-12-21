const mongoose = require('mongoose');

const outdoorSchema = new mongoose.Schema(
    {
        temperature: {
            type: {
                deviceId: {
                    type: mongoose.Schema.ObjectId,
                    required: true,
                    ref: 'Device'
                },
                value: Number
            },
            require: true,
            _id: false
        },
        airQuality: {
            type: {
                deviceId: {
                    type: mongoose.Schema.ObjectId,
                    required: true,
                    ref: 'Device'
                },
                value: Number
            },
            require: false,
            _id: false
        },
        humidity: {
            type: {
                deviceId: {
                    type: mongoose.Schema.ObjectId,
                    required: true,
                    ref: 'Device'
                },
                value: Number
            },
            required: false,
            _id: false
        },
        motionDetect: {
            type: {
                deviceId: {
                    type: mongoose.Schema.ObjectId,
                    required: true,
                    ref: 'Device'
                },
                value: Boolean,

            },
            _id: false
        },
    }
)

const Outdoor = mongoose.model('outdoor', outdoorSchema);

module.exports = Outdoor;
