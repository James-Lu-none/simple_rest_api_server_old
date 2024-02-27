import functions = require("firebase-functions");
import admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


import express = require("express");
import cors = require("cors");
const db = admin.firestore();
const app = express();
app.use(cors({origin: true}));

app.get('/', (req, res) => {
   return res.status(200).send("Hi"); 
});

app.post("/api/create",(req,res)=>{
    (async ()=>{
        try{
            await db.collection('userDetails').doc(`/${Date.now()}/`).create({
                id:Date.now(),
                name: req.body.name,
                mobile: req.body.mobile,
                address: req.body.address,
            });
            return res.status(200).send({status: "Success", msg: "Data Saved"});
        }catch(error){
            console.log(error);
            return res.status(500).send({status: "Failed", msg: error});
        }
    })();
});
exports.app = functions.https.onRequest(app);