import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express"
import cors from "cors"
import { auth } from "./auth.js";
import globalErrorHandler from "../middlewares/globalErrorHandler.js";
import { createTutor } from "../modules/tutor/tutor.router.js";
import { bookingRouter } from "../modules/booking/booking.router.js";


const app:Application = express()
app.use(globalErrorHandler);
app.use(express.json())
app.use(cors({
  
  origin:process.env.APP_URL ||"http://localhost:5000",
    credentials:true
}
  
   
))
app.all('/api/auth/{*any}', toNodeHandler(auth));
// tutor routes
app.use('/api/tutor',createTutor)
// booking routes
app.use('/api/bookings',bookingRouter)
app.get('/',(req,res)=>{
    res.send("Ronaldo is the goat")
})
export default app