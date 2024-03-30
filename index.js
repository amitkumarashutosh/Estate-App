import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const port = process.env.PORT || 3001;

//middlewares
app.use(express.json());
app.use(cookieParser());

//routes
import userRouter from "./server/src/routes/user.route.js";
import listingRouter from "./server/src/routes/listing.route.js";

app.use("/api/auth", userRouter);
app.use("/api/listing", listingRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "client/dist")));
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

//not found
import notFound from "./server/src/utils/notFound.js";

app.use(notFound);

//database
import connectDB from "./server/src/db/index.js";

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
