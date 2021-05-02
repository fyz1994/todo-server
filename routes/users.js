var express = require("express");
var router = express.Router();

const UserController = require("../controllers/UserController");

router.post("/signup", UserController.signup);
router.post("/signin", UserController.signin);

module.exports = router;
