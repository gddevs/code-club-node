import express from "express";
import { v4 } from "uuid";

const port = 3000;
const app = express();
app.use(express.json());

const users = [];

const checkUserId = (req, res, next) => {
  // isto é um middleware
  const { id } = req.params;
  const index = users.findIndex((user) => user.id === id);
  if (index < 0) {
    return res.status(404).json({ error: "User not found" });
  }

  req.userIndex = index;
  req.userId = id;
  next();
};

app.get("/users", (req, res) => {
  return res.status(200).json(users);
});

app.post("/users", (req, res) => {
  const { name, age } = req.body;

  const user = { id: v4(), name, age };

  users.push(user);

  return res.status(201).json(user);
});

app.put("/users/:id", checkUserId, (req, res) => {
  const index = req.userIndex;
  const { name, age } = req.body;
  const id = req.userId;

  const updateUser = { id, name, age };
  users[index] = updateUser;
  return res.json(updateUser);
});

app.delete("/users/:id", checkUserId, (req, res) => {
  const index = req.userIndex;

  users.splice(index, 1);

  return res.status(204).json({ error: "User is Deleted" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
