-- Cart and orders. Safe to run again; it only creates what is missing.
--   mysql -u redblue -p redblue < cart.sql

CREATE TABLE IF NOT EXISTS cart_items (
  userId    INT NOT NULL,
  productId INT NOT NULL,
  qty       INT NOT NULL DEFAULT 1,
  addedAt   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (userId, productId)
);

CREATE TABLE IF NOT EXISTS orders (
  orderId   INT AUTO_INCREMENT PRIMARY KEY,
  userId    INT NOT NULL,
  itemCount INT NOT NULL,
  subtotal  DECIMAL(8, 2) NOT NULL,
  delivery  DECIMAL(8, 2) NOT NULL,
  total     DECIMAL(8, 2) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (userId)
);

CREATE TABLE IF NOT EXISTS order_items (
  orderId   INT NOT NULL,
  productId INT NOT NULL,
  qty       INT NOT NULL,
  price     DECIMAL(6, 2) NOT NULL,
  INDEX (orderId)
);
