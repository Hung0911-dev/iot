const express = require('express');
const { turnOffBuzzer, toggleLight } = require('../controllers/userControllers/userInteractController');

const router = express.Router();

// Define the POST route to turn off the buzzer
router.post('/buzzer', turnOffBuzzer);
router.post('/light', toggleLight)
module.exports = router;
