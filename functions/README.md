- Only run npm run start-up if you need to update emulator if there have been changes made to the firebase store \*
  \*For this to work, if prompted with 'Emulator not running' or something along those lines,
  You will need two terminals:

STEP 1

- First have one which starts the emulator,
- Then open another one inside the functions directory specifically, and then $ npm run start-up

STEP 1.5

- If (you get a permission denied error) {
  chmod x+u startup.bash,
  $ npm run start-up again
  }

ALSO STEP 1.5
⚠ firestore: Port 8080 is not open on 127.0.0.1, could not start Firestore Emulator.
⚠ firestore: To select a different host/port, specify that host/port in a firebase.json config file:

- If (you get this) {
  lsof -ti tcp:8080 | xargs kill
  //Replace 8080 with the PORT giving you an error, may need to be repeated 3-4 times for separate ports)
  }

STEP 2

- Once the files finish loading, $ npm run dev

STEP 3

- Firebase, they said. Nod in happiness or disapointment.
