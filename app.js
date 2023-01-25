const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const db_conn = require(__dirname + "/db_conn.js");
const { MongoClient } = require('mongodb');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const uri = "mongodb+srv://sudeepsw97:nAGN1i4bQIymDIkW@cluster0.3aijqiy.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const db_name = "toDoList"
const collection_name = "tasks"
client.connect()

const day = date.getDate();
let items = [];

app.get("/", async function (req, res) {
  items = await db_conn.findAllTasksByListName(client, db_name, collection_name, "")
  console.log(items);
  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", async function (req, res) {
  const item = req.body.newItem;
  console.log(item, req.body.list, day);
  if (req.body.list === day) {
    db_conn.createTask(client, db_name, collection_name, { task: item, listName: "" });
    items = await db_conn.findAllTasksByListName(client, db_name, collection_name, "")
    res.redirect("/");
  } else {
    db_conn.createTask(client, db_name, collection_name, { task: item, listName: req.body.list });
    items = await db_conn.findAllTasksByListName(client, db_name, collection_name, req.body.list)
    res.redirect("/" + req.body.list);
  }
});

app.post("/delete", async function (req, res) {
  const checkedItem = req.body.checkbox.split(" ")[0];
  const listName = req.body.checkbox.substr(req.body.checkbox.indexOf(" ") + 1);
  console.log(checkedItem, listName);
  await db_conn.deleteTaskByID(client, db_name, collection_name, checkedItem)
  if (listName === day) {
    res.redirect("/");
  } else {
    res.redirect("/" + listName);
  }
});

app.get("/:listType", async function (req, res) {
  const listType = req.params.listType
  items = await db_conn.findAllTasksByListName(client, db_name, collection_name, listType)
  res.render("list", { listTitle: listType, newListItems: items });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
