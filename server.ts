import express, { Application } from "express";
import env from "dotenv";
import { connectDB } from "./config/database";
import authRoutes from "./router/auth.routes"
env.config()

const app:Application = express();

app.get("/health", (req, res) => {
    res.send("Hello, World!");
});

app.use(express.json());
app.use("/api/auth",authRoutes)
async function startServer(){
try{
await connectDB()
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
}catch(err:any){
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
}
}

startServer()