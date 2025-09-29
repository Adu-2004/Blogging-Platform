import mongoose from 'mongoose';

const mongo_url = process.env.MONGO_URI;
/*
mongoose.connect(mongo_url)
    .then(() => {
         console.log("MongoDB Connected...");
    }).catch((err) => {
         console.log("MongoDB Connection Error:", err);
    });
*/
export async function connectToMongoDB() {
    try {
        await mongoose.connect(mongo_url);
        console.log("MongoDB Connected...");
    } catch (err) {
        console.log("MongoDB Connection Error:", err);
    }
}