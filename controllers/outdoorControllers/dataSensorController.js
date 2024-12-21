const { getHistoryData } = require("../../services/outdoorService/outdoorService")

const getAllOutdoorData = async (req, res) => {
    try{
        const date = req.body.date
        console.log(date)
        const data = await getHistoryData(date, null) 
        return res.json(data)
    } catch(err){
        console.log(err)
    }
}
module.exports={
    getAllOutdoorData
}