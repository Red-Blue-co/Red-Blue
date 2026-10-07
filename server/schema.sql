-- Tables Red-Blue's server reads and writes (derived from the SQL in controllers/ and helper/).
-- Run once against the app database:  mysql -u redblue -p redblue < schema.sql
-- Then load the demo shop data:          mysql -u redblue -p redblue < seed.sql

CREATE TABLE IF NOT EXISTS users (
  userId     INT AUTO_INCREMENT PRIMARY KEY,
  userName   VARCHAR(100) NOT NULL UNIQUE,
  userMail   VARCHAR(255) NOT NULL UNIQUE,
  pass       VARCHAR(255) NOT NULL,
  otp        VARCHAR(10)  NULL,
  isActive   TINYINT(1)   NOT NULL DEFAULT 0,
  isDelete   TINYINT(1)   NOT NULL DEFAULT 0,
  createdAt  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  productId          INT AUTO_INCREMENT PRIMARY KEY,
  productName        VARCHAR(255) NOT NULL,
  productDescription TEXT,
  productImg         VARCHAR(500),
  productColor       VARCHAR(20)  NOT NULL DEFAULT '#0065c3',
  productPrice       DECIMAL(6,2) NOT NULL DEFAULT 0,
  isDeleted          TINYINT(1)   NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS banner (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  bannerName  VARCHAR(255) NOT NULL,
  bannerImg   VARCHAR(500),
  bannerColor VARCHAR(20)  NOT NULL DEFAULT '#fc4a55'
);

CREATE TABLE IF NOT EXISTS categories (
  categoryId      INT AUTO_INCREMENT PRIMARY KEY,
  categoryName    VARCHAR(100) NOT NULL,
  categoryTagline VARCHAR(255),
  categoryImg     VARCHAR(500),
  categoryColor   VARCHAR(20)  NOT NULL DEFAULT '#162527'
);

CREATE TABLE IF NOT EXISTS AuditLog (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  table_name   VARCHAR(64),
  record_id    VARCHAR(64),
  action_type  VARCHAR(32),
  performed_by VARCHAR(64),
  timestamp    BIGINT,
  changes      TEXT
);
