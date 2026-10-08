-- AgriConnect MySQL Database Setup
CREATE DATABASE IF NOT EXISTS agriconnect;
USE agriconnect;

-- Tables are auto-created by Spring JPA (ddl-auto=update)
-- This script seeds initial data after first run

-- Insert sample farmers
INSERT IGNORE INTO users (username, email, password, role, full_name, phone_number, created_at) VALUES
('raju_farmer',  'raju@farm.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9i', 'FARMER',   'Raju Kumar',   '9876543210', NOW()),
('meena_farmer', 'meena@farm.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9i', 'FARMER',   'Meena Devi',   '9876543211', NOW()),
('suresh_farmer','suresh@farm.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9i', 'FARMER',   'Suresh Reddy', '9876543212', NOW());
-- password for all: password123

-- Insert sample customers
INSERT IGNORE INTO users (username, email, password, role, full_name, phone_number, created_at) VALUES
('priya_customer','priya@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9i', 'CUSTOMER', 'Priya Sharma', '9123456789', NOW()),
('raj_customer',  'raj@gmail.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9i', 'CUSTOMER', 'Raj Patel',    '9123456790', NOW());

-- Insert sample products (farmer_id will be 1, 2, 3 from above)
INSERT IGNORE INTO products (name, description, price, category, image_url, stock_qty, farmer_id, rating, review_count, is_available, unit, created_at) VALUES
('Basmati Rice Premium', 'Long grain aged Basmati rice from Dehradun. Aromatic and fluffy when cooked.', 120.0, 'Rice', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', 200, 1, 4.8, 120, true, 'kg', NOW()),
('Sona Masoori Rice', 'Lightweight, aromatic medium grain rice ideal for daily cooking.', 65.0, 'Rice', 'https://images.unsplash.com/photo-1536304993881-ff86e6b65e7a?w=400', 300, 1, 4.5, 89, true, 'kg', NOW()),
('Brown Rice', 'Organic whole grain brown rice, high in fiber and nutrients.', 90.0, 'Rice', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', 150, 1, 4.3, 45, true, 'kg', NOW()),
('Jeera Rice', 'Fragrant jeera (cumin) rice variety, perfect for biryani.', 80.0, 'Rice', 'https://images.unsplash.com/photo-1536304993881-ff86e6b65e7a?w=400', 100, 1, 4.6, 67, true, 'kg', NOW()),

('Fresh Tomatoes', 'Farm-fresh red tomatoes, harvested this morning. Rich in lycopene.', 25.0, 'Vegetables', 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400', 500, 2, 4.7, 200, true, 'kg', NOW()),
('Green Spinach', 'Tender fresh spinach leaves, organically grown without pesticides.', 20.0, 'Vegetables', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', 300, 2, 4.4, 85, true, 'bunch', NOW()),
('Fresh Onions', 'Premium quality onions with strong flavor. Essential kitchen staple.', 30.0, 'Vegetables', 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400', 600, 2, 4.2, 150, true, 'kg', NOW()),
('Green Peas', 'Fresh green peas straight from the pod. Sweet and nutritious.', 45.0, 'Vegetables', 'https://images.unsplash.com/photo-1565699007-c553d8f57698?w=400', 200, 2, 4.6, 78, true, 'kg', NOW()),
('Carrots', 'Bright orange carrots, crunchy and sweet. Rich in beta-carotene.', 35.0, 'Vegetables', 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400', 400, 2, 4.5, 92, true, 'kg', NOW()),
('Cauliflower', 'White, firm cauliflower heads. Freshly harvested from organic farm.', 40.0, 'Vegetables', 'https://images.unsplash.com/photo-1568584711271-6b9c7e1c0b71?w=400', 180, 2, 4.3, 63, true, 'piece', NOW()),

('Alphonso Mangoes', 'King of mangoes! Premium Alphonso from Ratnagiri. Sweet and saffron-colored.', 250.0, 'Fruits', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400', 100, 3, 4.9, 340, true, 'dozen', NOW()),
('Fresh Bananas', 'Robusta bananas, ripe and ready to eat. Potassium-rich and energy-boosting.', 50.0, 'Fruits', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', 500, 3, 4.4, 210, true, 'dozen', NOW()),
('Pomegranates', 'Juicy Bhagwa pomegranates, bursting with ruby-red arils. Rich in antioxidants.', 120.0, 'Fruits', 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400', 150, 3, 4.7, 128, true, 'kg', NOW()),
('Guava', 'Green guavas with pink flesh. Sweet, crunchy and vitamin C rich.', 40.0, 'Fruits', 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400', 200, 3, 4.3, 75, true, 'kg', NOW()),
('Papaya', 'Ripe papaya with orange flesh. Digestive and delicious.', 35.0, 'Fruits', 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400', 120, 3, 4.1, 58, true, 'kg', NOW()),
('Coconuts', 'Fresh tender coconuts from coastal farms. Hydrating coconut water inside.', 30.0, 'Fruits', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', 300, 3, 4.6, 189, true, 'piece', NOW()),

('Fresh Milk', 'A2 cow milk from desi cows. Collected twice daily, farm-fresh.', 60.0, 'Dairy', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', 200, 1, 4.8, 245, true, 'litre', NOW()),
('Paneer', 'Fresh homemade paneer from pure cow milk. Soft and rich in protein.', 80.0, 'Dairy', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', 100, 1, 4.7, 167, true, '200g', NOW()),
('Turmeric Powder', 'Organic Erode turmeric, highly potent with 4%+ curcumin content.', 90.0, 'Spices', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400', 300, 2, 4.8, 198, true, '250g', NOW()),
('Red Chilli Powder', 'Guntur red chilli powder, hot and flavourful. Naturally dried and ground.', 70.0, 'Spices', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400', 250, 2, 4.5, 132, true, '200g', NOW()),
('Coriander Seeds', 'Whole coriander seeds, freshly harvested and sun-dried. Aromatic and earthy.', 50.0, 'Spices', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400', 200, 3, 4.4, 89, true, '200g', NOW()),
('Black Pepper', 'Malabar black pepper, king of spices. Bold flavor and rich aroma.', 150.0, 'Spices', 'https://images.unsplash.com/photo-1599598425947-5202edd56bdb?w=400', 150, 3, 4.9, 215, true, '100g', NOW());
