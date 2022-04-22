const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const cors = require("cors");
const history = require("connect-history-api-fallback");

// configure app to use bodyParser()
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(cors());

// ROUTES FOR THE TRANSACTION API
// get an instance of the express Router
const router = express.Router();

const rootPath = "./";

// add default server icon
app.use(favicon(path.join(__dirname, rootPath, "favicon.ico")));

app.use(express.static(path.join(__dirname, rootPath)));

if (process.env.NODE_ENV === "production") {
  // test route to make sure everything is working
  router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, rootPath));
  });
}

// REGISTER OUR ROUTES
app.use("/", router);

const staticFileMiddleware = express.static(path.join(__dirname, rootPath));
app.use(staticFileMiddleware);
app.use(
  history({
    disableDotRule: true,
    verbose: true,
  })
);
app.use(staticFileMiddleware);


let port = 3000;
if (process.env.NODE_ENV === "development") {
  port = 3001;
}

// default port where dev server listens for incoming traffic
app.use(function (err, req, res) {
  // production error handler
  // no stacktraces leaked to user
  res.status(err.status || 500).json({
    message: err.message,
    error: err,
  });
});

let server = http.createServer(app);

// START THE SERVER
if (process.env.NODE_ENV === "production") {
  http.createServer(app).listen(port, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Backend server run at http://localhost:${port}\n`);
  });
} else {
  server.listen(port, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Backend server run at http://localhost:${port}\n`);
  });
}
