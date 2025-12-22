-- SaintSal.ai / CookinFlips / FlipEffective Database Schema
-- Version 1.0 - Production Ready

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- LEADS TABLE - All incoming leads from forms
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  lead_type VARCHAR(50) NOT NULL, -- 'investor', 'borrower', 'wholesaler', 'contact'
  message TEXT,
  preferred_markets TEXT[], -- Array of market preferences
  investment_amount VARCHAR(100),
  source VARCHAR(100), -- Where lead came from
  affiliate_code VARCHAR(50), -- Tracks which affiliate referred them
  status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'closed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AFFILIATES TABLE - Affiliate program members
-- ============================================
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  affiliate_code VARCHAR(50) UNIQUE NOT NULL, -- 'darren', 'jr', etc.
  title VARCHAR(255),
  bio TEXT,
  image_url TEXT,
  role VARCHAR(50) DEFAULT 'affiliate', -- 'president', 'director', 'affiliate'
  team_leader_id UUID REFERENCES affiliates(id), -- Who recruited them
  commission_rate DECIMAL(5,2) DEFAULT 10.00, -- Percentage
  is_active BOOLEAN DEFAULT true,
  total_referrals INTEGER DEFAULT 0,
  total_earnings DECIMAL(12,2) DEFAULT 0,
  linkedin_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REFERRALS TABLE - Track affiliate referrals
-- ============================================
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'qualified', 'converted', 'paid'
  commission_amount DECIMAL(12,2),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROPERTIES TABLE - Wholesale properties
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20),
  price DECIMAL(12,2) NOT NULL,
  arv DECIMAL(12,2), -- After Repair Value
  equity_percentage DECIMAL(5,2),
  property_type VARCHAR(50) NOT NULL, -- 'SFR', 'Multi-Family', 'Commercial'
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1),
  sqft INTEGER,
  units INTEGER, -- For multi-family
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'under_contract', 'sold', 'off_market'
  description TEXT,
  features TEXT[],
  images TEXT[],
  assigned_agent_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROPERTY INQUIRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS property_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  inquiry_type VARCHAR(50), -- 'info_request', 'viewing', 'offer'
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVESTMENT OFFERINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS investment_offerings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  offering_type VARCHAR(100), -- 'Reg D 506(c)', 'Reg D 506(b)'
  target_return VARCHAR(50),
  minimum_investment DECIMAL(12,2),
  term VARCHAR(50),
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'coming_soon', 'closed', 'fully_funded'
  raised_amount DECIMAL(12,2) DEFAULT 0,
  target_amount DECIMAL(12,2),
  description TEXT,
  documents TEXT[], -- URLs to offering documents
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LOAN APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS loan_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  loan_type VARCHAR(100) NOT NULL, -- 'fix_flip', 'dscr', 'bridge', 'construction', 'commercial', 'cannabis'
  loan_amount DECIMAL(12,2),
  property_address TEXT,
  property_value DECIMAL(12,2),
  credit_score INTEGER,
  experience_level VARCHAR(50), -- 'first_time', 'beginner', 'experienced', 'expert'
  status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'reviewing', 'approved', 'funded', 'denied'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  source_page VARCHAR(255), -- Which page they submitted from
  affiliate_code VARCHAR(50), -- If came through affiliate link
  is_read BOOLEAN DEFAULT false,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  affiliate_code VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public read access for properties and offerings (anyone can browse)
CREATE POLICY "Public can view active properties" ON properties
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view open offerings" ON investment_offerings
  FOR SELECT USING (status IN ('open', 'coming_soon'));

-- Public can insert leads, contacts, and newsletter signups (no auth required)
CREATE POLICY "Anyone can submit leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit contacts" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit loan applications" ON loan_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit property inquiries" ON property_inquiries
  FOR INSERT WITH CHECK (true);

-- Public can view affiliates (for affiliate pages)
CREATE POLICY "Public can view active affiliates" ON affiliates
  FOR SELECT USING (is_active = true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Admins can manage leads" ON leads
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage affiliates" ON affiliates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage referrals" ON referrals
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage properties" ON properties
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage inquiries" ON property_inquiries
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage offerings" ON investment_offerings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage loan apps" ON loan_applications
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage contacts" ON contact_submissions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage subscribers" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_affiliate_code ON leads(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_team_leader ON affiliates(team_leader_id);

CREATE INDEX IF NOT EXISTS idx_referrals_affiliate ON referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON contact_submissions(is_read);
