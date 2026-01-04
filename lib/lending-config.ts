// Saint Vision Group - Complete Lending Suite Configuration
// All loan products with real rates - SaintSal™ Powered

export interface LoanProduct {
  id: string
  name: string
  category: 'residential' | 'commercial' | 'business' | 'specialty'
  minRate: number | string
  maxRate: number | string
  baseRate?: number
  minAmount: number
  maxAmount: number
  minTerm?: number
  maxTerm?: number
  termOptions?: number[]
  termUnit?: 'months' | 'years'
  minLTV?: number
  maxLTV?: number
  maxLTC?: number
  maxARV?: number
  minCredit?: number
  minDSCR?: number
  points?: number
  mip?: number
  upfrontMIP?: number
  fundingFee?: number
  guaranteeFee?: number
  annualFee?: number
  advanceRate?: number
  minFactor?: number
  maxFactor?: number
  revenueShare?: string
  feeRange?: string
  downPayment?: number
  setupFee?: number
  monthlyFee?: number
  minAge?: number
  maxCLTV?: number
  description: string
  features?: string[]
  highlight?: boolean
  icon?: string
}

export const LOAN_PRODUCTS: Record<string, LoanProduct> = {
  // ============================================
  // RESIDENTIAL LOANS
  // ============================================
  conventional: {
    id: 'conventional',
    name: 'Conventional Mortgage',
    category: 'residential',
    minRate: 6.25,
    maxRate: 7.75,
    minAmount: 50000,
    maxAmount: 766550,
    minTerm: 15,
    maxTerm: 30,
    termOptions: [15, 20, 30],
    termUnit: 'years',
    minLTV: 80,
    maxLTV: 97,
    minCredit: 620,
    description: 'Traditional mortgage for primary, secondary, or investment properties',
    features: ['Low rates', 'PMI removal at 80% LTV', 'Multiple term options', 'Rate lock available'],
    icon: '🏠'
  },
  fha: {
    id: 'fha',
    name: 'FHA Loan',
    category: 'residential',
    minRate: 5.75,
    maxRate: 7.25,
    minAmount: 50000,
    maxAmount: 472030,
    minTerm: 15,
    maxTerm: 30,
    termOptions: [15, 30],
    termUnit: 'years',
    maxLTV: 96.5,
    minCredit: 580,
    mip: 0.55,
    upfrontMIP: 1.75,
    description: 'Government-backed loan with low down payment for first-time buyers',
    features: ['3.5% down payment', 'Lower credit requirements', 'Gift funds allowed', 'Assumable'],
    icon: '🏛️'
  },
  va: {
    id: 'va',
    name: 'VA Loan',
    category: 'residential',
    minRate: 5.50,
    maxRate: 7.00,
    minAmount: 50000,
    maxAmount: 2000000,
    minTerm: 15,
    maxTerm: 30,
    termOptions: [15, 30],
    termUnit: 'years',
    maxLTV: 100,
    minCredit: 580,
    fundingFee: 2.15,
    description: 'Zero down payment for veterans and active duty military',
    features: ['No down payment', 'No PMI', 'Competitive rates', 'Assumable'],
    icon: '🎖️'
  },
  usda: {
    id: 'usda',
    name: 'USDA Loan',
    category: 'residential',
    minRate: 5.75,
    maxRate: 7.25,
    minAmount: 50000,
    maxAmount: 500000,
    minTerm: 30,
    maxTerm: 30,
    termOptions: [30],
    termUnit: 'years',
    maxLTV: 100,
    minCredit: 640,
    guaranteeFee: 1.0,
    annualFee: 0.35,
    description: 'Zero down payment for eligible rural and suburban areas',
    features: ['No down payment', 'Low PMI equivalent', 'Income limits apply', 'Geographic restrictions'],
    icon: '🌾'
  },
  jumbo: {
    id: 'jumbo',
    name: 'Jumbo Loan',
    category: 'residential',
    minRate: 6.50,
    maxRate: 8.00,
    minAmount: 766551,
    maxAmount: 5000000,
    minTerm: 15,
    maxTerm: 30,
    termOptions: [15, 30],
    termUnit: 'years',
    minLTV: 80,
    maxLTV: 90,
    minCredit: 700,
    description: 'Loans above conforming limits for luxury properties',
    features: ['High loan amounts', 'Luxury properties', 'Flexible terms', 'Portfolio lending'],
    icon: '🏰'
  },
  dscr: {
    id: 'dscr',
    name: 'DSCR Rental Loan',
    category: 'residential',
    minRate: 7.25,
    maxRate: 9.50,
    minAmount: 75000,
    maxAmount: 3000000,
    minTerm: 30,
    maxTerm: 30,
    termOptions: [30],
    termUnit: 'years',
    minLTV: 75,
    maxLTV: 80,
    minCredit: 660,
    minDSCR: 1.0,
    description: 'Investment property loan based on rental income - no tax returns!',
    features: ['No income verification', 'No tax returns', 'Based on rental income', 'Unlimited properties'],
    highlight: true,
    icon: '📊'
  },
  hard_money_res: {
    id: 'hard_money_res',
    name: 'Hard Money (Residential)',
    category: 'residential',
    minRate: 10.0,
    maxRate: 14.0,
    minAmount: 50000,
    maxAmount: 2000000,
    minTerm: 6,
    maxTerm: 24,
    termOptions: [6, 12, 18, 24],
    termUnit: 'months',
    minLTV: 65,
    maxLTV: 70,
    minCredit: 550,
    points: 2,
    description: 'Fast asset-based lending for real estate investors',
    features: ['Close in 5-10 days', 'Credit flexible', 'Asset-based', 'No income docs'],
    icon: '💰'
  },
  fix_flip: {
    id: 'fix_flip',
    name: 'Fix & Flip Loan',
    category: 'residential',
    minRate: 9.5,
    maxRate: 13.0,
    minAmount: 75000,
    maxAmount: 3000000,
    minTerm: 6,
    maxTerm: 18,
    termOptions: [6, 9, 12, 18],
    termUnit: 'months',
    maxLTC: 90,
    maxARV: 70,
    minCredit: 620,
    points: 1.5,
    description: 'Purchase + rehab financing for house flippers',
    features: ['90% of purchase', '100% of rehab', 'Draw schedule', 'Interest-only'],
    highlight: true,
    icon: '🔨'
  },
  bridge_res: {
    id: 'bridge_res',
    name: 'Bridge Loan (Residential)',
    category: 'residential',
    minRate: 8.5,
    maxRate: 12.0,
    minAmount: 100000,
    maxAmount: 5000000,
    minTerm: 6,
    maxTerm: 24,
    termOptions: [6, 12, 18, 24],
    termUnit: 'months',
    maxLTV: 75,
    minCredit: 620,
    description: 'Short-term financing to bridge transactions',
    features: ['Quick closing', 'Flexible terms', 'No prepayment penalty', 'Interest-only'],
    icon: '🌉'
  },
  construction_res: {
    id: 'construction_res',
    name: 'Construction Loan (Residential)',
    category: 'residential',
    minRate: 7.5,
    maxRate: 10.0,
    minAmount: 100000,
    maxAmount: 5000000,
    minTerm: 12,
    maxTerm: 24,
    termOptions: [12, 18, 24],
    termUnit: 'months',
    maxLTC: 85,
    minCredit: 680,
    description: 'Ground-up residential construction financing',
    features: ['Draw schedule', 'One-time close option', 'Converts to perm', 'Lot purchase included'],
    icon: '🏗️'
  },
  heloc: {
    id: 'heloc',
    name: 'HELOC',
    category: 'residential',
    minRate: 7.99,
    maxRate: 12.0,
    minAmount: 10000,
    maxAmount: 500000,
    minTerm: 10,
    maxTerm: 30,
    termOptions: [10, 15, 20],
    termUnit: 'years',
    maxCLTV: 85,
    minCredit: 680,
    description: 'Revolving home equity line of credit',
    features: ['Draw as needed', 'Interest-only option', 'Reusable credit', 'Tax deductible'],
    icon: '💳'
  },
  home_equity: {
    id: 'home_equity',
    name: 'Home Equity Loan',
    category: 'residential',
    minRate: 7.25,
    maxRate: 11.0,
    minAmount: 10000,
    maxAmount: 500000,
    minTerm: 5,
    maxTerm: 30,
    termOptions: [5, 10, 15, 20, 30],
    termUnit: 'years',
    maxLTV: 80,
    minCredit: 660,
    description: 'Lump sum second mortgage with fixed rate',
    features: ['Fixed rate', 'Lump sum', 'Predictable payments', 'Tax deductible'],
    icon: '🏡'
  },
  reverse: {
    id: 'reverse',
    name: 'Reverse Mortgage (HECM)',
    category: 'residential',
    minRate: 6.0,
    maxRate: 8.5,
    minAmount: 0,
    maxAmount: 1149825,
    maxLTV: 60,
    minAge: 62,
    description: 'Access home equity without monthly payments - 62+ years old',
    features: ['No monthly payments', 'Stay in your home', 'Tax-free funds', 'FHA insured'],
    icon: '👴'
  },
  cashout_refi: {
    id: 'cashout_refi',
    name: 'Cash-Out Refinance',
    category: 'residential',
    minRate: 6.50,
    maxRate: 8.00,
    minAmount: 50000,
    maxAmount: 2000000,
    minTerm: 15,
    maxTerm: 30,
    termOptions: [15, 20, 30],
    termUnit: 'years',
    maxLTV: 80,
    minCredit: 620,
    description: 'Refinance and take cash from your home equity',
    features: ['Access equity', 'Lower rate possible', 'Consolidate debt', 'Home improvements'],
    icon: '💵'
  },
  non_qm: {
    id: 'non_qm',
    name: 'Non-QM Loan',
    category: 'residential',
    minRate: 7.50,
    maxRate: 10.0,
    minAmount: 100000,
    maxAmount: 3000000,
    minTerm: 30,
    maxTerm: 30,
    termOptions: [30],
    termUnit: 'years',
    maxLTV: 80,
    minCredit: 620,
    description: 'Bank statement, asset depletion, foreign national loans',
    features: ['Bank statements only', 'Self-employed friendly', 'Asset depletion', 'Foreign nationals'],
    icon: '📋'
  },

  // ============================================
  // COMMERCIAL LOANS
  // ============================================
  cre: {
    id: 'cre',
    name: 'Commercial Real Estate',
    category: 'commercial',
    minRate: 6.75,
    maxRate: 9.0,
    minAmount: 500000,
    maxAmount: 50000000,
    minTerm: 5,
    maxTerm: 25,
    termOptions: [5, 7, 10, 15, 20, 25],
    termUnit: 'years',
    maxLTV: 80,
    minDSCR: 1.25,
    description: 'Office, retail, industrial, and flex space financing',
    features: ['Multiple property types', 'Interest-only option', 'Recourse & non-recourse', 'Portfolio lending'],
    icon: '🏢'
  },
  multifamily: {
    id: 'multifamily',
    name: 'Multi-Family (5+ Units)',
    category: 'commercial',
    minRate: 6.25,
    maxRate: 8.0,
    minAmount: 500000,
    maxAmount: 100000000,
    minTerm: 5,
    maxTerm: 30,
    termOptions: [5, 7, 10, 12, 15, 30],
    termUnit: 'years',
    maxLTV: 80,
    minDSCR: 1.20,
    description: 'Apartment building and multi-unit financing',
    features: ['Fannie/Freddie programs', 'Non-recourse options', 'Supplemental loans', 'Bridge to perm'],
    highlight: true,
    icon: '🏨'
  },
  mixed_use: {
    id: 'mixed_use',
    name: 'Mixed-Use Property',
    category: 'commercial',
    minRate: 7.0,
    maxRate: 9.0,
    minAmount: 250000,
    maxAmount: 20000000,
    minTerm: 5,
    maxTerm: 25,
    termOptions: [5, 7, 10, 15, 25],
    termUnit: 'years',
    maxLTV: 75,
    minDSCR: 1.25,
    description: 'Commercial and residential combination properties',
    features: ['Flexible ratios', 'Multiple income streams', 'Value-add potential', 'Urban locations'],
    icon: '🏬'
  },
  bridge_comm: {
    id: 'bridge_comm',
    name: 'Commercial Bridge',
    category: 'commercial',
    minRate: 9.0,
    maxRate: 13.0,
    minAmount: 500000,
    maxAmount: 50000000,
    minTerm: 12,
    maxTerm: 36,
    termOptions: [12, 24, 36],
    termUnit: 'months',
    maxLTV: 75,
    points: 1.5,
    description: 'Transitional commercial financing for value-add opportunities',
    features: ['Quick closing', 'Value-add/lease-up', 'Repositioning', 'Flexible prepay'],
    icon: '🚀'
  },
  construction_comm: {
    id: 'construction_comm',
    name: 'Commercial Construction',
    category: 'commercial',
    minRate: 8.5,
    maxRate: 12.0,
    minAmount: 1000000,
    maxAmount: 100000000,
    minTerm: 18,
    maxTerm: 36,
    termOptions: [18, 24, 36],
    termUnit: 'months',
    maxLTC: 80,
    description: 'Ground-up commercial development financing',
    features: ['Draw schedule', 'Pre-leasing bonuses', 'Converts to perm', 'JV structures'],
    icon: '🏗️'
  },
  hard_money_comm: {
    id: 'hard_money_comm',
    name: 'Commercial Hard Money',
    category: 'commercial',
    minRate: 11.0,
    maxRate: 15.0,
    minAmount: 250000,
    maxAmount: 20000000,
    minTerm: 6,
    maxTerm: 24,
    termOptions: [6, 12, 18, 24],
    termUnit: 'months',
    maxLTV: 65,
    points: 2.5,
    description: 'Fast commercial capital for time-sensitive deals',
    features: ['Close in 7-14 days', 'All property types', 'Distressed situations', 'Foreclosure bailout'],
    icon: '⚡'
  },
  cmbs: {
    id: 'cmbs',
    name: 'CMBS Loan',
    category: 'commercial',
    minRate: 6.5,
    maxRate: 8.0,
    minAmount: 2000000,
    maxAmount: 500000000,
    minTerm: 10,
    maxTerm: 10,
    termOptions: [10],
    termUnit: 'years',
    maxLTV: 75,
    minDSCR: 1.25,
    description: 'Non-recourse securitized commercial financing',
    features: ['Non-recourse', 'Fixed rate', 'Assumable', 'No personal guarantee'],
    icon: '📈'
  },
  hospitality: {
    id: 'hospitality',
    name: 'Hotel & Hospitality',
    category: 'commercial',
    minRate: 7.5,
    maxRate: 10.0,
    minAmount: 1000000,
    maxAmount: 100000000,
    minTerm: 5,
    maxTerm: 25,
    termOptions: [5, 7, 10, 15, 25],
    termUnit: 'years',
    maxLTV: 70,
    minDSCR: 1.40,
    description: 'Hotel, motel, and hospitality financing',
    features: ['Flag & non-flag', 'PIP financing', 'Acquisition & refi', 'Revenue-based'],
    icon: '🏨'
  },
  self_storage: {
    id: 'self_storage',
    name: 'Self-Storage Loan',
    category: 'commercial',
    minRate: 6.75,
    maxRate: 8.5,
    minAmount: 500000,
    maxAmount: 50000000,
    minTerm: 5,
    maxTerm: 25,
    termOptions: [5, 7, 10, 15, 25],
    termUnit: 'years',
    maxLTV: 80,
    minDSCR: 1.25,
    description: 'Self-storage facility financing',
    features: ['Strong asset class', 'Expansion financing', 'Conversion projects', 'Climate controlled'],
    icon: '📦'
  },
  mhp: {
    id: 'mhp',
    name: 'Mobile Home Park',
    category: 'commercial',
    minRate: 6.5,
    maxRate: 8.5,
    minAmount: 500000,
    maxAmount: 50000000,
    minTerm: 5,
    maxTerm: 30,
    termOptions: [5, 7, 10, 12, 30],
    termUnit: 'years',
    maxLTV: 80,
    minDSCR: 1.25,
    description: 'Manufactured housing community financing',
    features: ['Park-owned homes', 'Lot rent focused', 'Infill potential', 'Long-term holds'],
    icon: '🏘️'
  },
  nnn: {
    id: 'nnn',
    name: 'NNN Lease Financing',
    category: 'commercial',
    minRate: 6.0,
    maxRate: 7.5,
    minAmount: 500000,
    maxAmount: 50000000,
    minTerm: 10,
    maxTerm: 25,
    termOptions: [10, 15, 20, 25],
    termUnit: 'years',
    maxLTV: 75,
    description: 'Triple net lease single tenant properties',
    features: ['Credit tenant', 'Long lease terms', 'Passive income', 'Low risk profile'],
    icon: '🏪'
  },
  medical_office: {
    id: 'medical_office',
    name: 'Medical Office Building',
    category: 'commercial',
    minRate: 6.5,
    maxRate: 8.0,
    minAmount: 500000,
    maxAmount: 30000000,
    minTerm: 5,
    maxTerm: 25,
    termOptions: [5, 7, 10, 15, 25],
    termUnit: 'years',
    maxLTV: 85,
    minDSCR: 1.25,
    description: 'Healthcare real estate financing',
    features: ['Higher LTV', 'Specialty tenants', 'Stable cash flow', 'Essential services'],
    icon: '🏥'
  },

  // ============================================
  // BUSINESS FINANCING
  // ============================================
  sba_7a: {
    id: 'sba_7a',
    name: 'SBA 7(a) Loan',
    category: 'business',
    minRate: 'Prime + 2.25%',
    maxRate: 'Prime + 2.75%',
    baseRate: 8.5,
    minAmount: 50000,
    maxAmount: 5000000,
    minTerm: 5,
    maxTerm: 25,
    termOptions: [5, 7, 10, 15, 25],
    termUnit: 'years',
    guaranteeFee: 3.0,
    description: 'Most flexible SBA program for business growth',
    features: ['Low down payment', 'Long terms', 'Working capital', 'Acquisition financing'],
    highlight: true,
    icon: '🇺🇸'
  },
  sba_504: {
    id: 'sba_504',
    name: 'SBA 504 Loan',
    category: 'business',
    minRate: 5.5,
    maxRate: 7.0,
    minAmount: 125000,
    maxAmount: 20000000,
    minTerm: 10,
    maxTerm: 25,
    termOptions: [10, 20, 25],
    termUnit: 'years',
    downPayment: 10,
    description: 'Fixed asset financing with only 10% down',
    features: ['10% down payment', 'Fixed rates', 'Real estate & equipment', 'Job creation focus'],
    icon: '🏭'
  },
  term_loan: {
    id: 'term_loan',
    name: 'Business Term Loan',
    category: 'business',
    minRate: 8.0,
    maxRate: 25.0,
    minAmount: 5000,
    maxAmount: 5000000,
    minTerm: 1,
    maxTerm: 5,
    termOptions: [1, 2, 3, 5],
    termUnit: 'years',
    description: 'Fixed payments business loan for growth',
    features: ['Predictable payments', 'Quick funding', 'Multiple uses', 'Build credit'],
    icon: '📊'
  },
  working_capital: {
    id: 'working_capital',
    name: 'Working Capital Loan',
    category: 'business',
    minFactor: 1.15,
    maxFactor: 1.45,
    minRate: 15,
    maxRate: 45,
    minAmount: 10000,
    maxAmount: 2000000,
    minTerm: 3,
    maxTerm: 18,
    termOptions: [3, 6, 9, 12, 18],
    termUnit: 'months',
    description: 'Fast cash flow solution for business needs',
    features: ['Same-day funding', 'High approval rate', 'Flexible payments', 'No collateral'],
    icon: '💼'
  },
  business_loc: {
    id: 'business_loc',
    name: 'Business Line of Credit',
    category: 'business',
    minRate: 7.0,
    maxRate: 25.0,
    minAmount: 10000,
    maxAmount: 1000000,
    minTerm: 12,
    maxTerm: 24,
    termOptions: [12, 24],
    termUnit: 'months',
    description: 'Revolving business credit line',
    features: ['Pay only what you use', 'Reusable credit', 'Quick access', 'Build credit'],
    icon: '💳'
  },
  equipment: {
    id: 'equipment',
    name: 'Equipment Financing',
    category: 'business',
    minRate: 6.0,
    maxRate: 20.0,
    minAmount: 5000,
    maxAmount: 5000000,
    minTerm: 2,
    maxTerm: 7,
    termOptions: [2, 3, 4, 5, 7],
    termUnit: 'years',
    maxLTV: 100,
    description: 'Equipment is the collateral - 100% financing available',
    features: ['No down payment', 'Section 179 benefits', 'Fast approval', 'New & used equipment'],
    icon: '🔧'
  },
  factoring: {
    id: 'factoring',
    name: 'Invoice Factoring',
    category: 'business',
    advanceRate: 85,
    feeRange: '1-5%',
    minRate: 1,
    maxRate: 5,
    minAmount: 10000,
    maxAmount: 10000000,
    description: 'Turn outstanding invoices into immediate cash',
    features: ['Same-day funding', '85% advance rate', 'B2B & B2G', 'Credit protection'],
    icon: '📄'
  },
  mca: {
    id: 'mca',
    name: 'Merchant Cash Advance',
    category: 'business',
    minFactor: 1.20,
    maxFactor: 1.50,
    minRate: 20,
    maxRate: 50,
    minAmount: 5000,
    maxAmount: 500000,
    minTerm: 3,
    maxTerm: 18,
    termOptions: [3, 6, 9, 12, 18],
    termUnit: 'months',
    description: 'Based on credit card sales - daily ACH repayment',
    features: ['High approval rate', 'Bad credit OK', 'Fast funding', 'Flexible payments'],
    icon: '💳'
  },
  rbf: {
    id: 'rbf',
    name: 'Revenue Based Financing',
    category: 'business',
    minFactor: 1.10,
    maxFactor: 1.35,
    minRate: 10,
    maxRate: 35,
    minAmount: 50000,
    maxAmount: 3000000,
    minTerm: 12,
    maxTerm: 24,
    termOptions: [12, 18, 24],
    termUnit: 'months',
    revenueShare: '5-15%',
    description: 'Scales with your revenue - pay less when slower',
    features: ['Revenue-based payments', 'Equity preservation', 'Flexible terms', 'Growth focused'],
    icon: '📈'
  },
  acquisition: {
    id: 'acquisition',
    name: 'Business Acquisition Loan',
    category: 'business',
    minRate: 7.0,
    maxRate: 12.0,
    minAmount: 100000,
    maxAmount: 25000000,
    minTerm: 5,
    maxTerm: 25,
    termOptions: [5, 7, 10, 15, 25],
    termUnit: 'years',
    description: 'Buy a business or buyout a partner',
    features: ['SBA eligible', 'Seller financing combo', 'Earnout structures', 'Due diligence support'],
    icon: '🤝'
  },
  startup: {
    id: 'startup',
    name: 'Startup Financing',
    category: 'business',
    minRate: 9.0,
    maxRate: 20.0,
    minAmount: 10000,
    maxAmount: 150000,
    minTerm: 2,
    maxTerm: 5,
    termOptions: [2, 3, 5],
    termUnit: 'years',
    description: 'Launch your business with proper funding',
    features: ['New business friendly', 'Personal credit based', 'Collateral options', 'Business planning'],
    icon: '🚀'
  },
  robs: {
    id: 'robs',
    name: '401(k) Business Financing (ROBS)',
    category: 'business',
    minRate: 0,
    maxRate: 0,
    minAmount: 50000,
    maxAmount: 500000,
    setupFee: 4995,
    monthlyFee: 135,
    description: 'Use retirement funds tax-free and penalty-free',
    features: ['No debt', 'Tax-free', 'Keep retirement status', 'IRS compliant'],
    icon: '🏦'
  },

  // ============================================
  // SPECIALTY LOANS
  // ============================================
  hfci: {
    id: 'hfci',
    name: 'HFCI Fee Financing',
    category: 'specialty',
    minRate: 12.0,
    maxRate: 18.0,
    minAmount: 4000,
    maxAmount: 5000,
    minTerm: 12,
    maxTerm: 36,
    termOptions: [12, 24, 36],
    termUnit: 'months',
    description: 'Finance legal fees to save your home from foreclosure',
    features: ['Income-based approval', 'Save your home', 'Stop foreclosure', 'Legal fee coverage'],
    highlight: true,
    icon: '🏠'
  },
  debt_consol: {
    id: 'debt_consol',
    name: 'Debt Consolidation',
    category: 'specialty',
    minRate: 7.99,
    maxRate: 24.0,
    minAmount: 5000,
    maxAmount: 100000,
    minTerm: 2,
    maxTerm: 7,
    termOptions: [2, 3, 5, 7],
    termUnit: 'years',
    description: 'Combine all debts into one lower payment',
    features: ['Lower interest', 'Single payment', 'Improve credit', 'Fixed rate'],
    icon: '📉'
  },
  personal: {
    id: 'personal',
    name: 'Personal Loan',
    category: 'specialty',
    minRate: 6.99,
    maxRate: 24.0,
    minAmount: 1000,
    maxAmount: 100000,
    minTerm: 2,
    maxTerm: 7,
    termOptions: [2, 3, 5, 7],
    termUnit: 'years',
    description: 'Unsecured personal financing for any purpose',
    features: ['No collateral', 'Fixed rate', 'Quick funding', 'Multiple uses'],
    icon: '👤'
  },
  auto: {
    id: 'auto',
    name: 'Auto Loan',
    category: 'specialty',
    minRate: 5.49,
    maxRate: 18.0,
    minAmount: 5000,
    maxAmount: 150000,
    minTerm: 2,
    maxTerm: 7,
    termOptions: [2, 3, 4, 5, 6, 7],
    termUnit: 'years',
    description: 'New and used vehicle financing',
    features: ['New & used', 'Competitive rates', 'Fast approval', 'Refinance option'],
    icon: '🚗'
  },
  commercial_vehicle: {
    id: 'commercial_vehicle',
    name: 'Commercial Vehicle Loan',
    category: 'specialty',
    minRate: 7.0,
    maxRate: 15.0,
    minAmount: 10000,
    maxAmount: 500000,
    minTerm: 2,
    maxTerm: 7,
    termOptions: [2, 3, 4, 5, 7],
    termUnit: 'years',
    description: 'Trucks, vans, fleet and commercial vehicle financing',
    features: ['Fleet financing', 'Trucks & vans', 'New owner OK', 'Competitive rates'],
    icon: '🚛'
  },
  practice: {
    id: 'practice',
    name: 'Practice Financing',
    category: 'specialty',
    minRate: 6.5,
    maxRate: 10.0,
    minAmount: 50000,
    maxAmount: 5000000,
    minTerm: 5,
    maxTerm: 25,
    termOptions: [5, 7, 10, 15, 25],
    termUnit: 'years',
    description: 'Medical, dental, veterinary and professional practice financing',
    features: ['Acquisition', 'Equipment', 'Real estate', 'Working capital'],
    icon: '⚕️'
  },
  franchise: {
    id: 'franchise',
    name: 'Franchise Financing',
    category: 'specialty',
    minRate: 7.0,
    maxRate: 12.0,
    minAmount: 50000,
    maxAmount: 5000000,
    minTerm: 5,
    maxTerm: 25,
    termOptions: [5, 7, 10, 15, 25],
    termUnit: 'years',
    description: 'Start or expand your franchise business',
    features: ['Multi-unit', 'All brands', 'SBA eligible', 'Fast approval'],
    icon: '🍔'
  },
  cannabis: {
    id: 'cannabis',
    name: 'Cannabis Financing',
    category: 'specialty',
    minRate: 12.0,
    maxRate: 20.0,
    minAmount: 100000,
    maxAmount: 10000000,
    minTerm: 1,
    maxTerm: 10,
    termOptions: [1, 2, 3, 5, 10],
    termUnit: 'years',
    description: 'Licensed cannabis operator financing in legal states',
    features: ['Licensed operators', 'Real estate', 'Equipment', 'Working capital'],
    highlight: true,
    icon: '🌿'
  },
  nonprofit: {
    id: 'nonprofit',
    name: 'Church & Non-Profit',
    category: 'specialty',
    minRate: 5.5,
    maxRate: 8.0,
    minAmount: 100000,
    maxAmount: 25000000,
    minTerm: 5,
    maxTerm: 30,
    termOptions: [5, 7, 10, 15, 20, 25, 30],
    termUnit: 'years',
    maxLTV: 90,
    description: 'Faith-based organizations and 501(c)(3) financing',
    features: ['High LTV', 'Construction', 'Acquisition', 'Renovation'],
    icon: '⛪'
  },
  land: {
    id: 'land',
    name: 'Land Loan',
    category: 'specialty',
    minRate: 7.5,
    maxRate: 12.0,
    minAmount: 50000,
    maxAmount: 5000000,
    minTerm: 5,
    maxTerm: 20,
    termOptions: [5, 7, 10, 15, 20],
    termUnit: 'years',
    maxLTV: 65,
    description: 'Raw and improved land acquisition financing',
    features: ['Raw land', 'Entitled land', 'Development', 'Speculation'],
    icon: '🌍'
  },
  agricultural: {
    id: 'agricultural',
    name: 'Agricultural Loan',
    category: 'specialty',
    minRate: 6.0,
    maxRate: 9.0,
    minAmount: 50000,
    maxAmount: 10000000,
    minTerm: 1,
    maxTerm: 30,
    termOptions: [1, 5, 7, 10, 15, 20, 30],
    termUnit: 'years',
    description: 'Farm and ranch acquisition and operating financing',
    features: ['Farm purchase', 'Equipment', 'Operating lines', 'FSA programs'],
    icon: '🚜'
  },
  solar: {
    id: 'solar',
    name: 'Solar Financing',
    category: 'specialty',
    minRate: 4.99,
    maxRate: 8.0,
    minAmount: 10000,
    maxAmount: 100000,
    minTerm: 10,
    maxTerm: 25,
    termOptions: [10, 15, 20, 25],
    termUnit: 'years',
    description: 'Residential and commercial solar system financing',
    features: ['No money down', 'Tax credits', 'Lower bills', 'Green energy'],
    icon: '☀️'
  },
}

// ============================================
// CATEGORY DEFINITIONS
// ============================================
export const LOAN_CATEGORIES = {
  residential: {
    name: 'Residential Loans',
    description: 'Home purchase, refinance, and investment property financing',
    icon: '🏠',
    color: 'gold'
  },
  commercial: {
    name: 'Commercial Loans',
    description: 'Office, retail, industrial, and multi-family financing',
    icon: '🏢',
    color: 'cyan'
  },
  business: {
    name: 'Business Financing',
    description: 'SBA loans, term loans, lines of credit, and working capital',
    icon: '💼',
    color: 'green'
  },
  specialty: {
    name: 'Specialty Loans',
    description: 'Unique financing solutions for specific needs',
    icon: '⭐',
    color: 'purple'
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
export function getLoansByCategory(category: string): LoanProduct[] {
  return Object.values(LOAN_PRODUCTS).filter(loan => loan.category === category)
}

export function getHighlightedLoans(): LoanProduct[] {
  return Object.values(LOAN_PRODUCTS).filter(loan => loan.highlight)
}

export function formatRate(product: LoanProduct): string {
  if (typeof product.minRate === 'string') {
    return product.minRate
  }
  return `${product.minRate}% - ${product.maxRate}%`
}

export function formatAmount(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  return `$${amount.toLocaleString()}`
}

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  const monthlyRate = annualRate / 100 / 12
  const numPayments = termYears * 12

  if (monthlyRate === 0) return principal / numPayments

  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
}

export function calculateTotalInterest(
  principal: number,
  monthlyPayment: number,
  termYears: number
): number {
  return (monthlyPayment * termYears * 12) - principal
}

export function getRateForCredit(product: LoanProduct, creditScore: number): number {
  if (typeof product.minRate !== 'number') {
    return product.baseRate || 8.5
  }

  const rateRange = (product.maxRate as number) - product.minRate

  if (creditScore >= 760) return product.minRate
  if (creditScore >= 720) return product.minRate + (rateRange * 0.15)
  if (creditScore >= 680) return product.minRate + (rateRange * 0.35)
  if (creditScore >= 640) return product.minRate + (rateRange * 0.60)
  if (creditScore >= 600) return product.minRate + (rateRange * 0.80)
  return product.maxRate as number
}

export function calculateDSCR(
  monthlyRent: number,
  monthlyPayment: number,
  monthlyExpenses: number = 0
): number {
  if (monthlyPayment <= 0) return 0
  return (monthlyRent - monthlyExpenses) / monthlyPayment
}

export function calculateLTV(
  loanAmount: number,
  propertyValue: number
): number {
  if (propertyValue <= 0) return 0
  return (loanAmount / propertyValue) * 100
}

export function calculateLTC(
  loanAmount: number,
  totalCost: number
): number {
  if (totalCost <= 0) return 0
  return (loanAmount / totalCost) * 100
}

export function calculateFlipProfit(
  purchasePrice: number,
  rehabCost: number,
  holdingCosts: number,
  arv: number,
  sellingCostsPercent: number = 8
): { profit: number; roi: number } {
  const sellingCosts = arv * (sellingCostsPercent / 100)
  const totalCost = purchasePrice + rehabCost + holdingCosts + sellingCosts
  const profit = arv - totalCost
  const roi = (profit / (purchasePrice + rehabCost)) * 100

  return { profit, roi }
}

// Export quick access arrays
export const RESIDENTIAL_LOANS = getLoansByCategory('residential')
export const COMMERCIAL_LOANS = getLoansByCategory('commercial')
export const BUSINESS_LOANS = getLoansByCategory('business')
export const SPECIALTY_LOANS = getLoansByCategory('specialty')
export const FEATURED_LOANS = getHighlightedLoans()

console.log('🏦 Saint Vision Group - Lending Config Loaded')
console.log(`📊 ${Object.keys(LOAN_PRODUCTS).length} loan products configured`)
