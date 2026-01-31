import express, { Application } from "express"
const app:Application = express()

app.get('/',(req,res)=>{
    res.send("Ronaldo is the goat")
})
export default app