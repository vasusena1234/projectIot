"use strict";
var hana = require("@sap/hana-client");

var connOptions = {
  serverNode: "0b3bfb3a-ab5a-4537-a531-07e78a0f02d5.hana.trial-us10.hanacloud.ondemand.com:443",
  encrypt: "true",
  sslValidateCertificate: "false",
  uid: "DBADMIN",
  pwd: "Vasu@1234",
};


const axois = require("axios");

axois.get("https://0fda-103-110-144-77.ngrok-free.app/")
    .then(response => {
        //console.log(response.data);

        var dbConnection = hana.createConnection();

        dbConnection.connect(connOptions, function (err) {
        if (err) throw err;
        dbConnection.exec(
            'INSERT INTO PLAIN.SENSORDATA VALUES(' + response.data.unique_Id  + ',' + response.data.temperature + ',' + response.data.humidity +')',
            //'INSERT INTO PLAIN.SENSORDATA VALUES(2,34,44)',
            function (err, result) {
            if (err) throw err;
            console.log(result);
            dbConnection.disconnect();
            }
        );
        });

    })
    .catch((error) => {
        console.log(error);
    })
