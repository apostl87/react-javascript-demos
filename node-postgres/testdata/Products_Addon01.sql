-- Add a new column for image URLs if it doesn't exist
ALTER TABLE products ADD COLUMN image_url VARCHAR(255);

-- Update each product with a random image URL
UPDATE products
SET image_url = CONCAT('https://picsum.photos/seed/', FLOOR(RANDOM() * 1000), '/200/300')
WHERE image_url IS NULL OR image_url = '';
