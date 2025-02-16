/*
|--------------------------------------------------------------------------
 * @author Mohammad Ehsan
 * @Date: 2023-02-07 15:02:40
 * @Last Modified by: Ehsan
 * @Last Modified time: 2023-02-07 15:02:40
|--------------------------------------------------------------------------
*/
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const http = require("http");
const moment = require("moment");

// internal imports
const loginRoute = require("./router/loginRoute");
const userRoute = require("./router/userRoute");
const inboxRoute = require("./router/inboxRoute");

/*
|--------------------------------------------------------------------------
| internal modules importer
|--------------------------------------------------------------------------
*/
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");

/*
|--------------------------------------------------------------------------
| express app
|--------------------------------------------------------------------------
*/
const app = express();

/*
|--------------------------------------------------------------------------
| socket  creation
|--------------------------------------------------------------------------
*/
const server = http.createServer(app);
dotenv.config();
const io = require("socket.io")(server);
global.io = io;

/*
|--------------------------------------------------------------------------
| moment  set globally
|--------------------------------------------------------------------------
*/

app.locals.moment = moment;

/*
|--------------------------------------------------------------------------
| dotenv
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| database connetion
|--------------------------------------------------------------------------
*/
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));
/*
|--------------------------------------------------------------------------
| request parser
|--------------------------------------------------------------------------
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| set view engine
|--------------------------------------------------------------------------
*/
app.set("view engine", "ejs");
/*
|--------------------------------------------------------------------------
| set static folder
|--------------------------------------------------------------------------
*/

app.use(express.static(path.join(__dirname, "public")));
/*
|--------------------------------------------------------------------------
| parse cookies
|--------------------------------------------------------------------------
*/

app.use(cookieParser(process.env.COOKIE_SECRET));
/*
|--------------------------------------------------------------------------
| routes
|--------------------------------------------------------------------------
*/

app.use("/", loginRoute);
app.use("/users", userRoute);
app.use("/inbox", inboxRoute);

/*
|--------------------------------------------------------------------------
| error handler
|--------------------------------------------------------------------------
*/
// 404 not found handler
app.use(notFoundHandler);
// common error handler
app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| app listen
|--------------------------------------------------------------------------
*/

app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
});
