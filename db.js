import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Connects to the URI stored in your .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;