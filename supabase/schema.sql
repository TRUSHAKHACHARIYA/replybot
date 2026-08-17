-- =============================================
-- ReplyBot Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- =============================================

-- 1. Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  shop_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  niche TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin')),
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'standard', 'growth')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Shops
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  welcome_message TEXT NOT NULL DEFAULT 'Hello! How can I help you today?',
  after_hours_message TEXT NOT NULL DEFAULT 'Thanks for reaching out! We''re currently closed. We''ll get back to you soon.',
  bot_active BOOLEAN NOT NULL DEFAULT true,
  platform TEXT NOT NULL DEFAULT 'whatsapp' CHECK (platform IN ('whatsapp', 'instagram', 'both')),
  messages_used INT NOT NULL DEFAULT 0,
  messages_limit INT NOT NULL DEFAULT 300,
  business_hours JSONB NOT NULL DEFAULT '[
    {"day":"Monday","open":"09:00","close":"20:00","enabled":true},
    {"day":"Tuesday","open":"09:00","close":"20:00","enabled":true},
    {"day":"Wednesday","open":"09:00","close":"20:00","enabled":true},
    {"day":"Thursday","open":"09:00","close":"20:00","enabled":true},
    {"day":"Friday","open":"09:00","close":"20:00","enabled":true},
    {"day":"Saturday","open":"10:00","close":"18:00","enabled":true},
    {"day":"Sunday","open":"","close":"","enabled":false}
  ]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  customer_phone TEXT NOT NULL,
  customer_name TEXT NOT NULL DEFAULT '',
  platform TEXT NOT NULL DEFAULT 'whatsapp',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'escalated')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('customer', 'bot', 'owner')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shops_owner ON shops(owner_id);
CREATE INDEX IF NOT EXISTS idx_faqs_shop ON faqs(shop_id);
CREATE INDEX IF NOT EXISTS idx_conversations_shop ON conversations(shop_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Owners can read own shops" ON shops FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Owners can create shops" ON shops FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners can update own shops" ON shops FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Owners can delete own shops" ON shops FOR DELETE USING (owner_id = auth.uid());

CREATE POLICY "Owners can read own FAQs" ON faqs FOR SELECT USING (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()));
CREATE POLICY "Owners can create FAQs" ON faqs FOR INSERT WITH CHECK (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()));
CREATE POLICY "Owners can update own FAQs" ON faqs FOR UPDATE USING (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()));
CREATE POLICY "Owners can delete own FAQs" ON faqs FOR DELETE USING (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()));

CREATE POLICY "Owners can read own conversations" ON conversations FOR SELECT USING (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()));
CREATE POLICY "Owners can update own conversations" ON conversations FOR UPDATE USING (shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()));

CREATE POLICY "Owners can read own messages" ON messages FOR SELECT USING (conversation_id IN (SELECT c.id FROM conversations c JOIN shops s ON c.shop_id = s.id WHERE s.owner_id = auth.uid()));

-- Admin policies (admins see everything)
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can read all shops" ON shops FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can read all conversations" ON conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can read all messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =============================================
-- SEED DATA: Run after creating auth users
-- =============================================

-- Step 1: Create auth users via Supabase Dashboard > Auth > Users
-- Create these 4 users:
--   admin@replybot.com / admin123
--   priya@styleboutique.com / shop123
--   meera@glowsalon.com / shop123
--   ankit@freshbakes.com / shop123

-- Step 2: After creating auth users, their IDs will be UUIDs.
-- Replace the placeholder UUIDs below with the actual auth user IDs.

-- Example seed (replace UUIDs with your actual auth user IDs):

/*
INSERT INTO profiles (id, email, name, shop_name, phone, niche, role, plan) VALUES
  ('PASTE_ADMIN_UUID_HERE', 'admin@replybot.com', 'Admin User', 'ReplyBot Admin', '+91 99999 00000', 'admin', 'admin', 'growth'),
  ('PASTE_PRIYA_UUID_HERE', 'priya@styleboutique.com', 'Priya Sharma', 'Style Boutique', '+91 98765 43210', 'boutique', 'owner', 'standard'),
  ('PASTE_MEERA_UUID_HERE', 'meera@glowsalon.com', 'Meera Joshi', 'Glow Salon', '+91 87654 32109', 'salon', 'owner', 'growth'),
  ('PASTE_ANKIT_UUID_HERE', 'ankit@freshbakes.com', 'Ankit Patel', 'Fresh Bakes', '+91 76543 21098', 'bakery', 'owner', 'starter');

-- Style Boutique shop
INSERT INTO shops (id, owner_id, name, welcome_message, after_hours_message, bot_active, platform, messages_used, messages_limit) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'PASTE_PRIYA_UUID_HERE', 'Style Boutique', 'Hello! Welcome to Style Boutique. How can I help you today?', 'Thanks for reaching out! We''re currently closed. We''ll get back to you in the morning.', true, 'both', 847, 800);

INSERT INTO faqs (shop_id, question, answer) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'What are your store hours?', 'We''re open Mon-Fri 9AM-8PM, Sat 10AM-6PM. Closed on Sundays.'),
  ('a0000000-0000-0000-0000-000000000001', 'Where is the store located?', 'We''re at 123 Main Street, near the central market.'),
  ('a0000000-0000-0000-0000-000000000001', 'Do you deliver?', 'Yes! Free delivery on orders above $50. Standard delivery fee is $5.'),
  ('a0000000-0000-0000-0000-000000000001', 'What are your prices?', 'Kurtas start at $20, sarees from $45, and lehengas from $80. Visit us for the full collection!'),
  ('a0000000-0000-0000-0000-000000000001', 'Is this item in stock?', 'I can check! Please tell me the item name and size you''re looking for.');

-- Glow Salon shop
INSERT INTO shops (id, owner_id, name, welcome_message, after_hours_message, bot_active, platform, messages_used, messages_limit) VALUES
  ('a0000000-0000-0000-0000-000000000002', 'PASTE_MEERA_UUID_HERE', 'Glow Salon', 'Hi there! Welcome to Glow Salon. How can I assist you?', 'We''re closed right now. Leave your details and we''ll book your appointment!', true, 'both', 1203, 2000);

INSERT INTO faqs (shop_id, question, answer) VALUES
  ('a0000000-0000-0000-0000-000000000002', 'What services do you offer?', 'We offer haircuts, styling, facials, waxing, and bridal packages.'),
  ('a0000000-0000-0000-0000-000000000002', 'What are your prices?', 'Haircuts from $10, facials from $25, bridal packages from $150.'),
  ('a0000000-0000-0000-0000-000000000002', 'Do I need an appointment?', 'Walk-ins welcome, but appointments guarantee no wait time.'),
  ('a0000000-0000-0000-0000-000000000002', 'What are your timings?', 'We''re open Tue-Sun, 10AM-8PM. Closed on Mondays.');

-- Fresh Bakes shop
INSERT INTO shops (id, owner_id, name, welcome_message, after_hours_message, bot_active, platform, messages_used, messages_limit) VALUES
  ('a0000000-0000-0000-0000-000000000003', 'PASTE_ANKIT_UUID_HERE', 'Fresh Bakes', 'Hey! Welcome to Fresh Bakes. What would you like to order?', 'We''re closed! Check our tomorrow''s menu on our page.', true, 'whatsapp', 234, 300);

INSERT INTO faqs (shop_id, question, answer) VALUES
  ('a0000000-0000-0000-0000-000000000003', 'What''s on the menu today?', 'Today we have chocolate cake, cheese croissants, garlic bread, and brownies.'),
  ('a0000000-0000-0000-0000-000000000003', 'Do you offer delivery?', 'Yes! Free delivery within 5km. $3 delivery fee for further areas.'),
  ('a0000000-0000-0000-0000-000000000003', 'How do I place an order?', 'Just tell me what you''d like and your address. We''ll confirm and deliver!');

-- Sample conversations
INSERT INTO conversations (id, shop_id, customer_phone, customer_name, platform, status) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '+91 91111 11111', 'Anita Kumar', 'whatsapp', 'active'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', '+91 92222 22222', 'Rahul Verma', 'instagram', 'resolved'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', '+91 93333 33333', 'Sneha Patel', 'whatsapp', 'escalated');

INSERT INTO messages (conversation_id, sender, content) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'customer', 'Hi! Do you have the blue kurta?'),
  ('b0000000-0000-0000-0000-000000000001', 'bot', 'Hello! Yes, we have the blue kurta in stock. Would you like to know the price and available sizes?'),
  ('b0000000-0000-0000-0000-000000000001', 'customer', 'Yes please, what sizes do you have?'),
  ('b0000000-0000-0000-0000-000000000001', 'bot', 'The blue kurta is available in S, M, L, and XL. It''s priced at $25. Would you like to place an order?'),
  ('b0000000-0000-0000-0000-000000000002', 'customer', 'What are your store timings?'),
  ('b0000000-0000-0000-0000-000000000002', 'bot', 'We''re open Mon-Fri 9AM-8PM, Sat 10AM-6PM. Closed on Sundays.'),
  ('b0000000-0000-0000-0000-000000000003', 'customer', 'Can you deliver to Andheri West?'),
  ('b0000000-0000-0000-0000-000000000003', 'bot', 'Yes! We deliver to Andheri West. Free delivery on orders above $50.'),
  ('b0000000-0000-0000-0000-000000000003', 'customer', 'Great, I want to order 3 kurtas in different colors');
*/
