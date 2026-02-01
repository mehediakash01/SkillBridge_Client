import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express"
import cors from "cors"
import { auth } from "./auth.js";
const app:Application = express()

app.use(express.json())
app.use(cors({
  origin:process.env.APP_URL ||"http://localhost:5000",
    credentials:true
}
  
   
))
app.all('/api/auth/{*any}', toNodeHandler(auth));

app.get('/',(req,res)=>{
    res.send("Ronaldo is the goat")
})
export default app