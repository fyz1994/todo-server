const express = require("express");
const router = express.Router();

const todoItem_controller = require("../controllers/TodoItemController");

const jwt = require("jsonwebtoken");
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.get("/", authenticateJWT, todoItem_controller.index);
router.get("/:id", authenticateJWT, todoItem_controller.index);
router.post("/", authenticateJWT, todoItem_controller.add_todoItem);
router.patch("/", authenticateJWT, todoItem_controller.update_todoItem);
router.delete("/:id", authenticateJWT, todoItem_controller.delete_todoItem);

module.exports = router;
