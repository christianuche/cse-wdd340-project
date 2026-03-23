const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByItemId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByItemId(inv_id)
    const detail = await utilities.buildItemDetail(data)
    let nav = await utilities.getNav()
    const vehicleName = data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model
    res.render("./inventory/detail", {
        title: vehicleName,
        nav,
        detail,
    })
}

/* ***************************
 *  Trigger intentional 500 error
 * ************************** */
invCont.triggerError = async function (req, res, next) {
    throw new Error('This is an intentional server crash for testing purposes.')
}

module.exports = invCont