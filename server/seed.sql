-- Demo shop data: the hero banners, the categories and the products, with real photos.
-- Safe to run again; it replaces the demo rows each time.
--   mysql -u redblue -p redblue < seed.sql
-- Photos are free to use under the Unsplash licence (https://unsplash.com/license).

-- Hero: one banner per drink, with the background colour the hero shows behind it
DROP TABLE IF EXISTS banner;
CREATE TABLE banner (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  bannerName  VARCHAR(255) NOT NULL,
  bannerImg   VARCHAR(500),
  bannerColor VARCHAR(20)  NOT NULL DEFAULT '#fc4a55'
);
INSERT INTO banner (bannerName, bannerImg, bannerColor) VALUES
  ('Cola',   'https://images.unsplash.com/photo-1629654613528-5d0a2e4166de?auto=format&fit=crop&w=900&h=900&q=75', '#a8532e'),
  ('Lemon',  'https://images.unsplash.com/photo-1619032580077-6160b89e2398?auto=format&fit=crop&w=900&h=900&q=75', '#e2b23a'),
  ('Lime',   'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=900&h=900&q=75',    '#9cb43c'),
  ('Berry',  'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=900&h=900&q=75', '#ee6233'),
  ('Orange', 'https://images.unsplash.com/photo-1641659735894-45046caad624?auto=format&fit=crop&w=900&h=900&q=75', '#f5a512');

-- The two category cards
CREATE TABLE IF NOT EXISTS categories (
  categoryId      INT AUTO_INCREMENT PRIMARY KEY,
  categoryName    VARCHAR(100) NOT NULL,
  categoryTagline VARCHAR(255),
  categoryImg     VARCHAR(500),
  categoryColor   VARCHAR(20)  NOT NULL DEFAULT '#162527'
);
DELETE FROM categories;
INSERT INTO categories (categoryName, categoryTagline, categoryImg, categoryColor) VALUES
  ('Sodas',              'Fizzy classics',      '/img/categories/sodas.jpg', '#162527'),
  ('Iced teas and more', 'Cold, light, fresh',  'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=700&h=700&q=75', '#202011');

-- The products: Red-Blue's own cans (images live in client/public/img/products), with price and colour
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  productId          INT AUTO_INCREMENT PRIMARY KEY,
  productName        VARCHAR(255) NOT NULL,
  productDescription TEXT,
  productImg         VARCHAR(500),
  productColor       VARCHAR(20)   NOT NULL DEFAULT '#0065c3',
  productPrice       DECIMAL(6, 2) NOT NULL DEFAULT 0,
  isDeleted          TINYINT(1)    NOT NULL DEFAULT 0
);
INSERT INTO products (productName, productDescription, productImg, productColor, productPrice) VALUES
  ('Classic Cola',   'The original fizz: crisp, sweet and best over a glass full of ice.',  '/img/products/classic-cola.png',   '#b3261e', 1.49),
  ('Lime Fizz',      'Sparkling water with fresh lime and a hint of mint. Light and zesty.',  '/img/products/lime-fizz.png',      '#7da62d', 1.29),
  ('Orange Pop',     'Bright orange soda bursting with real citrus flavour.',                 '/img/products/orange-pop.png',     '#f26a1b', 1.29),
  ('Peach Iced Tea', 'Black tea brewed cold with ripe peach and a squeeze of lime.',          '/img/products/peach-iced-tea.png', '#e0973f', 1.59),
  ('Mint Sparkling', 'Sparkling water with fresh mint. No sugar, all refresh.',               '/img/products/mint-sparkling.png', '#5fae8c', 1.19),
  ('Root Beer',      'Creamy, spiced and smooth, with a vanilla finish. Serve ice cold.',     '/img/products/root-beer.png',      '#5a2f1d', 1.69);
