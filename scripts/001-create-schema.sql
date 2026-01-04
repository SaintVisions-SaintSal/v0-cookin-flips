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

-- ============================================
-- RESEARCH CONVERSATIONS TABLE - SaintSal AI searches
-- ============================================
CREATE TABLE IF NOT EXISTS research_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  query TEXT NOT NULL,
  results JSONB, -- Stores search results
  ai_analysis TEXT, -- SaintSal AI analysis response
  detected_type VARCHAR(50), -- 'lending', 'real-estate', 'stocks', 'property-analysis', 'general'
  recommended_platforms TEXT[], -- Array of recommended platform keys
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROPERTY ANALYSES TABLE - Deal analyzer submissions
-- ============================================
CREATE TABLE IF NOT EXISTS property_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL for guest submissions

  -- Property Info
  property_address VARCHAR(255) NOT NULL,
  total_sqft INTEGER,
  evaluator_name VARCHAR(255),
  property_description TEXT,

  -- Property Values
  after_repair_value DECIMAL(12,2),
  current_as_is_value DECIMAL(12,2),
  estimated_repair_costs DECIMAL(12,2),
  maximum_allowable_offer DECIMAL(12,2),
  purchase_price DECIMAL(12,2),
  estimated_hold_time INTEGER, -- in months
  misc_costs DECIMAL(12,2),

  -- Financing Costs
  first_mortgage_amount DECIMAL(12,2),
  first_mortgage_points DECIMAL(5,2),
  first_mortgage_interest_rate DECIMAL(5,2),
  second_mortgage_amount DECIMAL(12,2),
  second_mortgage_points DECIMAL(5,2),
  second_mortgage_interest_rate DECIMAL(5,2),
  repair_financing_amount DECIMAL(12,2),
  repair_financing_points DECIMAL(5,2),
  repair_financing_interest_rate DECIMAL(5,2),

  -- Holding Costs (monthly)
  monthly_property_taxes DECIMAL(12,2),
  monthly_hoa DECIMAL(12,2),
  monthly_insurance DECIMAL(12,2),
  monthly_utilities DECIMAL(12,2),
  monthly_other_holding DECIMAL(12,2),

  -- Buying Transaction Costs
  buying_escrow_fee DECIMAL(12,2),
  buying_title_insurance DECIMAL(12,2),
  buying_misc_costs DECIMAL(12,2),

  -- Selling Transaction Costs
  selling_escrow_fee DECIMAL(12,2),
  selling_title_insurance DECIMAL(12,2),
  selling_transfer_taxes DECIMAL(12,2),
  selling_home_warranty DECIMAL(12,2),
  selling_staging_costs DECIMAL(12,2),
  selling_agent_commission_rate DECIMAL(5,2),
  selling_misc_costs DECIMAL(12,2),

  -- Calculated Results
  total_financing_costs DECIMAL(12,2),
  total_holding_costs DECIMAL(12,2),
  total_buying_costs DECIMAL(12,2),
  total_selling_costs DECIMAL(12,2),
  total_costs DECIMAL(12,2),
  estimated_net_profit DECIMAL(12,2),
  purchase_rehab_roi DECIMAL(8,2),
  total_costs_roi DECIMAL(8,2),
  my_committed_capital DECIMAL(12,2),
  repair_cost_per_sqft DECIMAL(12,2),
  annualized_cash_on_cash DECIMAL(8,2),

  -- AI Verdict
  ai_verdict VARCHAR(50), -- 'EXCELLENT DEAL', 'GOOD OPPORTUNITY', 'PROCEED WITH CAUTION', 'NOT RECOMMENDED'

  -- Metadata
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'submitted', 'reviewed'
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RLS FOR NEW TABLES
-- ============================================

-- Enable RLS
ALTER TABLE research_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_analyses ENABLE ROW LEVEL SECURITY;

-- Research conversations - users can only see their own
CREATE POLICY "Users can view own research" ON research_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own research" ON research_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own research" ON research_conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own research" ON research_conversations
  FOR DELETE USING (auth.uid() = user_id);

-- Property analyses - anyone can submit, users can view their own
CREATE POLICY "Anyone can submit property analysis" ON property_analyses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own analyses" ON property_analyses
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own analyses" ON property_analyses
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can manage all
CREATE POLICY "Admins can manage research" ON research_conversations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage analyses" ON property_analyses
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- INDEXES FOR NEW TABLES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_research_user_id ON research_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_research_created_at ON research_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_research_detected_type ON research_conversations(detected_type);

CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON property_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON property_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_address ON property_analyses(property_address);
CREATE INDEX IF NOT EXISTS idx_analyses_verdict ON property_analyses(ai_verdict);
