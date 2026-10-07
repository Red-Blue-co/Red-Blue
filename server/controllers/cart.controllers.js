const { MySQLDB_Helper, ApplicationSuccess, ApplicationError } = require("sv-nex");

const idOf = (v, what) => {
    const n = Number(v);
    if (!Number.isInteger(n) || n <= 0) throw new ApplicationError(`Please choose a ${what}.`);
    return n;
};

// The cart lines for a user, with what the cart page needs about each drink
const readCart = (userId) => MySQLDB_Helper.executeQuery(
    `SELECT c.productId, c.qty, p.productName as name, p.productImg as img, p.productColor as color,
            p.productPrice as price
     FROM cart_items c
     JOIN products p ON p.productId = c.productId
     WHERE c.userId = ? AND p.isDeleted = 0
     ORDER BY c.addedAt`, [userId]);

const getCart_controller = async (req, res) => {
    const userId = idOf(req.query.userId, "user");
    res.json(ApplicationSuccess.getSuccessObject(await readCart(userId), "Your cart"));
};

// Add one or more of a drink (adds to what is already there)
const addToCart_controller = async (req, res) => {
    const userId = idOf(req.body.userId, "user");
    const productId = idOf(req.body.productId, "product");
    const qty = Math.min(48, Math.max(1, Number(req.body.qty) || 1));
    await MySQLDB_Helper.executeQuery(
        `INSERT INTO cart_items (userId, productId, qty) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE qty = LEAST(48, qty + VALUES(qty))`, [userId, productId, qty]);
    res.json(ApplicationSuccess.getSuccessObject(await readCart(userId), "Added to your cart."));
};

// Set an exact quantity; 0 removes the drink
const setCartQty_controller = async (req, res) => {
    const userId = idOf(req.body.userId, "user");
    const productId = idOf(req.body.productId, "product");
    const qty = Math.min(48, Math.max(0, Number(req.body.qty) || 0));
    if (qty === 0) {
        await MySQLDB_Helper.executeQuery(`DELETE FROM cart_items WHERE userId = ? AND productId = ?`, [userId, productId]);
    } else {
        await MySQLDB_Helper.executeQuery(`UPDATE cart_items SET qty = ? WHERE userId = ? AND productId = ?`, [qty, userId, productId]);
    }
    res.json(ApplicationSuccess.getSuccessObject(await readCart(userId), qty ? "Cart updated." : "Removed from your cart."));
};

// Turn the cart into an order (demo checkout: no payment is taken)
const checkout_controller = async (req, res) => {
    const userId = idOf(req.body.userId, "user");
    const lines = await readCart(userId);
    if (!lines.length) throw new ApplicationError("Your cart is empty.");
    const subtotal = lines.reduce((s, l) => s + Number(l.price) * l.qty, 0);
    const delivery = subtotal >= 25 ? 0 : 3.9;
    const total = Math.round((subtotal + delivery) * 100) / 100;
    const order = await MySQLDB_Helper.executeQuery(
        `INSERT INTO orders (userId, itemCount, subtotal, delivery, total) VALUES (?, ?, ?, ?, ?)`,
        [userId, lines.reduce((s, l) => s + l.qty, 0), subtotal, delivery, total]);
    const orderId = order.insertId;
    for (const l of lines) {
        await MySQLDB_Helper.executeQuery(
            `INSERT INTO order_items (orderId, productId, qty, price) VALUES (?, ?, ?, ?)`, [orderId, l.productId, l.qty, l.price]);
    }
    await MySQLDB_Helper.executeQuery(`DELETE FROM cart_items WHERE userId = ?`, [userId]);
    res.json(ApplicationSuccess.getSuccessObject({ orderId, total }, "Order placed! Your drinks are on their way."));
};

// Past orders, newest first, each with its drinks
const getOrders_controller = async (req, res) => {
    const userId = idOf(req.query.userId, "user");
    const orders = await MySQLDB_Helper.executeQuery(
        `SELECT orderId, itemCount, subtotal, delivery, total, createdAt FROM orders WHERE userId = ? ORDER BY orderId DESC`, [userId]);
    if (orders.length) {
        const items = await MySQLDB_Helper.executeQuery(
            `SELECT oi.orderId, oi.qty, oi.price, p.productName as name, p.productImg as img, p.productColor as color
             FROM order_items oi JOIN products p ON p.productId = oi.productId
             WHERE oi.orderId IN (${orders.map(() => '?').join(',')})`, orders.map((o) => o.orderId));
        orders.forEach((o) => { o.items = items.filter((i) => i.orderId === o.orderId); });
    }
    res.json(ApplicationSuccess.getSuccessObject(orders, "Your orders"));
};

module.exports = {
    getCart_controller,
    addToCart_controller,
    setCartQty_controller,
    checkout_controller,
    getOrders_controller,
};
