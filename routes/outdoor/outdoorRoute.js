const express = require('express');
const { getAllOutdoorData, getHistoryTableData } = require('../../controllers/outdoorControllers/dataSensorController');

const router = express.Router();

// router.post('/getHistoryData', handleGetHistoryData)
router.post('/getOutdoorHistoryData', getAllOutdoorData)
router.post('/getTableHistoryData', getHistoryTableData)

module.exports = router;