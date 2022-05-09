const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require(`cors`)({ origin: true });
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

exports.addUser = functions.https.onRequest(async (req, res) => {
  console.log(req.body, "<<<");
  cors(req, res, async () => {
    const original = req.body;
    const writeUser = await admin
      .firestore()
      .collection("Users")
      .add({ username: original.username });
    res.json({ result: `User with ID: ${writeUser.id} added` });
  });
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
  if (doc.exists) {
    res.send({ user: doc.data() });
  } else {
    res.status(404).send({ msg: "User not found" });
  }
});

exports.getCharacterByID = functions.https.onRequest(async (req, res) => {
  const character_id = req.params[0];
  const characterRef = admin
    .firestore()
    .collection("Characters")
    .doc(`${character_id}`);
  const doc = await characterRef.get();
  if (doc.exists) {
    res.send({ character: doc.data() });
  } else {
    res.status(404).send({ msg: "Character not found" });
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

exports.addGroup = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { group_name, avatar, game_info, characters, dm } = req.body;
    const writeGroup = await admin
      .firestore()
      .collection("Groups")
      .add({ group_name, avatar, game_info, characters, dm });
    const group_id = writeGroup._path.segments[1];
    res.send({ group_id });
  });
});
