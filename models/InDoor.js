const mongoose = require('mongoose');

const inDoorSchema = new mongoose.Schema({
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
    flame: { 
        type: {
                    deviceId: {
                        type: mongoose.Schema.ObjectId,
                        required: true,
                        ref: 'Device'
                    },
                    value: Boolean,
    
                },
                _id: false },
    gas: { type: {
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
    vibration: { type: {
                    deviceId: {
                        type: mongoose.Schema.ObjectId,
                        required: true,
                        ref: 'Device'
                    },
                    value: Boolean,
    
                },
                _id: false },
},
{
    timestamps: true
}

);

const InDoor = mongoose.model('InDoor', inDoorSchema);

module.exports = InDoor;
