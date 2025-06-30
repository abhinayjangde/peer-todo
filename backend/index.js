import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"

import db from "./utils/db.js";
import userRoutes from "./routes/user.route.js"
import todoRoutes from "./routes/todo.route.js";

dotenv.config()

const app = express()

const PORT = process.env.PORT ?? 4000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.BASE_URL, 
            process.env.FRONTEND_URL,
            "http://localhost:5173", // for local development
            "http://localhost:4000"  // for local development
        ].filter(Boolean); // Remove any undefined values
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    methods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}))

db()

app.get("/", (req,res)=>{
    res.send("namaste")
})
app.get("/health", (req, res)=>{
    res.send("health check")
})

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/todo", todoRoutes)

app.listen(PORT, ()=>{
    console.log(`server is running at http://localhost:${PORT}`)
})