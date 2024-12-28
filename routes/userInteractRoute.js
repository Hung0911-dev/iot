const express = require('express');
const { turnOffBuzzer, toggleLight, handleGetOutdoorInteract, handleGetIndoorInteract } = require('../controllers/userControllers/userInteractController');

const router = express.Router();

// Define the POST route to turn off the buzzer
router.post('/buzzer', turnOffBuzzer);
router.post('/light', toggleLight)
router.post('/getOutdoorInteract', handleGetOutdoorInteract)
router.post('/getIndoorInteract', handleGetIndoorInteract)

module.exports = router;
