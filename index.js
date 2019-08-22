const express = require("express");

const server = express();

server.use(express.json());
//query param = ?teste=1
//route param = /users/1
//request body = { "nome": "mathias", "email": "matts.neves@gmail.com"}
const users = ["Mathias", "Diego", "Robson"];
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Metodo: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Request");
});

function checkUsersExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

function checkUserExistsArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }
  req.user = user;
  return next();
}
server.get("/users", (req, res) => {
  return res.send(users);
});
server.get("/users/:index", checkUserExistsArray, (req, res) => {
  return res.send(req.user);
});

server.post("/users", checkUsersExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put(
  "/users/:index",
  checkUsersExists,
  checkUserExistsArray,
  (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;

    return res.json(users);
  }
);

server.delete("/users/:index", checkUserExistsArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json();
});

server.listen(3000);
