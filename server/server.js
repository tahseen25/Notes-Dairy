require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./routes/auth-route");
const noteRouter = require("./routes/note-route");
const diaryRouter = require("./routes/diary-route");
const familyRouter= require("./routes/family-route")
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// Mount the Router: To use the router in your main Express app, you can "mount" it at a specific URL prefix
app.use("/api/auth", router);
app.use("/api/auth/note", noteRouter);
app.use("/api/auth/diary",diaryRouter);
app.use("/api/auth/family",familyRouter);


app.use(errorMiddleware);

const PORT = 5000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`);
  });
});