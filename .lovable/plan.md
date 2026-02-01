
# Plan: Fix UI Issues and Guide Google Sign-In Setup

## Issues Identified

### 1. Description Field "Dot" in Admin Page
The small dot you see at the bottom-right corner of the Description textareas is a **resize handle** - a browser feature that allows users to drag and resize the text area. I will remove this by adding CSS to disable the resize functionality on those fields.

### 2. Spelling Correction: "Sanghralay" → "Sanghralaya"
Found in **2 files** that were missed in the previous update:
- `src/components/tutorial/BasicsTutorial.tsx` (line 37)
- `src/pages/Auth.tsx` (line 99)

### 3. Google Sign-In Guide
Your project uses **Lovable Cloud** which provides **managed Google OAuth** out of the box. Here's how it works:

**Good news:** Google Sign-In is already implemented in your app! The code in `Auth.tsx` already has the `handleGoogleSignIn` function that calls `signInWithGoogle()`.

**To use it:**
1. Simply click the "Continue with Google" button on your login page
2. Lovable Cloud automatically handles the OAuth flow - no additional setup needed

**If you want to use your own Google OAuth credentials (optional):**
1. Go to the Lovable Cloud Dashboard (Users → Authentication Settings)
2. Navigate to Sign In Methods → Google
3. Add your own Google Client ID and Secret from Google Cloud Console

---

## Implementation Steps

### Step 1: Remove Resize Handle from Textareas
Add `resize-none` class to the Textarea components in Admin.tsx to remove the resize handle dot.

### Step 2: Fix Spelling in Tutorial Page
Change "Sanatan Pustak Sanghralay" to "Sanatan Pustak Sanghralaya" in BasicsTutorial.tsx

### Step 3: Fix Spelling in Auth Page
Change "Sanatan Pustak Sanghralay" to "Sanatan Pustak Sanghralaya" in Auth.tsx

---

## Files to Modify
1. `src/pages/Admin.tsx` - Add `className="resize-none"` to both Textarea components
2. `src/components/tutorial/BasicsTutorial.tsx` - Fix spelling on line 37
3. `src/pages/Auth.tsx` - Fix spelling on line 99

---

## Google Sign-In Access
After I make these changes, you can access Google Sign-In settings here:

<lov-actions>
  <lov-open-backend>View Cloud Dashboard</lov-open-backend>
</lov-actions>

