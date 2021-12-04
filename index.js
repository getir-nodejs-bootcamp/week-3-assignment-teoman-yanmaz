const express = require("express");
const { randomBytes } = require("crypto");
const fs = require("fs");

const app = express();
app.use(express.json());

let users = [];

app
  .route("/users")
  .get((req, res) => {
    fs.appendFile("GetRequests.txt", req.url + " ", (err) => {
      if (err) throw err;
      console.log("Get Request Logged.");
    });
    res.status(200).send(users);
  })
  .post((req, res) => {
    fs.appendFile("PostRequests.txt", req.url + " ", (err) => {
      if (err) throw err;
      console.log("Post Request Logged.");
    });
    const id = randomBytes(4).toString("hex");
    const { name, username, email } = req.body;
    users.push({
      name,
      username,
      email,
      id,
    });
    res.status(201).send(users);
  });

app
  .route("/users/:id")
  .put((req, res) => {
    fs.appendFile("PutRequests.txt", req.url + " ", (err) => {
      if (err) throw err;
      console.log("Put Request Logged.");
    });
    const userIndex = users.findIndex((x) => x.id == req.params.id);
    const { name, username, email } = req.body;
    const id = users[userIndex].id;
    users[userIndex] = {
      name,
      username,
      email,
      id,
    };
    res.status(200).send(users[userIndex]);
  })
  .patch((req, res) => {
    fs.appendFile("PatchRequests.txt", req.url + " ", (err) => {
      if (err) throw err;
      console.log("Put Request Logged.");
    });
    const userIndex = users.findIndex((x) => x.id == req.params.id);
    const { name, username, email } = req.body;
    const currentUser = users[userIndex];
    users[userIndex] = {
      name: name ?? currentUser.name,
      username: username ?? currentUser.username,
      email: email ?? currentUser.email,
      id: currentUser.id,
    };
    res.status(200).send(users[userIndex]);
  })
  .delete((req, res) => {
    fs.appendFile("DeleteRequests.txt", req.url + " ", (err) => {
      if (err) throw err;
      console.log("Delete Request Logged.");
    });
    users = users.filter((item) => {
      return item.id != req.params.id;
    });
    res.status(200).send(`User Deleted`);
  });

app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.listen(8080, () => {
  console.log("Listening on 8080");
});
