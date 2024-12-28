const { getHistoryData, getTableHistoryData, countMotion } = require("../../services/outdoorService/outdoorService")

const getAllOutdoorData = async (req, res) => {
    try{
        const date = req.body.date
        const data = await getHistoryData(date, null) 
        return res.json(data)
    } catch(err){
        console.log(err)
    }
}
const getHistoryTableData = async (req, res) => {
    try{
        const date = req.body.date
        const page = parseInt(req.query.page)
        const data = await getTableHistoryData(date, page) 
        return res.json(data)
    } catch(err){
        console.log(err)
    }
}
const handleCountMotion = async (req, res) => {
    try{
        const date = req.body.date
        const data = await countMotion(date) 
        return res.json(data)
    } catch(err){
        console.log(err)
    }
}
module.exports={
    getAllOutdoorData,
    getHistoryTableData,
    handleCountMotion
}