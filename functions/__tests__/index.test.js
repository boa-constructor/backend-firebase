// const { getUser, helloWorld } = require("../index");
// const db = getFirestore();
// const request = require("supertest");

// afterAll(() => {
//   if (db.end) db.end();
// });
// // describe("GET", () => {
// //   test("return a user object", () => {
// //     expect(typeof getUser()).toEqual("object");
// //     console.log(getUser(), "<<< returned data");
// //     expect(getUser()).toEqual("John");
// //   });
// // });

// // describe("GET", () => {
// //   test("return a user object", async () => {
// //     const results = await getUser().expect(200);
// //     console.log(results);
// //     expect(typeof results).toEqual("object");
// //   });
// // });

// describe("HELLO WORLD", () => {
//   test("returns hello world", () => {
//     return request(helloWorld)
//       .expect(200)
//       .then((res) => {
//         console.log(res, "HELLO DATA");
//       });
//   });
// });
