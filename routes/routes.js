const express = require("express");
const router  = express.Router();
const accountController = require("../controller/accountController");


router.get("/",accountController.checkauth);
router.get("/login",accountController.showlogin);
router.get("/register",accountController.showregister);
router.post("/signin",accountController.signin);
router.post("/create_account",accountController.createAccount);




module.exports = router;