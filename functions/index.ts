import functions from "firebase-functions";

import admin from "firebase-admin";
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


import express from "express";
import cors from "cors";

const app = express();
app.use(cors({origin: true}));


exports.app = functions.https.onRequest(app);