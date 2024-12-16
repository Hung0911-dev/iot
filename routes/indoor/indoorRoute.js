const express = require('express');
const { getTemperatureDataSensor, getHumidityDataSensor, getGasDataSensor, getFlameDataSensor, getVibrationDataSensor, handleGetHistoryData } = require('../../controllers/indoorControllers/dataSensorControllers');


const router = express.Router();

router.get('/:userId/indoor/temperature', getTemperatureDataSensor)
router.get('/:userId/indoor/humidity', getHumidityDataSensor)
router.get('/:userId/indoor/gas', getGasDataSensor)
router.get('/:userId/indoor/flame', getFlameDataSensor)
router.get('/:userId/indoor/vibration', getVibrationDataSensor)
router.post('/indoor/getHistoryData', handleGetHistoryData)
module.exports = router;