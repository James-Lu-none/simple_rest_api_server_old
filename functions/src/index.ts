import functions = require("firebase-functions");
import admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


import express = require("express");
import cors = require("cors");
const db = admin.firestore();
const pc_status_collection=db.collection('pc_status');
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

app.get("/api/pc_status/get",(req,res)=>{
    (async ()=>{
        try{
            var pcId = req.query.pc_id;
            console.log(pcId);
            if(pcId === null || typeof pcId !== 'string'){
                throw Error("pc id was invalid");
            }
            // const data = await pc_status_collection.doc(pcId).get();
            var response
            await pc_status_collection.doc(pcId).get().then((data)=>{
                response= data.data();
                return response;
            });
            return res.status(200).send({status: "Success", data: response, msg: "Data retrieved"});
        }catch(error){
            console.log(error);
            return res.status(500).send({status: "Failed", msg: error});
        }
    })();
});

app.put("/api/pc_status/set",(req,res)=>{
    (async ()=>{
        console.log(req.params);
        console.log(req.body);
        try{
            var data = {};
            var pcId = req.query.pc_id;
            console.log(pcId);
            if(pcId === null || typeof pcId !== 'string'){
                throw Error("pc id was invalid");
            }
            data = assignBooleanIfNotNullOrUndefined('isPcOn', req.body.isPcOn, data);
            data = assignBooleanIfNotNullOrUndefined('isPowerOnTriggered', req.body.isPowerOnTriggered, data);
            console.log(data);
            await pc_status_collection.doc(pcId).update(data);
            return res.status(200).send({status: "Success", msg: "Data updated"});
        }catch(error){
            console.log(error);
            return res.status(500).send({status: "Failed", msg: error});
        }
    })();
});

function assignBooleanIfNotNullOrUndefined(property: string, value: any, data: {}) {
    if (value !== null && value !== undefined && typeof value === 'boolean') {
        data = Object.assign({ [property]: value }, data);
    }
    return data;
}
  
exports.app = functions.https.onRequest(app);