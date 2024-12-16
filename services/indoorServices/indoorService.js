const dataModel = require("../../models/dataModel")

const getHistoryData = async (dateFilter) => {
    try {
      let query = {};
  
      if (dateFilter) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
          const startOfDay = new Date(dateFilter);
          const endOfDay = new Date(dateFilter);
            console.log(startOfDay)
          endOfDay.setHours(23, 59, 59, 999);
            
          query = { createdAt: { $gte: startOfDay, $lte: endOfDay } };
          groupBy = { hour: { $hour: "$createdAt" }, sensorType: "$sensorType" };
        }
        else if (/^\d{4}-\d{2}$/.test(dateFilter)) {
          const [year, month] = dateFilter.split("-");
          const startOfMonth = new Date(year, month - 1, 1); 
          const endOfMonth = new Date(year, month, 0); 
  
          endOfMonth.setHours(23, 59, 59, 999);
          query = { createdAt: { $gte: startOfMonth, $lte: endOfMonth } };
          groupBy = { day: { $dayOfMonth: "$createdAt" }, sensorType: "$sensorType" };
        }
        else if (/^\d{4}$/.test(dateFilter)) {
          const startOfYear = new Date(dateFilter, 0, 1); 
          const endOfYear = new Date(dateFilter, 11, 31); 
            console.log(startOfYear)
          endOfYear.setHours(23, 59, 59, 999);
          query = { createdAt: { $gte: startOfYear, $lte: endOfYear } };
          groupBy = { month: { $month: "$createdAt" }, sensorType: "$sensorType" };
        }
      }
      aggregateResult = await dataModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: groupBy,
            avgValue: { $avg: "$value" },
          },
        },
        { $sort: { "_id.hour": 1, "_id.day": 1, "_id.month": 1 } },
      ]);
      const formattedResult = {};
      aggregateResult.forEach((item) => {
        const timeKey = item._id.hour || item._id.day || item._id.month;
        const sensorType = item._id.sensorType;
  
        if (!formattedResult[timeKey]) {
          formattedResult[timeKey] = {};
        }
        formattedResult[timeKey][sensorType] = parseFloat(item.avgValue.toFixed(2));
      });
  
      const resultArray = Object.keys(formattedResult).map((time) => ({
        time: time,
        ...formattedResult[time],
      }));
  
      return resultArray;

      return null;
    } catch (error) {
      console.error("Error fetching history data:", error);
      throw error;
    }
  };
  
module.exports = {
    getHistoryData
}