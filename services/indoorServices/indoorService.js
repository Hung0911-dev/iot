const dataModel = require("../../models/dataModel")

const getHistoryData = async (dateFilter, page) => {
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
      }else {
        const skip = (page - 1) * 10
        const findAllData = await dataModel.find({})
        .populate('deviceId')

        return findAllData
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
  const getFlameData = async (dateFilter, page) => {
    
  }
module.exports = {
    getHistoryData,
    getTemperatureData,
    getHumidityData,
    getGasData
}