var express = require("express");
var router = express.Router();

const UserController = require("../controllers/UserController");

router.post("/signup", UserController.signup);
router.post("/signin", UserController.signin);
router.post("/token", UserController.refreshToken);
router.post("/logout", UserController.signout);

module.exports = router;
