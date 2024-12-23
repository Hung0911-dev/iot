const Outdoor = require("../../models/Outdoor")

const getAllOutdoorData = async () => {
    const data = await Outdoor.find({})
    .populate('temperature.deviceId')
    .populate('airQuality.deviceId')
    .populate('humidity.deviceId')
    .populate('motionDetect.deviceId')
    return data

}
const getHistoryData = async (dateFilter, page) => {
    try {
      let query = {};
  
      if (dateFilter) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
          const startOfDay = new Date(dateFilter);
          const endOfDay = new Date(dateFilter);
          endOfDay.setHours(23, 59, 59, 999);
          query = { createdAt: { $gte: startOfDay, $lte: endOfDay } };
          groupBy = { hour: { $hour: "$createdAt" }};
        }
        else if (/^\d{4}-\d{2}$/.test(dateFilter)) {
          const [year, month] = dateFilter.split("-");
          const startOfMonth = new Date(year, month - 1, 1); 
          const endOfMonth = new Date(year, month, 0); 
  
          endOfMonth.setHours(23, 59, 59, 999);
          query = { createdAt: { $gte: startOfMonth, $lte: endOfMonth } };
          groupBy = { day: { $dayOfMonth: "$createdAt" }};
        }
        else if (/^\d{4}$/.test(dateFilter)) {
          const startOfYear = new Date(dateFilter, 0, 1); 
          const endOfYear = new Date(dateFilter, 11, 31); 
            console.log(startOfYear)
          endOfYear.setHours(23, 59, 59, 999);
          query = { createdAt: { $gte: startOfYear, $lte: endOfYear } };
          groupBy = { month: { $month: "$createdAt" }};
        }
      }else {
        const skip = (page - 1) * 10
        const findAllData = await Outdoor.find({})
        .populate("temperature.deviceId airQuality.deviceId humidity.deviceId motionDetect.deviceId")
        return findAllData
      }
      const aggregateResult = await Outdoor.aggregate([
        { $match: query },
        {
          $project: {
            hour: { $hour: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            createdAt: 1,
            temperature: "$temperature.value",
            airQuality: "$airQuality.value",
            humidity: "$humidity.value",
            motionDetect: "$motionDetect.value",
          },
        },
        {
          $group: {
            _id: groupBy,
            avgTemperature: { $avg: "$temperature" },
            avgAirQuality: { $avg: "$airQuality" },
            avgHumidity: { $avg: "$humidity" },
            motionDetectCount: { $sum: { $cond: ["$motionDetect", 1, 0] } },
          },
        },
        { $sort: { "_id.hour": 1, "_id.day": 1, "_id.month": 1 } },
      ]);
    const formattedResult = {};
    aggregateResult.forEach((item) => {
      const timeKey = item._id.hour || item._id.day || item._id.month;
      formattedResult[timeKey] = {
        avgTemperature: item.avgTemperature ? parseFloat(item.avgTemperature.toFixed(2)) : null,
        avgAirQuality: item.avgAirQuality ? parseFloat(item.avgAirQuality.toFixed(2)) : null,
        avgHumidity: item.avgHumidity ? parseFloat(item.avgHumidity.toFixed(2)) : null,
        motionDetectCount: item.motionDetectCount || 0,
      };
    });

    const resultArray = Object.keys(formattedResult).map((time) => ({
      time,
      ...formattedResult[time],
    }));

    return resultArray;
    } catch (error) {
      console.error("Error fetching history data:", error);
      throw error;
    }
  };
const getTableHistoryData = async (dateFilter, page) => {
  try {
    let query = {};

    if (dateFilter) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
        const startOfDay = new Date(dateFilter);
        const endOfDay = new Date(dateFilter);
        endOfDay.setHours(23, 59, 59, 999);
        query = { createdAt: { $gte: startOfDay, $lte: endOfDay } };
        groupBy = { hour: { $hour: "$createdAt" }};
      }
      else if (/^\d{4}-\d{2}$/.test(dateFilter)) {
        const [year, month] = dateFilter.split("-");
        const startOfMonth = new Date(year, month - 1, 1); 
        const endOfMonth = new Date(year, month, 0); 

        endOfMonth.setHours(23, 59, 59, 999);
        query = { createdAt: { $gte: startOfMonth, $lte: endOfMonth } };
        groupBy = { day: { $dayOfMonth: "$createdAt" }};
      }
      else if (/^\d{4}$/.test(dateFilter)) {
        const startOfYear = new Date(dateFilter, 0, 1); 
        const endOfYear = new Date(dateFilter, 11, 31); 
          console.log(startOfYear)
        endOfYear.setHours(23, 59, 59, 999);
        query = { createdAt: { $gte: startOfYear, $lte: endOfYear } };
        groupBy = { month: { $month: "$createdAt" }};
      }
    }else {
      const skip = (page - 1) * 3;
      const findAllData = await Outdoor.find({})
      .populate("temperature.deviceId airQuality.deviceId humidity.deviceId motionDetect.deviceId")
      .skip(skip)
      .limit(3);
      return findAllData
    }
    const aggregateResult = await Outdoor.aggregate([
      { $match: query },
      {
        $project: {
          hour: { $hour: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          createdAt: 1,
          temperature: "$temperature.value",
          airQuality: "$airQuality.value",
          humidity: "$humidity.value",
          motionDetect: "$motionDetect.value",
        },
      },
      {
        $group: {
          _id: groupBy,
          avgTemperature: { $avg: "$temperature" },
          avgAirQuality: { $avg: "$airQuality" },
          avgHumidity: { $avg: "$humidity" },
          createdAt: { $first: "$createdAt" },
          motionDetectCount: { $sum: { $cond: ["$motionDetect", 1, 0] } },
        },
      },
      { $sort: { "_id.hour": 1, "_id.day": 1, "_id.month": 1 } },
      { $skip: (page - 1) * 3 }, 
      { $limit: 3 },
    ]);
    const formattedResult = {};
  aggregateResult.forEach((item) => {
    const timeKey = item._id.hour || item._id.day || item._id.month;
    formattedResult[timeKey] = {
      avgTemperature: item.avgTemperature ? parseFloat(item.avgTemperature.toFixed(2)) : null,
      avgAirQuality: item.avgAirQuality ? parseFloat(item.avgAirQuality.toFixed(2)) : null,
      avgHumidity: item.avgHumidity ? parseFloat(item.avgHumidity.toFixed(2)) : null,
      motionDetectCount: item.motionDetectCount || 0,
      createdAt: item.createdAt
    };
  });

  const resultArray = Object.keys(formattedResult).map((time) => ({
    time,
    ...formattedResult[time],
  }));

  return resultArray;
  } catch (error) {
    console.error("Error fetching history data:", error);
    throw error;
  }
}
module.exports={
    getAllOutdoorData,
    getHistoryData,
    getTableHistoryData
}