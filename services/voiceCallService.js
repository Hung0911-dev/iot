const accountSid = 'AC753705feba69281264c47d34f897c975';
const authToken = '0b8a35ac46c6ad7466816ccf8971782c';
const client = require('twilio')(accountSid, authToken);
const makeCall = async () => {
    console.log("Starting makeCall function...");
    try {
        const execution = await client.studio.v2
            .flows('FW78c90c59eea159afbdbb53783c8f9776')
            .executions.create({
                to: '+840327257659',
                from: '+12542762476',
            });
        console.log("Execution SID:", execution.sid);
    } catch (error) {
        console.error("Error in makeCall:", error.message);
    }
};
module.exports = {
    makeCall
}

