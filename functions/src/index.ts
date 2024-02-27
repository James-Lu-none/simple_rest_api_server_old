import functions = require("firebase-functions");
import admin = require("firebase-admin");
import serviceAccount from "../serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(JSON.stringify(serviceAccount)),
});

import express = require("express");
import cors = require("cors");
const db = admin.firestore();
const pcStatusCollection = db.collection("pc_status");
const app = express();
app.use(cors({origin: true}));

app.get("/", (req, res) => {
  return res.status(200).send("Hi");
});

app.get("/api/pc_status/get", (req, res) => {
  (async () => {
    try {
      const pcId = req.query.pc_id;
      console.log(pcId);
      if (pcId === null || typeof pcId !== "string") {
        throw Error("pc id was invalid");
      }
      // const data = await pc_status_collection.doc(pcId).get();
      let response;
      await pcStatusCollection
        .doc(pcId)
        .get()
        .then((data) => {
          response = data.data();
          return response;
        });
      return res
        .status(200)
        .send({status: "Success", data: response, msg: "Data retrieved"});
    } catch (error) {
      console.log(error);
      return res.status(500).send({status: "Failed", msg: error});
    }
  })();
});

app.put("/api/pc_status/set", (req, res) => {
  (async () => {
    console.log(req.params);
    console.log(req.body);
    try {
      let data = {};
      const pcId = req.query.pc_id;
      console.log(pcId);
      if (pcId === null || typeof pcId !== "string") {
        throw Error("pc id was invalid");
      }
      data = assignBooleanIfNotNullOrUndefined("isPcOn", req.body.isPcOn, data);
      data = assignBooleanIfNotNullOrUndefined(
        "isPowerOnTriggered",
        req.body.isPowerOnTriggered,
        data
      );
      console.log(data);
      await pcStatusCollection.doc(pcId).update(data);
      return res.status(200).send({status: "Success", msg: "Data updated"});
    } catch (error) {
      console.log(error);
      return res.status(500).send({status: "Failed", msg: error});
    }
  })();
});

/**
 * @param {string} property - The property name to be assigned.
 * @param {boolean} value - The boolean value to be assigned.
 * @param {object} data - The object to which the boolean property is assigned.
 * @return {object} - The updated object.
 */
function assignBooleanIfNotNullOrUndefined(
  property: string,
  value: boolean,
  data: object
): object {
  if (value !== null && value !== undefined && typeof value === "boolean") {
    data = Object.assign({[property]: value}, data);
  }
  return data;
}

exports.app = functions.https.onRequest(app);
