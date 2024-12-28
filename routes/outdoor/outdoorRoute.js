const express = require('express');
const { getAllOutdoorData, getHistoryTableData, handleCountMotion } = require('../../controllers/outdoorControllers/dataSensorController');

const router = express.Router();

// router.post('/getHistoryData', handleGetHistoryData)
router.post('/getOutdoorHistoryData', getAllOutdoorData)
router.post('/getTableHistoryData', getHistoryTableData)
router.post('/countMotion', handleCountMotion)
module.exports = router;