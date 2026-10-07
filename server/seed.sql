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
  ('Cola',   'https://images.unsplash.com/photo-1629654613528-5d0a2e4166de?auto=format&fit=crop&w=900&h=900&q=75', '#fc4a55'),
  ('Lemon',  'https://images.unsplash.com/photo-1619032580077-6160b89e2398?auto=format&fit=crop&w=900&h=900&q=75', '#ffcc02'),
  ('Lime',   'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=900&h=900&q=75',    '#92ba3c'),
  ('Berry',  'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=900&h=900&q=75', '#fb6cb2'),
  ('Orange', 'https://images.unsplash.com/photo-1641659735894-45046caad624?auto=format&fit=crop&w=900&h=900&q=75', '#ffb42b');

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
  ('Sodas',              'Fizzy classics',      'https://images.unsplash.com/photo-1696739696220-8d2e27465662?auto=format&fit=crop&w=700&h=700&q=75', '#162527'),
  ('Iced teas and more', 'Cold, light, fresh',  'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=700&h=700&q=75', '#202011');

-- The product cards
DELETE FROM products;
INSERT INTO products (productName, productDescription, productImg) VALUES
  ('Classic Cola',     'The original fizz: crisp, sweet and best over a glass full of ice.',          'https://images.unsplash.com/photo-1629186235045-80d4147d90dc?auto=format&fit=crop&w=600&h=600&q=75'),
  ('Lime Fizz',        'Sparkling water with fresh lime and a hint of mint. Light and zesty.',          'https://images.unsplash.com/photo-1651993737174-6890c1daef5b?auto=format&fit=crop&w=600&h=600&q=75'),
  ('Orange Pop',       'Bright orange soda in a glass bottle, bursting with real citrus flavour.',      'https://images.unsplash.com/photo-1566846128021-b940b0eec910?auto=format&fit=crop&w=600&h=600&q=75'),
  ('Peach Iced Tea',   'Black tea brewed cold with ripe peach and a squeeze of lime.',                  'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&h=600&q=75'),
  ('Mint Sparkling',   'Sparkling water with fresh mint leaves and a few orange slices.',                'https://images.unsplash.com/photo-1610378833220-9e374e37856b?auto=format&fit=crop&w=600&h=600&q=75'),
  ('Root Beer',        'Creamy, spiced and smooth. Poured straight from the tap, served cold.',         'https://images.unsplash.com/photo-1499961024600-ad094db305cc?auto=format&fit=crop&w=600&h=600&q=75');
