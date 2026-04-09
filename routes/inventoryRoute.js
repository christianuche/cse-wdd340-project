// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory item detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByItemId));

// Route to trigger intentional 500 error
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

// Route to build edit inventory view
router.get("/edit/:inv_id", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))

// Route for inventory management view
router.get("/", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));

// Route to get inventory as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build add classification view
router.get("/add-classification", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));

// Route to add new classification
router.post(
    "/add-classification",
    utilities.checkJWTToken,
    utilities.checkAccountType,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
router.get("/add-inventory", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

// Route to add new inventory item
router.post(
    "/add-inventory",
    utilities.checkJWTToken,
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);
// Route to delete inventory item
router.get("/delete/:inv_id", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory))
// Route to delete classification item
router.get("/delete-classification/:classification_id", utilities.checkJWTToken, utilities.checkAccountType, utilities.handleErrors(invController.deleteClassification))
// Route to update inventory item
router.post(
    "/update",
    utilities.checkJWTToken,
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.updateInventory)
);

module.exports = router;