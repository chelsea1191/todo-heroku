const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
app.use(express.json());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use("/assets", express.static("assets"));
const morgan = require("morgan");

//////////////////use///////////////////
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

//////////////////get////////////////////
app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/todos", async (req, res, next) => {
  await db
    .readTodos()
    .then(todos => res.send(todos))
    .catch(next);
});

//////////////////post////////////////////
app.post("/api/todos", (req, res, next) => {
  db.createTodo(req.body)
    .then(todo => res.send(todo))
    .catch(next);
});

//////////////////delete////////////////////
app.delete("/api/todos/:id", (req, res, next) => {
  db.deleteTodo(req.params.id)
    .then(() => res.sendStatus(204)) //since no return
    .catch(next);
});

//////////////////put//////////////////////
app.put("/api/todos/:id", (req, res, next) => {
  db.updateTodo(req.params.id)
    .then(todo => res.send(todo))
    .catch(next);
});

const port = process.env.PORT || 3000;

db.sync()
  .then(() => {
    console.log("db synced");
    app.listen(port, () => console.log(`listening on port ${port}`));
  })
  .catch(ex => console.log(ex));
