// Needed Resources 
const express = require("express")
const router = new express.Router()
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Default route for account management
router.get("/", utilities.handleErrors(accountController.buildManagement))

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to process registration
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;