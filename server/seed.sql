-- Demo shop data: the hero banners, the categories and the products, with real photos.
-- Safe to run again; it replaces the demo rows each time.
--   mysql -u redblue -p redblue < seed.sql
-- Photos are free to use under the Unsplash licence (https://unsplash.com/license).

-- Hero: one slide per flavour (its can), with the background colour the hero shows behind it
DROP TABLE IF EXISTS banner;
CREATE TABLE banner (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  bannerName  VARCHAR(255) NOT NULL,
  bannerImg   VARCHAR(500),
  bannerColor VARCHAR(20)  NOT NULL DEFAULT '#fc4a55'
);
INSERT INTO banner (bannerName, bannerImg, bannerColor) VALUES
  ('Cola',      '/img/products/classic-cola.png',   '#b3261e'),
  ('Lime',      '/img/products/lime-fizz.png',      '#7da62d'),
  ('Orange',    '/img/products/orange-pop.png',     '#f26a1b'),
  ('Peach',     '/img/products/peach-iced-tea.png', '#e0973f'),
  ('Root beer', '/img/products/root-beer.png',      '#5a2f1d');

-- The two category cards (fixed ids, the products below point at them)
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
  categoryId      INT AUTO_INCREMENT PRIMARY KEY,
  categoryName    VARCHAR(100) NOT NULL,
  categoryTagline VARCHAR(255),
  categoryImg     VARCHAR(500),
  categoryColor   VARCHAR(20)  NOT NULL DEFAULT '#162527'
);
INSERT INTO categories (categoryId, categoryName, categoryTagline, categoryImg, categoryColor) VALUES
  (1, 'Sodas',              'Fizzy classics',      '/img/categories/sodas.jpg', '#162527'),
  (2, 'Iced teas and more', 'Cold, light, fresh',  'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=700&h=700&q=75', '#202011');

-- The products: Red-Blue's own cans (images live in client/public/img/products), each in a category,
-- with price, colour and the details shown on the opened card
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  productId          INT AUTO_INCREMENT PRIMARY KEY,
  categoryId         INT           NOT NULL DEFAULT 1,
  productName        VARCHAR(255) NOT NULL,
  productDescription TEXT,
  productImg         VARCHAR(500),
  productColor       VARCHAR(20)   NOT NULL DEFAULT '#0065c3',
  productPrice       DECIMAL(6, 2) NOT NULL DEFAULT 0,
  productTag         VARCHAR(40),
  productNotes       VARCHAR(255),
  calories           INT           NOT NULL DEFAULT 0,
  sugarGrams         DECIMAL(4, 1) NOT NULL DEFAULT 0,
  caffeineMg         INT           NOT NULL DEFAULT 0,
  rating             DECIMAL(2, 1) NOT NULL DEFAULT 0,
  reviews            INT           NOT NULL DEFAULT 0,
  isDeleted          TINYINT(1)    NOT NULL DEFAULT 0,
  INDEX (categoryId)
);
INSERT INTO products (categoryId, productName, productDescription, productImg, productColor, productPrice, productTag, productNotes, calories, sugarGrams, caffeineMg, rating, reviews) VALUES
  -- Sodas
  (1, 'Classic Cola',    'The original fizz: crisp, sweet and best over a glass full of ice.',   '/img/products/classic-cola.png',    '#b3261e', 1.49, 'Bestseller',    'Caramel, vanilla, citrus peel',    139, 35.0, 32, 4.8, 1240),
  (1, 'Cherry Cola',     'Our classic cola with a deep, dark cherry twist.',                     '/img/products/cherry-cola.png',     '#7b1626', 1.59, 'New',           'Black cherry, cola nut, vanilla',  145, 36.0, 32, 4.7,  356),
  (1, 'Orange Pop',      'Bright orange soda bursting with real citrus flavour.',                '/img/products/orange-pop.png',      '#f26a1b', 1.29, 'Fan favourite', 'Blood orange, mandarin, honey',    120, 29.0,  0, 4.7,  967),
  (1, 'Lime Fizz',       'Sparkling water with fresh lime and a hint of mint. Light and zesty.', '/img/products/lime-fizz.png',       '#7da62d', 1.29, 'Low sugar',     'Lime, mint, sea salt',              45,  9.5,  0, 4.6,  812),
  (1, 'Grape Soda',      'Purple, playful and properly fizzy. Made with real grape juice.',      '/img/products/grape-soda.png',      '#5b2a86', 1.39, 'Kids pick',     'Concord grape, blackcurrant',      130, 31.0,  0, 4.5,  402),
  (1, 'Root Beer',       'Creamy, spiced and smooth, with a vanilla finish. Serve ice cold.',    '/img/products/root-beer.png',       '#5a2f1d', 1.69, 'Small batch',   'Sassafras, vanilla, wintergreen',  152, 38.0,  0, 4.9,  688),
  -- Iced teas and more
  (2, 'Peach Iced Tea',  'Black tea brewed cold with ripe peach and a squeeze of lime.',         '/img/products/peach-iced-tea.png',  '#e0973f', 1.59, 'Bestseller',    'Ripe peach, black tea, lime',       90, 21.0, 18, 4.5,  433),
  (2, 'Lemon Iced Tea',  'Classic black tea with a bright squeeze of Sicilian lemon.',           '/img/products/lemon-iced-tea.png',  '#e8b923', 1.59, 'Classic',       'Lemon zest, black tea, cane sugar', 85, 20.0, 20, 4.6,  590),
  (2, 'Berry Hibiscus',  'Tart hibiscus tea with raspberries and a touch of agave.',             '/img/products/hibiscus-berry.png',  '#a3214f', 1.79, 'Caffeine free', 'Hibiscus, raspberry, rosehip',      60, 13.0,  0, 4.7,  288),
  (2, 'Jasmine Green',   'Cold-brewed jasmine green tea, lightly sweet and floral.',             '/img/products/jasmine-green.png',   '#6f8f3a', 1.79, 'Low sugar',     'Jasmine, green tea, pear',          40,  8.0, 25, 4.6,  341),
  (2, 'Ginger Lemonade', 'Cloudy lemonade with a warming kick of fresh ginger.',                 '/img/products/ginger-lemonade.png', '#d9a441', 1.49, 'Spicy',         'Fresh ginger, lemon, honey',       110, 26.0,  0, 4.8,  517),
  (2, 'Mint Sparkling',  'Sparkling water with fresh mint. No sugar, all refresh.',              '/img/products/mint-sparkling.png',  '#5fae8c', 1.19, 'Zero sugar',    'Garden mint, cucumber',              0,  0.0,  0, 4.4,  521);
