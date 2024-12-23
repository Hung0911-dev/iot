const { controlBuzzer } = require("../../services/indoorServices/userInteractService");
const { controlLight } = require("../../services/outdoorService/userInteractOutdoorService");

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
module.exports = { turnOffBuzzer, toggleLight };
