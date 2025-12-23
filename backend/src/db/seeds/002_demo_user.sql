-- Create demo user (password: demo123)
-- Password hash for 'demo123' with bcrypt rounds 12
INSERT INTO users (email, password_hash, first_name, last_name, email_verified, auth_provider) VALUES
  ('demo@luxeshare.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.Z5uDQoqXlKhSGG', 'Demo', 'User', true, 'local')
ON CONFLICT (email) DO NOTHING;
