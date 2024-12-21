const express = require('express');
const { getTemperatureDataSensor, getHumidityDataSensor, getGasDataSensor, getFlameDataSensor, getVibrationDataSensor, handleGetHistoryData, getAllIndoorData, getTableData } = require('../../controllers/indoorControllers/dataSensorControllers');


const router = express.Router();

router.post('/getHistoryData', handleGetHistoryData)
router.post('/getIndoorHistoryData', getAllIndoorData)
router.post('/getTableHistoryData', getTableData)

module.exports = router;