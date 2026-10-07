const { MySQLDB_Helper, ApplicationSuccess, ApplicationError } = require("sv-nex");

const getProduct_controller = async (req, res, next) => {
    try {
        const { productId } =  req.query;
        if (!productId) {
            throw new ApplicationError("send the valuer your data")
        }
        const sql = `SELECT productId, productName as name, productDescription as disp, productImg as img   
                FROM products
                WHERE productId = ? AND 
                isDeleted = 0 `;
        const result = await MySQLDB_Helper.executeQuery(sql, [productId]);
        if (result) {
            res.json(ApplicationSuccess.getSuccessObject(result, "I got your product"))
        } else {
            throw new ApplicationError("Wrong Product Id")
        }
    } catch (err) {
        throw err
    }
}

// Every product for the product cards
const getProducts_controller = async (req, res, next) => {
    const sql = `SELECT productId, productName as name, productDescription as disp, productImg as img
                 FROM products
                 WHERE isDeleted = 0
                 ORDER BY productId`;
    const result = await MySQLDB_Helper.executeQuery(sql, []);
    res.json(ApplicationSuccess.getSuccessObject(result || [], "Products"))
}

// The hero slides: one banner per drink, with its background colour
const getBannerDetails_controllers = async (req, res, next) => {
    const sql = `SELECT id, bannerName as name, bannerImg as img, bannerColor as color
                 FROM banner
                 ORDER BY id`;
    const result = await MySQLDB_Helper.executeQuery(sql, []);
    if (!result) {
        throw new ApplicationError("Banners not found")
    }
    res.json(ApplicationSuccess.getSuccessObject(result, "Banners"))
}

// The category cards
const getCategories_controller = async (req, res, next) => {
    const sql = `SELECT categoryId as id, categoryName as name, categoryTagline as tagline,
                        categoryImg as img, categoryColor as color
                 FROM categories
                 ORDER BY categoryId`;
    const result = await MySQLDB_Helper.executeQuery(sql, []);
    res.json(ApplicationSuccess.getSuccessObject(result || [], "Categories"))
}

module.exports = { 
    getProduct_controller,
    getProducts_controller,
    getBannerDetails_controllers,
    getCategories_controller
}
