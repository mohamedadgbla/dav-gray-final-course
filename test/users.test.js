const request = require("supertest");
const express = require("express");

const app = express();
app.get("/users", (req, res) => {
  res.json([{ id: 1, name: "Mohamed" }]);
});

describe("GET /users", () => {
  it("should return a list of users", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{ id: 1, name: "Mohamed" }]);
  });
});



//2
// require("dotenv").config();

// const mongoose = require("mongoose");
// const request = require("supertest");

// const app = require("../api");

// beforeAll(async () => {
//   await mongoose.connect(process.env.MONGO_URI);
// });

// afterAll(async () => {
//   await mongoose.connection.close();
// });

// describe("GET /api/v1/users", () => {
//   it("should return all users", async () => {
//     const res = await request(app)
//       .get("/api/v1/users");

//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body.users)).toBe(true);
//   });
// });



