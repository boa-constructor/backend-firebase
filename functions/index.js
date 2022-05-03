const functions = require("firebase-functions");
// const { firestore } = require("firebase-functions");
const admin = require("firebase-admin");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

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
const db = getFirestore();

exports.getUser = () => {
  db.collection("Users")
    .get()
    .then((data) => {
      console.log(data);
      return data;
    });
};

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});
