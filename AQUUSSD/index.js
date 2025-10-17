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





app.get('/', (req, res) => {
    res.send(`
      <h1>Welcome to AquaNest AWS Hosting Test</h1>
      <p>
        This server file (index.js) is being used to test AWS hosting and confirm that
        the Express application is running successfully on the deployed instance.
      </p>
      <p>
        If you can see this message in your browser, it means the AWS EC2 instance is
        correctly configured, the server is running, and the package.json entry point
        is set up properly.
      </p>
      <p>
        You can now proceed to connect your backend services, database, or other routes.
        Hosting verification successful — AquaNest backend is live on AWS!
      </p>
    `);
  });
  
app.listen(PORT, async() => {
 try {
  await connectDB();
  console.log(`USSD app running on port ${PORT}`);
 } catch (er) {
  console.log(er);
 }
});
