require('dotenv').config();

const express = require("express");
const app = express();
const hana = require("@sap/hana-client");
const port = process.env.port || 8000;
const { JWTStrategy } = require("@sap/xssec");
const xsenv = require("@sap/xsenv");
const passport = require("passport");


//passport.use(new JWTStrategy(xsenv.getServices({ xsuaa: { tag: "xsuaa" } }).xsuaa));

const connOptions = {
  serverNode: "0b3bfb3a-ab5a-4537-a531-07e78a0f02d5.hana.trial-us10.hanacloud.ondemand.com:443",
  encrypt: "true",
  sslValidateCertificate: "false",
  uid: "DBADMIN",
  pwd: "Vasu@1234",
};

// app.use(passport.initialize());
// app.use(passport.authenticate("JWT", { session: false }));

app.get("/", (req, res, next) => {
  res.send("Welcome to IoT dashboard");
});


app.get("/salesData", async (req, res) => {
  try {
    const data = await fetchSalesData();
    res.type("application/json").status(200).send({sales : data});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function fetchSalesData() {
  return new Promise((resolve, reject) => {
    const dbConnection = hana.createConnection();
    dbConnection.connect(connOptions, function (err) {
      if (err) reject(err);
      else {
        dbConnection.exec('SELECT * FROM PLAIN.SALESDATA', function (err, result) {
          if (err) reject(err);
          else {
            dbConnection.disconnect();
            resolve(result);
          }
        });
      }
    });
  });
}

app.get("/sensorData", async (req, res) => {
  try {
    const data = await fetchSensorData();
    res.type("application/json").status(200).send({sensor : data});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function fetchSensorData() {
  return new Promise((resolve, reject) => {
    const dbConnection = hana.createConnection();
    dbConnection.connect(connOptions, function (err) {
      if (err) reject(err);
      else {
        dbConnection.exec('SELECT * FROM PLAIN.SENSORDATA ORDER BY ID DESC LIMIT 1', function (err, result) {
          if (err) reject(err);
          else {
            dbConnection.disconnect();
            resolve(result);
          }
        });
      }
    });
  });
}

function checkScope(req, res, next) {
  if (req.authInfo.checkLocalScope("read")) {
    next();
  } else {
    res.status(403).end("Forbidden");
  }
}
app.listen(port, console.log(`Listening on port ${port}`));
