const mongoose = require("mongoose")

async function connectDB(uri) {
  if (!uri) {
    throw new Error("MONGO_URI não definido.")
  }

  mongoose.set("strictQuery", true)
  await mongoose.connect(uri)
  console.log(`MongoDB conectado em ${mongoose.connection.host}:${mongoose.connection.port}`)
}

module.exports = connectDB
