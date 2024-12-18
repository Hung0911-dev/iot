const { controlBuzzer } = require("../../services/indoorServices/userInteractService");

const turnOffBuzzer = async (req, res) => {

    try{
        const { userId, command } = req.body;
        await controlBuzzer(userId, command);
        return res.status(200).json({ message: `Buzzer turn ${command} sent successfully`})
    } catch (error) {
        return res.status(500).json({ message: `Failed to send turn ${command} command: `, error: error })
    }

};

module.exports = { turnOffBuzzer };
