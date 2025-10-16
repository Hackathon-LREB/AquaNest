import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import ussdRoutes from "./routes/ussdRoutes.js";
import connectDB from "./config/db.js";
dotenv.config();
const app = express();

// Africa’s Talking sends data as application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Mount the USSD route
app.use("/ussd", ussdRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async() => {
 try {
  await connectDB();
  console.log(`USSD app running on port ${PORT}`);
 } catch (er) {
  console.log(er);
 }
});
