 // ============================================
 // API Configuration File
 // ============================================
 // This file contains all OAuth and Payment API configurations
 // Update these values with your credentials
 
 // ============================================
 // GOOGLE OAUTH CONFIGURATION
 // ============================================
 // Configure these in your Cloud Dashboard:
 // Users → Authentication Settings → Sign In Methods → Google
 //
 // Required credentials from Google Cloud Console:
 // 1. Client ID
 // 2. Client Secret
 //
 // Authorized redirect URI (add this in Google Cloud Console):
 // https://pksdalgorfbetjqhpwxd.supabase.co/auth/v1/callback
 
 export const OAUTH_CONFIG = {
   google: {
     // OAuth is configured via Cloud Dashboard, not in code
     // This is just for documentation purposes
     enabled: true,
     redirectUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/`,
   },
   // Add other OAuth providers here as needed
   // apple: { enabled: false },
   // github: { enabled: false },
 };
 
 // ============================================
 // PAYMENT API CONFIGURATION (Coming Soon)
 // ============================================
 // Payment integration will be configured here
 // Currently showing "Coming Soon" on subscription page
 
 export const PAYMENT_CONFIG = {
   stripe: {
     enabled: false,
     // When ready, Stripe will be configured via Lovable's Stripe integration
     // Use the enable_stripe tool to set up payments
   },
   razorpay: {
     enabled: false,
     // For Indian payments (UPI, cards, etc.)
     // API keys will be stored securely in Cloud secrets
   },
 };
 
 // ============================================
 // API ENDPOINTS (for future use)
 // ============================================
 export const API_ENDPOINTS = {
   // Add any external API endpoints here
 };