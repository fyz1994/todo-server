#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
// var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
const TodoItem = require("./models/todoItem");

var mongoose = require("mongoose");
const mongoDB = "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let todoItems = [];

const todoItemCreate = (content, cb) => {
  const todoItem = new TodoItem({ content });
  todoItem.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New TodoItem: " + todoItem);
    todoItems.push(todoItem);
    cb(null, todoItem);
  });
};

async.series(
  [
    function (callback) {
      todoItemCreate("学习前端", callback);
    },
    function (callback) {
      todoItemCreate("学习后端", callback);
    },
    function (callback) {
      todoItemCreate("学习 less", callback);
    },
    function (callback) {
      todoItemCreate("学习 mongodb", callback);
    },
    function (callback) {
      todoItemCreate("学习 react", callback);
    },
  ],
  // optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("FINAL RESULT: " + results);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
