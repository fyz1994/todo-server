const express = require("express");
const router = express.Router();

const todoItem_controller = require("../controllers/TodoItemController");

router.get("/", todoItem_controller.index);
router.get("/:id", todoItem_controller.index);
router.post("/", todoItem_controller.add_todoItem);
router.patch("/", todoItem_controller.update_todoItem);
router.delete("/:id", todoItem_controller.delete_todoItem);

module.exports = router;
