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

exports.addUser = functions.https.onRequest(async (req, res) => {
  const original = req.body;
  const writeUser = await admin
    .firestore()
    .collection("Users")
    .add({ username: original.username });
  res.json({ result: `User with ID: ${writeUser.id} added` });
});

exports.addCharacter = functions.https.onRequest(async (req, res) => {
  const { character_name, user_id } = req.body;
  try {
    const writeCharacter = await admin
      .firestore()
      .collection("Characters")
      .add({ character_name, user_id });
    const character_id = writeCharacter._path.segments[1];
    res.send({ character_id });
    const addCharacterToUser = await admin
      .firestore()
      .doc(`Users/${user_id}`)
      .update({
        characters: admin.firestore.FieldValue.arrayUnion(character_id),
      });
  } catch (err) {
    console.log(err);
  }
});
//error for non exsistent user_id needs to be handled on front-end log in. User_id should always be valid.

exports.getUser = functions.https.onRequest(async (req, res) => {
  const user_id = req.params[0];
  const userRef = admin.firestore().collection("Users").doc(`${user_id}`);
  const doc = await userRef.get();
  if (!doc.exists) {
    console.log("no such document");
  } else {
    res.send(doc.data());
  }
});

exports.getCharacters = functions.https.onRequest(async (req, res) => {
  const charactersRef = admin.firestore().collection("Characters");
  const snapshot = await charactersRef.get();
  const characters = [];
  snapshot.forEach((doc) => {
    const character = doc.data();
    character.character_id = doc.id;
    characters.push(character);
  });
  if (characters.length) {
    res.send({ characters });
  } else {
    res.status(404).send({ msg: "no characters found" });
  }
});

//below is an example of uing express syntax to create an endpoint

// app.get("/:username", async (req, res) => {
//   const username = req.params.username;
//   console.log(username);
//   const snapshot = await admin
//   .firestore()
//   .collection("Users")
//   .where("username", "==", `${username}`)
//   .get();
//   res.send(snapshot);
// });
// exports.user = functions.https.onRequest(app);
