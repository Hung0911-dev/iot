const dataModel = require("../../models/dataModel");
const InDoor = require("../../models/InDoor");

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

      const findAllData = await InDoor.find({})
      .populate("temperature.deviceId gas.deviceId humidity.deviceId flame.deviceId vibration.deviceId")
      
      return findAllData
    }

    const aggregateResult = await InDoor.aggregate([
      { $match: query },
      {
        $project: {
          hour: { $hour: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          createdAt: 1,
          temperature: "$temperature.value",
          gas: "$gas.value",
          humidity: "$humidity.value",
          flame: "$flame.value",
          vibration: "$vibration.value"
        },
      },
      {
        $group: {
          _id: groupBy,
          avgTemperature: { $avg: "$temperature" },
          avgGas: { $avg: "$gas" },
          avgHumidity: { $avg: "$humidity" },
          flameCount: { $sum: { $cond: ["$flame", 1, 0] } },
          createdAt: { $first: "$createdAt" },
          vibrationCount: { $sum: { $cond: ["$vibration", 1, 0] } },
        },
      },
      { $sort: { "_id.hour": 1, "_id.day": 1, "_id.month": 1 } },

    ]);
    const formattedResult = {};
      aggregateResult.forEach((item) => {
        const timeKey = item._id.hour || item._id.day || item._id.month;
        formattedResult[timeKey] = {
          avgTemperature: item.avgTemperature ? parseFloat(item.avgTemperature.toFixed(2)) : null,
          avgGas: item.avgGas ? parseFloat(item.avgGas.toFixed(2)) : null,
          avgHumidity: item.avgHumidity ? parseFloat(item.avgHumidity.toFixed(2)) : null,
          flameCount: item.flameCount || 0,
          vibrationCount: item.vibrationCount || 0,
          createdAt: item.createdAt
        };
      });
      const resultArray = Object.keys(formattedResult).map((time) => ({
        time: time,
        ...formattedResult[time],
      }));
  
      return resultArray;
  } catch (error) {
    console.error("Error fetching history data:", error);
    throw error;
  }
};
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
        const findAllData = await InDoor.find({})
        .populate("temperature.deviceId gas.deviceId humidity.deviceId motionDetect.deviceId")
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
            gas: "$gas.value",
            humidity: "$humidity.value",
            flame: "$flame.value",
            vibration: "$vibration.value"
          },
        },
        {
          $group: {
            _id: groupBy,
            avgTemperature: { $avg: "$temperature" },
            avgGas: { $avg: "$gas" },
            avgHumidity: { $avg: "$humidity" },
            createdAt: { $first: "$createdAt" },
            
            flameCount: { $sum: { $cond: ["$flame", 1, 0] } },
            vibrationCount: { $sum: { $cond: ["$vibration", 1, 0] } },
          },
        },
        { $sort: { "_id.hour": 1, "_id.day": 1, "_id.month": 1 } },
      ]);
      const formattedResult = {};
      aggregateResult.forEach((item) => {
        const timeKey = item._id.hour || item._id.day || item._id.month;
        formattedResult[timeKey] = {
          avgTemperature: item.avgTemperature ? parseFloat(item.avgTemperature.toFixed(2)) : null,
          avgGas: item.avgGas ? parseFloat(item.avgGas.toFixed(2)) : null,
          avgHumidity: item.avgHumidity ? parseFloat(item.avgHumidity.toFixed(2)) : null,
          flameCount: item.flameCount || 0,
          vibrationCount: item.vibrationCount || 0,
          createdAt: item.createdAt
        };
      });
      const resultArray = Object.keys(formattedResult).map((time) => ({
        time: time,
        ...formattedResult[time],
      }));
  
      return resultArray;
    } catch (error) {
      console.error("Error fetching history data:", error);
      throw error;
    }
  };
const getTemperatureData = async (dateFilter, page ) => {
      let query = {};
      if (dateFilter) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
          const startOfDay = new Date(dateFilter);
          const endOfDay = new Date(dateFilter);
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
  } else {
    const skip = (page - 1) * 10
        const findAllData = await dataModel.find({
          sensorType: 'temperature'
        })
        .populate('deviceId')
        .limit(10)
        .skip(skip)
        return findAllData
  }
  const aggregateResult = await dataModel.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'devices',
        foreignField: '_id',
        localField: 'deviceId'
      }
    },
    {
      $group: {
        _id: groupBy,
        avgValue: { $avg: "$value" },
      },
    },
    { $sort: { "_id.hour": 1, "_id.day": 1, "_id.month": 1 } },
    { $skip: skip }, // Skip documents for pagination
    { $limit: limit }, // Limit documents for pagination
  ]);

  // Format the result
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
}
const getHumidityData = async (dateFilter, page ) => {
  let query = {};
  if (dateFilter) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
      const startOfDay = new Date(dateFilter);
      const endOfDay = new Date(dateFilter);
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
} else {
const skip = (page - 1) * 10
    const findAllData = await dataModel.find({
      sensorType: 'humidity'
    })
    .populate('deviceId')
    .limit(10)
    .skip(skip)
    return findAllData
}
const aggregateResult = await dataModel.aggregate([
{ $match: query },
    {
      $lookup: {
        from: 'devices',
        foreignField: '_id',
        localField: 'deviceId'
      }
    },
{
  $group: {
    _id: groupBy,
    avgValue: { $avg: "$value" },
  },
},
{ $sort: { "_id.hour": 1, "_id.day": 1, "_id.month": 1 } },
{ $skip: skip }, // Skip documents for pagination
{ $limit: limit }, // Limit documents for pagination
]);

// Format the result
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
}
const getGasData = async (dateFilter, page ) => {
  let query = {};
  if (dateFilter) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
      const startOfDay = new Date(dateFilter);
      const endOfDay = new Date(dateFilter);
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
  } else {
  const skip = (page - 1) * 10
      const findAllData = await dataModel.find({
        sensorType: 'gas'
      })
      .populate('deviceId')
      .limit(10)
      .skip(skip)
      return findAllData
  }
  const aggregateResult = await dataModel.aggregate([
  { $match: query },
  {
    $lookup: {
      from: 'devices',
      foreignField: '_id',
      localField: 'deviceId'
    }
  },
  {
    $group: {
      _id: groupBy,
      avgValue: { $avg: "$value" },
    },
  },
  { $sort: { "_id.hour": 1, "_id.day": 1, "_id.month": 1 } },
  { $skip: skip }, 
  { $limit: limit }, 
  ]);

  // Format the result
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
  }
 const getFlameAndVibrationCount = async (dateFilter) => {
  let query = {};
  let groupBy = {};
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
  }
  const aggregateResult = await InDoor.aggregate([
    { $match: query },
    {
      $project: {
        hour: { $hour: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
        month: { $month: "$createdAt" },
        createdAt: 1,
        flame: "$flame.value",
        vibration: "$vibration.value"
      },
    },
    {
      $group: {
        _id: groupBy,
        flameCount: { $sum: { $cond: ["$flame", 1, 0] } },
        createdAt: { $first: "$createdAt" },
        vibrationCount: { $sum: { $cond: ["$vibration", 1, 0] } },
      },
    },
    { $sort: { "_id.hour": 1, "_id.day": 1, "_id.month": 1 } },

  ]);
  const formattedResult = {};
    aggregateResult.forEach((item) => {
      const timeKey = item._id.hour || item._id.day || item._id.month;
      formattedResult[timeKey] = {
        flameCount: item.flameCount || 0,
        vibrationCount: item.vibrationCount || 0,
        createdAt: item.createdAt
      };
    });
    const resultArray = Object.keys(formattedResult).map((time) => ({
      time: time,
      ...formattedResult[time],
    }));

    return resultArray;
 }
module.exports = {
    getHistoryData,
    getTemperatureData,
    getHumidityData,
    getGasData,
    getTableHistoryData,
    getFlameAndVibrationCount
}