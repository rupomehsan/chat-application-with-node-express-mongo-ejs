// external imports
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const cors = require("cors");
const formData = require("express-form-data");
// internal route imports
const loginRouter = require("./router/loginRouter");
const homeRouter = require("./router/homeRouter");
const usersRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");
const postRouter = require("./router/postRouter");

// internal route imports
const bodyParser = require("body-parser");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");

const app = express();
const server = http.createServer(app);
dotenv.config();

// socket creation
const io = require("socket.io")(server);
global.io = io;

// set comment as app locals
app.locals.moment = moment;

// database connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log(err));

// request parsers
app.use(cors());
app.use(express.json());
// app.use(upload.any());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(formData.parse());
app.use("/", express.static("public"));
// set view engine
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use(loginRouter);
app.use("/", homeRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);
app.use("/post", postRouter);

// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`app listening to port ${process.env.PORT}`);
});
