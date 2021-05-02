const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const moment = require("moment");

const TodoItemScheme = new Scheme({
  content: { type: String, required: true, max: 100 },
  complete: { type: Boolean, default: false },
  match: { type: Boolean, default: true },
  delete: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  create: { type: Date, default: Date.now },
});

TodoItemScheme.virtual("create_time").get(() => {
  return moment(this.create).format("YYYY/MM/DD HH:mm:ss");
});

TodoItemScheme.virtual("update_time").get(() => {
  return moment(this.updateAt).format("YYYY/MM/DD HH:mm:ss");
});

module.exports = mongoose.model("TodoItem", TodoItemScheme);
