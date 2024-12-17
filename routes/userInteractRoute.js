const express = require('express');
const { turnOffBuzzer } = require('../controllers/userControllers/userInteractController');

const router = express.Router();

// Define the POST route to turn off the buzzer
router.post('/buzzer', turnOffBuzzer);

module.exports = router;
