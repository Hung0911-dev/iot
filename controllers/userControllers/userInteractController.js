const { controlBuzzer } = require("../../services/indoorServices/userInteractService");

const turnOffBuzzer = async (req, res) => {

    try{
        const { userId, cooldown } = req.body;
        await controlBuzzer(userId, cooldown);
        return res.status(200).json({ message: "Buzzer turn off command sent successfully"})
    } catch (error) {
        return res.status(500).json({ message: "Failed to send turn off command: ", error: error })
    }

};

module.exports = { turnOffBuzzer };
