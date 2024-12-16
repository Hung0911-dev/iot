const express = require('express');
const { 
    getAllTemperatureDataSensor, 
    getAllHumidityDataSensor, 
    getAllGasDataSensor, 
    getAllFlameDataSensor, 
    getAllVibrationDataSensor 
} = require('../../controllers/indoorControllers/dataSensorControllers');


const router = express.Router();

router.get('/data/temperature', getAllTemperatureDataSensor)
router.get('/data/humidity', getAllHumidityDataSensor)
router.get('/data/gas', getAllGasDataSensor)
router.get('/data/flame', getAllFlameDataSensor)
router.get('/data/vibration', getAllVibrationDataSensor)

module.exports = router;