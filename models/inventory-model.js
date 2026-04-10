const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

/* ***************************
 *  Enhancement: Get most recently added inventory items
 * ************************** */
async function getRecentInventory(limit = 10) {
    try {
        const sql = `SELECT i.*, c.classification_name FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            ORDER BY i.inv_id DESC LIMIT $1`
        const data = await pool.query(sql, [limit])
        return data.rows
    } catch (error) {
        console.error("getRecentInventory error: " + error)
        return []
    }
}

/* ***************************
 *  Get detailed info for a single inventory item by inv_id
 * ************************** */
async function getInventoryByItemId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory 
            WHERE inv_id = $1`,
            [inv_id]
        )
        return data.rows[0]
    } catch (error) {
        console.error("getinventorybyitemid error " + error)
    }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(
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
) {
    try {
        const sql =
            "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return await pool.query(sql, [
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
        ])
    } catch (error) {
        return error.message
    }
}

/* ***************************
 *  Enhancement: Search inventory by make/model and classification
 * ************************** */
async function searchInventory(searchTerm, classification_id = null) {
    try {
        let sql = `SELECT i.*, c.classification_name FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id`
        const params = []
        const conditions = []

        if (searchTerm) {
            params.push(`%${searchTerm}%`)
            conditions.push(`(i.inv_make ILIKE $${params.length} OR i.inv_model ILIKE $${params.length})`)
        }

        if (classification_id) {
            params.push(classification_id)
            conditions.push(`i.classification_id = $${params.length}`)
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ')
        }

        sql += ' ORDER BY i.inv_id DESC'
        const data = await pool.query(sql, params)
        return data.rows
    } catch (error) {
        console.error("searchInventory error: " + error)
        return []
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
) {
    try {
        const sql =
            "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
        const data = await pool.query(sql, [
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
            inv_id
        ])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventory(inv_id) {
    try {
        const sql = 'DELETE FROM public.inventory WHERE inv_id = $1'
        const data = await pool.query(sql, [inv_id])
        return data
    } catch (error) {
        console.error("deleteInventory error: " + error)
    }
}

/* ***************************
 *  Delete Classification Item
 * ************************** */
async function deleteClassification(classification_id) {
    try {
        // First check if there are any vehicles in this classification
        const checkSql = 'SELECT COUNT(*) as count FROM public.inventory WHERE classification_id = $1'
        const checkResult = await pool.query(checkSql, [classification_id])
        
        if (checkResult.rows[0].count > 0) {
            return null // Cannot delete if vehicles exist
        }
        
        const sql = 'DELETE FROM public.classification WHERE classification_id = $1'
        const data = await pool.query(sql, [classification_id])
        return data
    } catch (error) {
        console.error("deleteClassification error: " + error)
    }
}

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getInventoryByItemId,
    addClassification,
    addInventory,
    updateInventory,
    deleteInventory,
    deleteClassification,
    searchInventory,
    getRecentInventory
};