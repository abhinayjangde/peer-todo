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
    origin: [process.env.BASE_URL, process.env.FRONTEND_URL],
    methods: ["POST", "GET", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type","Authorization"],
    credentials: true
}))

db()

app.get("/health", (req, res)=>{

    res.send("health check")
})

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/todo", todoRoutes)

app.listen(PORT, ()=>{
    console.log(`server is running at http://localhost:${PORT}`)
})