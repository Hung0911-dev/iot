const express = require('express');
const { getAllOutdoorData } = require('../../controllers/outdoorControllers/dataSensorController');

const router = express.Router();

// router.post('/getHistoryData', handleGetHistoryData)
router.post('/getOutdoorHistoryData', getAllOutdoorData)
// router.post('/getTableHistoryData', getTableData)

module.exports = router;