const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require(`cors`)({ origin: true });
const firebaseConfig = {
  apiKey: 'AIzaSyB69WIWau0OsUGMqTPDA5jJs6NMsEncGR4',
  authDomain: 'dndinder-68dcc.firebaseapp.com',
  databaseURL:
    'https://dndinder-68dcc-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'dndinder-68dcc',
  storageBucket: 'dndinder-68dcc.appspot.com',
  messagingSenderId: '887332428606',
  appId: '1:887332428606:web:fd999c4c18be4c0d106a6f',
  measurementId: 'G-V4QQMW9LBW',
};

admin.initializeApp(firebaseConfig);

exports.addUser = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const original = req.body.user_id;
    const writeUser = await admin
      .firestore()
      .collection('Users')
      .doc(`${original.user_id}`)
      .set(
        {
          doc_id: `${original.user_id}`,
          email: `${original.email}`,
        },
        { merge: true }
      );
    res.json({ result: `User with ID: ${writeUser.id} added` });
    const doc = await admin
      .firestore()
      .collection('Users')
      .doc(`${original.user_id}`)
      .get();
    if (!doc.data().characters) {
      const writeUser = await admin
        .firestore()
        .collection('Users')
        .doc(`${original.user_id}`)
        .set(
          {
            characters: [],
          },
          { merge: true }
        );
    }
  });
});

exports.addCharacter = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const postData = { ...req.body };
    const user_id = postData.user_id;
    const writeCharacter = await admin
      .firestore()
      .collection('Characters')
      .add(postData);
    const character_id = writeCharacter._path.segments[1];
    res.send({ character_id });
    const addCharacterToUser = await admin
      .firestore()
      .doc(`Users/${user_id}`)
      .update({
        characters: admin.firestore.FieldValue.arrayUnion(character_id),
      });
  });
});
//error for non exsistent user_id needs to be handled on front-end log in. User_id should always be valid.

exports.getUser = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const user_id = req.params[0];
    const userRef = admin.firestore().collection('Users').doc(`${user_id}`);
    const doc = await userRef.get();
    if (doc.exists) {
      res.send({ user: doc.data() });
    } else {
      res.status(404).send({ msg: 'User not found' });
    }
  });
});

exports.getCharacterByID = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const character_id = req.params[0];
    const characterRef = admin
      .firestore()
      .collection('Characters')
      .doc(`${character_id}`);
    const doc = await characterRef.get();
    if (doc.exists) {
      res.send({ character: doc.data() });
    } else {
      res.status(404).send({ msg: 'Character not found' });
    }
  });
});

exports.getCharacters = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const charactersRef = admin.firestore().collection('Characters');
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
      res.status(204).send();
    }
  });
});

exports.addGroup = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    console.log(req.body, '<<< req');
    const postBody = { ...req.body };
    const writeGroup = await admin
      .firestore()
      .collection('Groups')
      .add(postBody);
    const group_id = writeGroup._path.segments[1];
    const updateGroup = await admin
      .firestore()
      .collection('Groups')
      .doc(`${group_id}`)
      .set({ group_id }, { merge: true });
    res.send({ group_id });
    const userRef = admin
      .firestore()
      .collection('Users')
      .doc(`${postBody.user_id}`);
    const updateUser = await userRef.update({
      groups: admin.firestore.FieldValue.arrayUnion(group_id),
    });
    res.status(200).send();
    res.end();
  });
});

exports.updateGroup = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const group_id = req.params[0];
    const patchData = { ...req.body };
    const updateGroup = await admin
      .firestore()
      .collection('Groups')
      .doc(group_id)
      .update(patchData);
    res.send(`group ${group_id} updated`);
  });
});

exports.getGroups = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const groupsRef = admin.firestore().collection('Groups');
    const snapshot = await groupsRef.get();
    const groups = [];
    snapshot.forEach((doc) => {
      const group = doc.data();
      group.group_id = doc.id;
      groups.push(group);
    });
    if (groups.length) {
      res.send({ groups });
    } else {
      res.status(204).send();
    }
  });
});

exports.updateUser = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const user_id = req.params[0];
    const patchData = { ...req.body };
    const updateUser = await admin
      .firestore()
      .collection('Users')
      .doc(user_id)
      .update(patchData);
    res.send(`user ${user_id} updated`);
  });
});

exports.updateCharacter = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const character_id = req.params[0];
    const patchData = { ...req.body };
    const updateCharacter = await admin
      .firestore()
      .collection('Characters')
      .doc(character_id)
      .update(patchData);
    res.send(`character ${character_id} updated`);
  });
});

exports.getGroupById = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const group_id = req.params[0];
    const groupRef = admin.firestore().collection('Groups').doc(`${group_id}`);
    const doc = await groupRef.get();
    console.log(doc.data());
    if (doc.exists) {
      res.send({ group: doc.data(), group_id: group_id });
    } else {
      res.status(204).send();
    }
  });
});

exports.addCharacterToGroup = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const postBody = req.body;
    console.log(req.body);
    const groupRef = admin
      .firestore()
      .collection('Groups')
      .doc(`${postBody.group_id}`);
    const updateGroup = await groupRef.update({
      characters: admin.firestore.FieldValue.arrayUnion(postBody.character_id),
    });
    res.status(200).send();
    const characterRef = admin
      .firestore()
      .collection('Characters')
      .doc(`${postBody.character_id}`);
    const updateCharacter = await characterRef.update({
      group: postBody.group_id,
    });
    res.status(200).send();
  });
});

exports.removeCharacterFromGroup = functions.https.onRequest(
  async (req, res) => {
    cors(req, res, async () => {
      const data = req.body;
      const groupRef = admin
        .firestore()
        .collection('Groups')
        .doc(`${data.group_id}`);
      const updateGroup = await groupRef.update({
        characters: admin.firestore.FieldValue.arrayRemove(data.character_id),
      });
      res.status(200).send();
      const characterRef = admin
        .firestore()
        .collection('Characters')
        .doc(`${data.character_id}`);
      const updateCharacter = await characterRef.update({
        group: '',
      });
      res.status(200).send();
    });
  }
);
