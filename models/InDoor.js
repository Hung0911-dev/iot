const mongoose = require('mongoose');

const inDoorSchema = new mongoose.Schema({
    humidity: { type: Number, required: true },
    fire: { type: Number, required: true, unique: true },
    gasValue: { type: Number, required: true },
    vibration: { type: Boolean, required: true },
    notification: { type: String, require: true },
});

const InDoor = mongoose.model('InDoor', inDoorSchema);

module.exports = InDoor;
