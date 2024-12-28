const { controlBuzzer, getIndoorInteract } = require("../../services/indoorServices/userInteractService");
const { controlLight, getOutdoorInteract } = require("../../services/outdoorService/userInteractOutdoorService");

const turnOffBuzzer = async (req, res) => {

    try{
        const { userId, command } = req.body;
        await controlBuzzer(userId, command);
        return res.status(200).json({ message: `Buzzer turn ${command} sent successfully`})
    } catch (error) {
        return res.status(500).json({ message: `Failed to send turn ${command} command: `, error: error })
    }

};
const toggleLight =  async (req, res) => {
    try{
        const { userId, command } = req.body;
        await controlLight(userId, command);
        return res.status(200).json({ message: `Light turn ${command} sent successfully`})
    } catch (error) {
        return res.status(500).json({ message: `Failed to send turn ${command} command: `, error: error })
    }
}
const handleGetOutdoorInteract = async (req, res) => {
    const date = req.body.date
        const data = await getOutdoorInteract(date)
        return res.json(data)
}
const handleGetIndoorInteract = async (req, res) => {
    const date = req.body.date

    const data = await getIndoorInteract(date)
    return res.json(data)
}
module.exports = { turnOffBuzzer, toggleLight, handleGetOutdoorInteract, handleGetIndoorInteract };
