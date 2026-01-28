# Unit.co Banking Integration Setup Guide

## Overview
This guide explains how Unit.co works with CookinFlips and what you need to configure for proper access.

---

## What is Unit.co?

Unit.co is a Banking-as-a-Service platform that provides:
- Deposit accounts for your customers
- Investment accounts
- Debit/credit cards
- ACH & Wire transfers
- Check deposits
- Transaction management
- White-label banking UI

---

## How Authentication Works

### JWT Token (What You Have Now)
Your current JWT token is an **Admin/Org-level token** that provides:
- Full access to all banking features
- Admin dashboard capabilities
- Access to ALL customer accounts and data
- Valid until: **January 28, 2027**

**Location in your app:** The token is embedded directly in `/app/banking/page.tsx`

### Token Scopes (Permissions)
Your token has the following scopes enabled:
- ✅ Applications (read/write)
- ✅ Customers (read/write)
- ✅ Accounts (read/write)
- ✅ Cards (read/write + sensitive operations)
- ✅ Transactions (read/write)
- ✅ Payments (ACH, Wire, all types)
- ✅ Statements
- ✅ Check deposits/payments
- ✅ Disputes & chargebacks
- ✅ Webhooks
- ✅ Events
- ✅ And many more...

---

## What You Need to Configure in Unit.co Dashboard

### 1. **Access the Unit.co Dashboard**
- **Sandbox:** https://app.s.unit.sh/
- **Production:** https://app.unit.co/

Log in with your Unit.co account credentials (the account associated with "Saint Vision Technologies LLC").

---

### 2. **Create Customer Applications**
Before customers can use banking features, they must be onboarded:

#### In Unit.co Dashboard:
1. Go to **Applications** section
2. Click **Create Application**
3. Fill out customer information:
   - Individual or Business
   - Full Name, DOB, SSN/EIN
   - Address, Phone, Email
   - Beneficial owners (for businesses)
4. Submit for review

#### Via API (Recommended for production):
```typescript
// This would be an API call from your backend
const response = await fetch('https://api.s.unit.sh/applications', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${YOUR_ORG_TOKEN}`,
    'Content-Type': 'application/vnd.api+json'
  },
  body: JSON.stringify({
    data: {
      type: "individualApplication",
      attributes: {
        fullName: {
          first: "John",
          last: "Doe"
        },
        dateOfBirth: "1990-01-01",
        address: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "US"
        },
        email: "john@example.com",
        phone: {
          countryCode: "1",
          number: "5555555555"
        },
        ssn: "123456789",
        // ... other required fields
      }
    }
  })
})
```

---

### 3. **Customer Token Generation (For End Users)**
For production, you should generate **Customer Tokens** instead of using the org token:

#### Why Customer Tokens?
- More secure (limited to specific customer)
- Built-in 2FA/OTP
- Expires after 24 hours
- Required for PCI-sensitive operations (card data)

#### How to Generate:
```typescript
// Step 1: Create customer token verification (sends OTP)
const verificationResponse = await fetch('https://api.s.unit.sh/customers/{customerId}/token/verification', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${YOUR_ORG_TOKEN}`,
    'Content-Type': 'application/vnd.api+json'
  },
  body: JSON.stringify({
    data: {
      type: "customerTokenVerification",
      attributes: {
        channel: "sms", // or "call"
        phone: {
          countryCode: "1",
          number: "5555555555"
        }
      }
    }
  })
})

// Step 2: Customer enters OTP code they received

// Step 3: Create customer token with OTP
const tokenResponse = await fetch('https://api.s.unit.sh/customers/{customerId}/token', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${YOUR_ORG_TOKEN}`,
    'Content-Type': 'application/vnd.api+json'
  },
  body: JSON.stringify({
    data: {
      type: "customerToken",
      attributes: {
        scope: "cards cards-sensitive accounts payments", // Required scopes
        verificationToken: "{verificationToken from step 1}",
        verificationCode: "{OTP code entered by customer}",
        expiresIn: 86400 // 24 hours in seconds
      }
    }
  })
})

// Use this token for the customer's session
const customerToken = tokenResponse.data.attributes.token
```

---

### 4. **Setup Webhooks (Optional but Recommended)**
Webhooks notify your app about important events:

#### In Unit.co Dashboard:
1. Go to **Settings** → **Webhooks**
2. Click **Add Webhook**
3. Enter your webhook URL: `https://your-domain.com/api/webhooks/unit`
4. Select events to subscribe to:
   - account.created
   - transaction.created
   - payment.sent
   - card.activated
   - authorization.created
   - etc.

#### Handle webhooks in your app:
```typescript
// /app/api/webhooks/unit/route.ts
export async function POST(req: Request) {
  const event = await req.json()
  
  console.log('[v0] Unit.co webhook received:', event.type)
  
  switch(event.type) {
    case 'transaction.created':
      // Handle new transaction
      break
    case 'payment.sent':
      // Handle payment sent
      break
    // ... handle other events
  }
  
  return Response.json({ received: true })
}
```

---

### 5. **Customize White-Label Theme**
The theme configuration you provided customizes the banking UI appearance.

#### In Unit.co Dashboard:
1. Go to **Settings** → **White Label**
2. Configure:
   - Primary colors
   - Logo
   - Favicon
   - Font styles
   - Button styles

Your current theme uses gold (#FFD700) as the primary color to match CookinFlips branding.

---

## Integration Architecture

### Current Setup (Admin View)
```
User clicks "Banking" 
  ↓
/app/banking/page.tsx loads
  ↓
Fetches Unit.co script
  ↓
Renders <unit-elements-white-label-app> with Admin JWT
  ↓
Shows ALL accounts, customers, transactions (admin view)
```

### Recommended Production Setup (Customer View)
```
User logs into CookinFlips
  ↓
Your auth system identifies user
  ↓
Backend checks if user has Unit.co customer account
  ↓
If not: Create Unit application/customer
  ↓
Generate Customer Token with 2FA/OTP
  ↓
Pass Customer Token to <unit-elements-white-label-app>
  ↓
Shows ONLY that customer's accounts (scoped view)
```

---

## Next Steps for Production

### 1. **User Authentication Integration**
Connect your existing Supabase auth to Unit.co:

```typescript
// When user signs up in your app
async function onUserSignup(user) {
  // Create Unit.co application
  const unitApplication = await createUnitApplication({
    email: user.email,
    phone: user.phone,
    fullName: user.full_name,
    // ... other KYC data
  })
  
  // Store Unit customer ID in your database
  await supabase
    .from('users')
    .update({ unit_customer_id: unitApplication.customerId })
    .eq('id', user.id)
}
```

### 2. **Build Customer Token API Endpoint**
```typescript
// /app/api/unit/customer-token/route.ts
export async function POST(req: Request) {
  const session = await getServerSession() // Your auth
  
  // Get user's Unit customer ID from your database
  const { data: user } = await supabase
    .from('users')
    .select('unit_customer_id')
    .eq('id', session.user.id)
    .single()
  
  // Generate customer token with 2FA
  const token = await generateUnitCustomerToken(user.unit_customer_id)
  
  return Response.json({ token })
}
```

### 3. **Update Banking Page**
```typescript
// /app/banking/page.tsx
const [customerToken, setCustomerToken] = useState("")

useEffect(() => {
  // Fetch customer-specific token
  fetch('/api/unit/customer-token')
    .then(res => res.json())
    .then(data => setCustomerToken(data.token))
}, [])

// Use customer token instead of org token
<unit-elements-white-label-app jwt-token={customerToken} />
```

---

## Security Best Practices

1. ✅ **Never expose Org API tokens in client-side code** (move to backend)
2. ✅ **Always use Customer Tokens for end-user banking operations**
3. ✅ **Implement 2FA/OTP for sensitive operations**
4. ✅ **Store tokens securely** (environment variables for org tokens, secure session storage for customer tokens)
5. ✅ **Set appropriate token expiration** (24 hours max for customer tokens)
6. ✅ **Validate webhooks** (verify they're from Unit.co)
7. ✅ **Log all financial operations** for audit trails

---

## Current Issues & Fixes

### Issue: "I don't have access to it"
**Cause:** The org token might need to be refreshed, or there are no customer accounts created yet in Unit.co.

**Solution:**
1. Log into Unit.co Dashboard (https://app.s.unit.sh/)
2. Check if there are any applications/customers created
3. If none, create a test customer account
4. Verify the JWT token is still valid (expires Jan 28, 2027)
5. Check browser console for any error messages

### Issue: "Can't see it here"
**Cause:** Unit.co components might not be loading, or the white-label app is waiting for data.

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests to Unit.co
4. Verify the script is loading: `https://ui.s.unit.sh/release/latest/components-extended.js`
5. Look for `[v0]` debug messages in console

---

## Support & Resources

- **Unit.co Documentation:** https://docs.unit.co/
- **Unit.co Dashboard (Sandbox):** https://app.s.unit.sh/
- **Unit.co Dashboard (Live):** https://app.unit.co/
- **API Reference:** https://docs.unit.co/api/
- **White Label UI Docs:** https://docs.unit.co/white-label-uis/

---

## Summary

Your Unit.co integration is currently set up with an **admin-level view** using an org token. For production:

1. Create customer applications in Unit.co when users sign up
2. Generate customer-specific tokens with 2FA
3. Show each user only their own banking data
4. Move sensitive tokens to backend/environment variables
5. Set up webhooks for real-time updates

The current setup is perfect for **testing and development** - you can see everything in the admin dashboard. For production, follow the customer token flow above.
