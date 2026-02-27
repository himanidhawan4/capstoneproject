import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "A title is required"],
        trim: true
    },
    content: {
        type: String,
        required: [true, "Journal content cannot be empty"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, // Connects to the User's unique ID
        ref: 'User', // Tells Mongoose which model this ID belongs to
        required: true
    },
    tags: {
        type: [String],
        default: []
    }
    , // Optional: to categorize posts like #work or #personal
}, { timestamps: true });

export default mongoose.model("Post", PostSchema);