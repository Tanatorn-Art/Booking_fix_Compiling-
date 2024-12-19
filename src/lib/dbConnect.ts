import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database'

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return

  return mongoose.connect(MONGODB_URI)
}

export default dbConnect