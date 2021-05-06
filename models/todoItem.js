const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moment = require("moment");

const TodoItemSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, max: 100 },
  complete: { type: Boolean, default: false },
  match: { type: Boolean, default: true },
  delete: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  create: { type: Date, default: Date.now },
});

TodoItemSchema.virtual("create_time").get(() => {
  return moment(this.create).format("YYYY/MM/DD HH:mm:ss");
});

TodoItemSchema.virtual("update_time").get(() => {
  return moment(this.updateAt).format("YYYY/MM/DD HH:mm:ss");
});

module.exports = mongoose.model("TodoItem", TodoItemSchema);
