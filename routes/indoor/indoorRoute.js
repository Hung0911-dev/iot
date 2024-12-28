const express = require('express');
const { getTemperatureDataSensor, getHumidityDataSensor, getGasDataSensor, getFlameDataSensor, getVibrationDataSensor, handleGetHistoryData, getAllIndoorData, getTableData, handleGetFlameAndVibrationCount } = require('../../controllers/indoorControllers/dataSensorControllers');


const router = express.Router();

router.post('/getHistoryData', handleGetHistoryData)
router.post('/getIndoorHistoryData', getAllIndoorData)
router.post('/getTableHistoryData', getTableData)
router.post('/getFlameAndVibrationCount', handleGetFlameAndVibrationCount)
module.exports = router;