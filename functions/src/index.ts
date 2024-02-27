import functions = require("firebase-functions");
import admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


import express = require("express");
import cors = require("cors");

const app = express();
app.use(cors({origin: true}));

app.get('/', (req, res) => {
   return res.status(200).send("Hi"); 
});

exports.app = functions.https.onRequest(app);