const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const firebaseConfig = {
  apiKey: "AIzaSyB69WIWau0OsUGMqTPDA5jJs6NMsEncGR4",
  authDomain: "dndinder-68dcc.firebaseapp.com",
  databaseURL:
    "https://dndinder-68dcc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dndinder-68dcc",
  storageBucket: "dndinder-68dcc.appspot.com",
  messagingSenderId: "887332428606",
  appId: "1:887332428606:web:fd999c4c18be4c0d106a6f",
  measurementId: "G-V4QQMW9LBW",
};
admin.initializeApp(firebaseConfig);
const app = express();

app.get("/:username", async (req, res) => {
  const username = req.params.username;
  console.log(username);
  const snapshot = await admin
    .firestore()
    .collection("Users")
    .where("username", "==", `${username}`)
    .get();
  res.send({ snapshot });
});

exports.addUser = functions.https.onRequest(async (req, res) => {
  const original = req.body;
  const writeUser = await admin
    .firestore()
    .collection("Users")
    .add({ username: original.username });
  res.json({ result: `User with ID: ${writeUser.id} added` });
});

exports.user = functions.https.onRequest(app);
// exports.getUser = functions.https.onRequest(async (req, res) => {
//   const user_id = req.params;
//   const result = await admin
//     .firestore()
//     .collection("Users")
//     .doc(`${user_id}`)
//     .get();
//   const data = result.data();
//   res.json({ result });
// });
