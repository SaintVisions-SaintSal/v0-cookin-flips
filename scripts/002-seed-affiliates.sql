-- Seed Affiliate Program Leadership
-- Darren Brown - CEO & President
-- JR Taber - President

INSERT INTO affiliates (
  name,
  email,
  phone,
  affiliate_code,
  title,
  bio,
  image_url,
  role,
  commission_rate,
  linkedin_url,
  website_url,
  is_active
) VALUES 
(
  'Darren Brown',
  'darren@flipeffective.com',
  '(949) 630-1858',
  'darren',
  'CEO of FlipEffective | President of SaintSal™ Affiliate Program',
  'Chief Executive Officer of FlipEffective and President of the SaintSal™ Trademarked Affiliate Program. Under Darren''s leadership, the firm has managed and co-invested in multiple institutional investment funds, raising over $1 billion in debt and equity financing. His strategic vision has facilitated the acquisition and resolution of distressed residential assets exceeding $3 billion since 2007. Now leading FlipEffective''s expansion and affiliate team recruitment nationwide.',
  '/images/DRIPLOGOSAINT_.png',
  'president',
  15.00,
  'https://linkedin.com/in/darrenbrown',
  'https://saintsal.ai/darren',
  true
),
(
  'JR Taber',
  'jr@saintsal.ai',
  NULL,
  'jr',
  'President of SaintSal™ Affiliate Program | VP Director of Lending',
  'President of the SaintSal™ Trademarked Affiliate Program and VP Director of Lending with extensive experience in commercial lending operations. JR leads our lending division ensuring seamless deal execution across all 51 states. Expert in structuring complex financing solutions. Now actively recruiting and building his affiliate team nationwide.',
  '/images/TRANSPARENTSAINTSALLOGO.png',
  'president',
  15.00,
  'https://linkedin.com/in/jrtaber',
  'https://saintsal.ai/jr',
  true
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  role = EXCLUDED.role,
  updated_at = NOW();
