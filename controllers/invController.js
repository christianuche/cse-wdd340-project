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

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Add new classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)

    if (result) {
        req.flash(
            "notice",
            `Classification ${classification_name} was successfully added.`
        )
        let nav = await utilities.getNav()
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, adding classification failed.")
        let nav = await utilities.getNav()
        res.status(501).render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
        })
    }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null,
    })
}

/* ***************************
 *  Add new inventory item
 * ************************** */
invCont.addInventory = async function (req, res, next) {
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    } = req.body

    const result = await invModel.addInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )

    if (result) {
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} was successfully added.`
        )
        let nav = await utilities.getNav()
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, adding the vehicle failed.")
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(
            classification_id
        )
        res.status(501).render("./inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            classificationList,
            errors: null,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}

module.exports = invCont