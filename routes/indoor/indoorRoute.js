const express = require('express');
const { getTemperatureDataSensor, getHumidityDataSensor, getGasDataSensor, getFlameDataSensor, getVibrationDataSensor, handleGetHistoryData, getAllIndoorData } = require('../../controllers/indoorControllers/dataSensorControllers');


const router = express.Router();

router.post('/getHistoryData', handleGetHistoryData)
router.post('/getIndoorHistoryData', getAllIndoorData)


module.exports = router;