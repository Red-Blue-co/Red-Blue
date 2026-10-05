-- Tables Red-Blue's server reads and writes (derived from the SQL in controllers/ and helper/).
-- Run once against the app database:  mysql -u redblue -p redblue < schema.sql

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
  productImg         VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS banner (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  bannerName VARCHAR(255) NOT NULL,
  bannerImg  VARCHAR(500)
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
