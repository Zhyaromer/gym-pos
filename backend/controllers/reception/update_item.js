const db = require("../../config/mysql/mysqlconfig");

const updateItem = async (req, res) => {
    const { item_name, item_quantity } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'id is required' });
    }

}

module.exports = updateItem;