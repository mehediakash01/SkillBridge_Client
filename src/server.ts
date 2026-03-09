
import app from "./lib/app.js";
import { prisma } from "./lib/prisma.js"

// Export the Express app as default for Vercel serverless
export default app;

const PORT = process.env.PORT || 5000
const main = async ()=>{
   
    try{
    await prisma.$connect()
    console.log("connected to database successfully");
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })

    }
    catch(error)
    {

console.log("An error occurred",error);
prisma.$disconnect()
process.exit(1)
    }

}

// Only call app.listen() in local dev – Vercel runs serverless via the export above
if (process.env.VERCEL !== "1") {
    main();
}