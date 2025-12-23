-- Seed categories
INSERT INTO categories (name, slug, image) VALUES
  ('Men''s Clothing', 'mens-clothing', 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800'),
  ('Women''s Clothing', 'womens-clothing', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'),
  ('Jewelery', 'jewelery', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'),
  ('Electronics', 'electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800')
ON CONFLICT (name) DO NOTHING;
