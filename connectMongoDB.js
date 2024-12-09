const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("Connect to MongoDB successfully")
            console.log(mongoose.connection.db)
        })
    } catch (error) {
        console.log("Connect failed " + error.message )
    }
}

module.exports = connectDB