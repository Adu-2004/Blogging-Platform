import express from "express"
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { connectToMongoDB } from "./models/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import blogRoutes from "./routes/blogRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import router from "./routes/chatRoutes.js";

const app = express();

await connectToMongoDB()

//Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//Routes
app.get('/', (req, res) => {  res.send('Hello Aditya');})
app.use('/api/admin', adminRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/auth',authRoutes);
app.use("/api/user", userRoutes);
app.use('/api/chat',router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

export default app;