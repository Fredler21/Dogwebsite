# Dogvanta — Setup & First Product

Follow these in order. **Steps 1–6 are all you need to add your first product and
see it in the store.** Stripe/email/AI (functions) come later in "Full backend".

Firebase project: **dogvanta-bc5e4** (already set in `.firebaserc`).

---

## 1. Connect the Firebase CLI  ← run these in *your* terminal

The CLI is already installed (`firebase --version` → 15.x). Login is a browser
flow, so run it yourself:

```bash
firebase login                 # opens a browser — pick your Google account
firebase use dogvanta-bc5e4    # selects this project (already the default)
firebase projects:list         # sanity check — you should see dogvanta-bc5e4
```

> The Google account you log in with must be an **Owner/Editor** of the
> `dogvanta-bc5e4` Firebase project.

---

## 2. Fill in the web env

Next.js reads **`apps/web/.env.local`** (already created for you). Open it and
paste the 4 blank values from:

Firebase console → ⚙ **Project settings** → **Your apps** → **SDK setup and
configuration** → **Config**.

Copy `apiKey`, `messagingSenderId`, `appId`, and confirm the exact
`storageBucket` string. Project ID + auth domain are pre-filled.

---

## 3. Deploy the security rules

These enforce "only admins can write products / customers can't read others'
orders / public can read active products". Adding products won't work without
them applied.

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

---

## 4. Create your Firebase Auth account

Start the app (see step 6), open **http://localhost:3000/admin/login**, and sign
in with Google **once**. This creates your user in Firebase Auth so the next step
can find it. You'll see "not authorized" — that's expected until step 5.

> Also make sure your email is in the allowlist: `apps/web/lib/adminAllowlist.ts`
> currently lists only `pierrelouisfredler@gmail.com`. Add/replace with the email
> you signed in with.

---

## 5. Grant yourself admin (one time)

Writing products requires the `admin` custom claim (the allowlist only unlocks
the UI). Bootstrap it with the included script:

1. Firebase console → ⚙ Project settings → **Service accounts** →
   **Generate new private key**. Save the JSON outside the repo.
2. From the `functions/` folder:

   ```powershell
   # PowerShell
   $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccount.json"
   node scripts/grant-admin.js you@example.com
   ```

3. **Sign out and back in** — claims only refresh on a new sign-in.

---

## 6. Run it and add a product

```bash
npm install          # once, at the repo root (installs all workspaces)
npm run dev          # starts the web app on http://localhost:3000
```

Go to **/admin/products → New product**, fill it in, **Save**. It appears in the
storefront within ~60s (instantly on the shop/product pages).

- Categories come from `apps/web/lib/mockProducts.ts` (Toys, Beds, Walking Gear,
  Grooming, Feeding, Travel).
- Until you add real products, the store shows a **demo catalogue** so it's never
  empty. Your first real product replaces the demo automatically.

---

## Full backend (later — needed for checkout, emails, AI)

Not required to add/display products. When you're ready to take payments:

```bash
# Set server secrets (used by Cloud Functions):
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
firebase functions:secrets:set RESEND_API_KEY
firebase functions:secrets:set OPENAI_API_KEY
# SUPER_ADMIN_EMAIL is a param — set it in functions env / at deploy.

npm --workspace functions run build
firebase deploy --only functions
```

Then point a Stripe webhook at the deployed `stripeWebhook` URL and run one
test-mode order end-to-end (cart → checkout → paid → order in /admin).
