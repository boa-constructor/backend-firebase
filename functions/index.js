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

// query is accessed in the URL by ?game_type=online
// multiple queries would be ?game_type=online&preferredday=saturday
// this function currrently only queries game_type
exports.getUsers = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const usersRef = admin.firestore().collection('Users');
    const { game_type } = req.query;
    if (game_type) {
      let snapshot = await usersRef
        .where(`game_type`, `==`, `${game_type}`)
        .get();
      const users = [];
      snapshot.forEach((doc) => {
        const user = doc.data();
        users.push(user);
      });
      if (users.length) {
        res.send(users);
      } else {
        res.status(204).send();
      }
    } else {
      let snapshot = await usersRef.get();
      const users = [];
      snapshot.forEach((doc) => {
        const user = doc.data();
        users.push(user);
      });
      if (users.length) {
        res.send(users);
      } else {
        res.status(204).send();
      }
    }
  });
});

exports.addUser = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const original = req.body.postBody;
    const writeUser = await admin
      .firestore()
      .collection('Users')
      .doc(`${original.user_id}`)
      .set(
        {
          user_id: `${original.user_id}`,
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
    const postBody = { ...req.body };
    const writeGroup = await admin
      .firestore()
      .collection('Groups')
      .add(postBody);
    const group_id = writeGroup._path.segments[1];
    await admin
      .firestore()
      .collection('Groups')
      .doc(`${group_id}`)
      .set({ group_id }, { merge: true });
    res.send({ group_id });
    const userRef = admin
      .firestore()
      .collection('Users')
      .doc(`${postBody.user_id}`);
    await userRef.update({
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
    await admin
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
    await admin.firestore().collection('Users').doc(user_id).update(patchData);
    res.send(`user ${user_id} updated`);
  });
});

exports.updateCharacter = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const character_id = req.params[0];
    const patchData = { ...req.body };
    await admin
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
    if (doc.exists) {
      res.send({ group: doc.data(), group_id: group_id });
    } else {
      res.status(204).send();
    }
  });
});

exports.addUserToGroup = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { group_id, user_id } = req.body;
    const groupRef = admin.firestore().collection('Groups').doc(`${group_id}`);
    await groupRef.update({
      members: admin.firestore.FieldValue.arrayUnion(user_id),
    });
    res.status(200).send();
    const userRef = admin.firestore().collection('Users').doc(`${user_id}`);
    await userRef.update({
      groups: admin.firestore.FieldValue.arrayUnion(group_id),
    });
    res.status(200).send();
  });
});

exports.removeUserFromGroup = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { user_id, group_id } = req.body;
    const groupRef = admin.firestore().collection('Groups').doc(`${group_id}`);
    await groupRef.update({
      members: admin.firestore.FieldValue.arrayRemove(user_id),
    });
    res.status(200).send();
    const userRef = admin.firestore().collection('Users').doc(`${user_id}`);
    await userRef.update({
      groups: admin.firestore.FieldValue.arrayRemove(group_id),
    });
    res.status(200).send();
  });
});

exports.addCharacterToGroup = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { character_id, group_id } = req.body;
    const groupRef = admin.firestore().collection('Groups').doc(`${group_id}`);
    await groupRef.update({
      characters: admin.firestore.FieldValue.arrayUnion(character_id),
    });
    res.status(200).send();
    const characterRef = admin
      .firestore()
      .collection('Characters')
      .doc(`${character_id}`);
    await characterRef.update({
      group: group_id,
    });
    res.status(200).send();
  });
});

exports.removeCharacterFromGroup = functions.https.onRequest(
  async (req, res) => {
    cors(req, res, async () => {
      const { character_id, group_id } = req.body;
      const groupRef = admin
        .firestore()
        .collection('Groups')
        .doc(`${group_id}`);
      await groupRef.update({
        characters: admin.firestore.FieldValue.arrayRemove(character_id),
      });
      res.status(200).send();
      const characterRef = admin
        .firestore()
        .collection('Characters')
        .doc(`${character_id}`);
      await characterRef.update({
        group: '',
      });
      res.status(200).send();
    });
  }
);

exports.addMessage = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { user_id, text, conversation_id } = req.body;
    const messageRef = admin
      .firestore()
      .collection('Messages')
      .doc(`${conversation_id}`)
      .collection('Conversation');
    const writeMessage = await messageRef.add({
      user_id,
      text,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    const message_id = writeMessage._path.segments[3];
    res.status(201).send({ message_id });
  });
});

exports.getMessagesByConversationId = functions.https.onRequest(
  async (req, res) => {
    cors(req, res, async () => {
      const conversation_id = req.params[0];
      console.log(conversation_id, 'convo id');
      const messagesRef = admin
        .firestore()
        .collection('Messages')
        .doc(`${conversation_id}`)
        .collection('Conversation');
      const snapshot = await messagesRef.get();
      const messages = [];
      snapshot.forEach((doc) => {
        const message = doc.data();
        message.message_id = doc.id;
        messages.push(message);
      });
      if (messages.length) {
        res.send({ messages });
      } else {
        res.status(204).send();
      }
    });
  }
);
