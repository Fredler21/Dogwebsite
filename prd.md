# ALLYOUCANUSE.COM

## Premium Product Requirements Document

One Website - Firebase Backend - AI Operations Assistant - Claude Build Prompts

*Plain Text Build Blueprint | Versioned Phases V0 to V10*

**Purpose:** This document gives you a full website build plan for one dropshipping brand. It breaks the work into professional engineering phases so you can build the customer website, admin dashboard, Firebase backend, order system, supplier workflow, and AI Store Copilot step by step.

**Recommended first niche:** Car accessories. You can later reuse the same system for pet accessories or home decor.

**Important rule:** Build one strong website first. Do not build three websites until the first one can accept payments, fulfill orders, handle support, and track profit.

---

## 1. Executive Summary

Allyoucanuse.com should be built as a focused ecommerce website for useful products, not as a messy general store. The first version should focus on one profitable category, such as car accessories. The system must include a clean customer website, a private admin dashboard, a Firebase backend, secure checkout, order tracking, supplier management, customer support, analytics, and an AI Operations Assistant that watches the store 24/7.

The best architecture is one main website with three parts:

- **Customer storefront:** home page, collections, product pages, cart, checkout, account, track order, support.
- **Admin dashboard:** products, orders, customers, suppliers, refunds, analytics, AI Control Center.
- **Firebase backend:** Auth, Firestore, Storage, Cloud Functions, Cloud Scheduler, security rules, Stripe webhooks, email service, AI worker logic.

**Core principle:** The frontend should display and collect information. The backend should handle anything private, risky, or business-critical.

## 2. Product Vision

**Product statement:** Allyoucanuse.com helps customers discover practical products that make everyday life easier. The brand should feel clean, useful, trustworthy, fast, and organized.

**Brand positioning:**

- Useful products only - no random junk.
- Clear shipping expectations - no fake fast-shipping promises.
- Simple checkout - customers can buy fast from mobile.
- Strong customer communication - order confirmations, tracking, support, and refund rules.
- AI-powered operations - the store monitors itself and alerts the owner before problems become serious.

**Premium goal:** Make the website feel closer to a real Shopify brand, even though you are building it yourself.

## 3. Website Scope - One Website Only

**Domain:** allyoucanuse.com

**Recommended first category:** Car accessories

**Future categories after proof of sales:** pet accessories, home decor, home organization, tech accessories.

**Initial product count:** 20 to 30 products only. Do not launch with hundreds of products. Start clean, test winners, then scale.

## 4. Main User Types

- **Guest customer:** can browse, add to cart, checkout, track order, contact support.
- **Registered customer:** can save addresses, view order history, track order, request return.
- **Admin/owner:** can manage products, orders, suppliers, refunds, analytics, support, and AI settings.
- **AI Operations Assistant:** backend worker that watches orders, emails, customer issues, supplier issues, and daily performance.
- **Supplier integration:** external supplier or API used to fulfill orders and provide tracking.

## 5. Information Architecture

```
Customer Website
- Home
- Shop
- Collections
  - Interior Accessories
  - Cleaning Tools
  - Phone Holders
  - Storage and Organization
  - Comfort Accessories
- Product Detail Page
- Cart
- Checkout
- Order Confirmation
- Track Order
- Customer Account
- Support Center
- FAQ
- Shipping Policy
- Return and Refund Policy
- Privacy Policy
- Terms of Service
- Contact Us
- About Us

Admin Dashboard
- Overview
- Orders
- Products
- Customers
- Suppliers
- Support Tickets
- Refunds and Returns
- Discounts
- Analytics
- AI Control Center
- Settings

Firebase Backend
- Authentication
- Firestore Database
- Storage
- Cloud Functions
- Cloud Scheduler
- Security Rules
- Stripe Webhooks
- Email API
- Supplier API
- AI Agent Logic
```

## 6. Phase Roadmap

### V0 - Business Foundation and Technical Setup

- Choose the first niche and product category.
- Buy and connect the domain.
- Set up GitHub repository.
- Set up Firebase project.
- Set up Stripe account in test mode.
- Set up professional email such as support@allyoucanuse.com.
- Create brand basics: logo, colors, fonts, tone, page layout rules.
- Define product selection rules: useful, safe, non-counterfeit, shippable, profitable.

### V1 - Storefront MVP

- Home page.
- Collection page.
- Product page.
- Cart.
- Basic checkout button connected to Stripe Checkout test mode.
- Policy pages.
- Mobile responsive layout.
- Search and category filter.
- Basic SEO fields.

### V2 - Firebase Backend MVP

- Firebase Auth for admin login and optional customer accounts.
- Firestore collections for products, carts, orders, customers, suppliers, tickets, settings.
- Firebase Storage for product images.
- Cloud Functions for checkout session creation.
- Stripe webhook handler to update orders after payment.
- Basic security rules.

### V3 - Admin Dashboard

- Admin overview page.
- Product create/edit/delete.
- Order list and order detail.
- Update fulfillment status.
- Add tracking number.
- Customer list.
- Supplier list.
- Discount code management.
- Basic profit calculation.

### V4 - Customer Communication System

- Order confirmation email.
- Shipping update email.
- Tracking email.
- Refund confirmation email.
- Contact form.
- Support ticket creation.
- Admin reply workflow.
- Customer notification history.

### V5 - Dropshipping Supplier Workflow

- Supplier profile per product.
- Supplier cost per product.
- Supplier product URL/API ID.
- Manual supplier fulfillment button.
- Auto-generate supplier purchase task.
- Track supplier order number.
- Track supplier tracking number.
- Alert if product price or stock changes.

### V6 - AI Operations Assistant

- AI Control Center in admin dashboard.
- AI order monitoring.
- AI email/ticket classification.
- AI draft replies.
- AI delayed order alerts.
- AI fraud flags.
- AI supplier issue alerts.
- Daily business report.
- Human approval controls.

### V7 - Analytics and Growth

- Google Analytics 4.
- Meta Pixel.
- TikTok Pixel.
- Pinterest Tag.
- Conversion funnel tracking.
- Abandoned cart tracking.
- Best product dashboard.
- Profit dashboard.
- Refund and complaint dashboard.

### V8 - Automation and Scaling

- Abandoned cart email automation.
- Low-stock supplier alert.
- Auto tracking update job.
- Supplier reminder job.
- Review request email after delivery.
- Smart product performance recommendations.
- SEO blog system.

### V9 - Security, Compliance, and Reliability

- Role-based admin access.
- Cloud Function input validation.
- Rate limiting for public endpoints.
- Audit logs.
- Backups.
- Error monitoring.
- Admin two-factor authentication if available.
- Strict Firestore security rules.
- Refund approval rules.

### V10 - Premium Scaling Layer

- Multi-niche support inside one backend.
- Reusable theme system.
- Advanced AI decision rules.
- Automated supplier scorecard.
- Customer loyalty/referral program.
- A/B testing.
- Advanced SEO landing pages.
- Prepare the system for a second website only after this one works.

## 7. V1 Storefront Requirements

### 7.1 Home Page

- Hero section with clear value proposition.
- Featured products section.
- Shop by category section.
- Trust bar: secure checkout, tracking, support, returns.
- Best sellers section.
- How it works section.
- Newsletter signup.
- Footer with all policies and contact information.

### 7.2 Product Page

- Product title written for customers, not supplier-style text.
- High-quality product images.
- Variant picker for size, color, model, or style.
- Price and compare-at price.
- Shipping estimate.
- Quantity selector.
- Add to cart button.
- Buy now button.
- Product benefits section.
- What is included section.
- FAQ section.
- Return information section.
- Customer reviews section.
- Related products section.

### 7.3 Cart

- Show all cart items.
- Edit quantity.
- Remove item.
- Discount code input.
- Estimated subtotal.
- Checkout button.
- Trust badges near checkout.
- Free shipping message if used.

### 7.4 Checkout

Use Stripe Checkout or a secure payment provider. Do not build your own card collection system from scratch.

- Customer email.
- Shipping address.
- Billing address.
- Payment method.
- Order review.
- Tax and shipping calculation if applicable.
- Success page.
- Cancel page.
- Webhook confirmation from Stripe before marking order as paid.

## 8. Required Pages

**About Us** — Explain the brand, what you sell, and why the store exists.

**Contact Us** — Provide support email, contact form, expected response time, and business-friendly support language.

**Shipping Policy** — Explain processing time, shipping time, tracking, delays, and wrong address rules.

**Return and Refund Policy** — Explain how returns work, damaged item process, refund timelines, and non-returnable items.

**Privacy Policy** — Explain what data is collected, payments, analytics, cookies, and customer rights.

**Terms of Service** — Explain store rules, product availability, limitations, intellectual property, and dispute basics.

**FAQ** — Answer common questions about orders, shipping, tracking, refunds, payments, and contact.

**Track Order** — Let customers enter order number and email to see order status.

**Support Center** — Let customers choose order issue, shipping issue, refund, return, damaged item, or general question.

## 9. Backend Architecture With Firebase

Firebase should be used as the backend platform. Firestore stores business data. Firebase Auth manages admin/customer identity. Cloud Functions run private backend logic. Cloud Scheduler runs timed jobs. Firebase Storage holds images and support attachments. Security Rules protect data access.

### 9.1 Firebase Products

- **Firebase Auth:** admin login, customer login, role-based access claims.
- **Cloud Firestore:** products, customers, orders, carts, tickets, suppliers, AI logs, settings.
- **Firebase Storage:** product images, support attachments, policy files if needed.
- **Cloud Functions:** checkout, webhooks, emails, supplier tasks, AI tasks, scheduled jobs.
- **Cloud Scheduler:** delayed order checks, abandoned cart jobs, daily reports, supplier checks.
- **Firebase Hosting or App Hosting:** deploy the customer website and admin dashboard.
- **Firebase Security Rules:** prevent public users from reading private admin data.

### 9.2 Suggested Tech Stack

- **Frontend:** Next.js with TypeScript.
- **Styling:** Tailwind CSS or a clean component library.
- **Backend:** Firebase Cloud Functions using TypeScript.
- **Database:** Cloud Firestore.
- **Authentication:** Firebase Auth.
- **Payments:** Stripe Checkout and Stripe webhooks.
- **Email:** Resend, SendGrid, Mailgun, or Gmail API for support inbox workflow.
- **AI:** OpenAI API or Claude API through a Cloud Function. Never call the AI API directly from the browser.
- **Hosting:** Firebase Hosting or Vercel for frontend plus Firebase for backend.

## 10. Firestore Database Design

```
collections:

/products/{productId}
- title: string
- slug: string
- description: string
- categoryId: string
- images: string[]
- price: number
- compareAtPrice: number
- supplierCost: number
- shippingCost: number
- profitEstimate: number
- variants: array
- status: active | draft | archived
- stockStatus: in_stock | low_stock | out_of_stock | unknown
- supplierId: string
- supplierProductUrl: string
- supplierSku: string
- seoTitle: string
- seoDescription: string
- createdAt: timestamp
- updatedAt: timestamp

/categories/{categoryId}
- name: string
- slug: string
- description: string
- image: string
- sortOrder: number
- status: active | hidden

/customers/{customerId}
- uid: string
- email: string
- name: string
- phone: string
- defaultAddress: map
- orderCount: number
- lifetimeValue: number
- createdAt: timestamp
- updatedAt: timestamp

/carts/{cartId}
- customerId: string | null
- email: string | null
- items: array
- subtotal: number
- discountCode: string | null
- status: active | abandoned | converted
- createdAt: timestamp
- updatedAt: timestamp

/orders/{orderId}
- orderNumber: string
- customerId: string | null
- customerEmail: string
- customerName: string
- shippingAddress: map
- billingAddress: map
- items: array
- subtotal: number
- shippingTotal: number
- taxTotal: number
- discountTotal: number
- grandTotal: number
- paymentStatus: pending | paid | failed | refunded | partially_refunded
- fulfillmentStatus: unfulfilled | supplier_pending | supplier_ordered | shipped | delivered | canceled
- riskStatus: low | medium | high | review_required
- stripeCheckoutSessionId: string
- stripePaymentIntentId: string
- trackingNumber: string | null
- trackingCarrier: string | null
- supplierOrderId: string | null
- adminNotes: string
- createdAt: timestamp
- updatedAt: timestamp

/suppliers/{supplierId}
- name: string
- website: string
- contactEmail: string
- apiType: none | custom | auto_ds | cj | ali_express | other
- rating: number
- averageShippingDays: number
- returnPolicyNotes: string
- status: active | inactive | risky
- createdAt: timestamp
- updatedAt: timestamp

/supportTickets/{ticketId}
- customerEmail: string
- orderId: string | null
- category: tracking | refund | return | damaged | wrong_item | payment | general
- priority: low | medium | high | urgent
- status: open | pending_admin | waiting_customer | solved | closed
- subject: string
- message: string
- aiSummary: string
- aiSuggestedReply: string
- assignedTo: string
- createdAt: timestamp
- updatedAt: timestamp

/discounts/{discountId}
- code: string
- type: percent | fixed | free_shipping
- value: number
- active: boolean
- startsAt: timestamp
- endsAt: timestamp
- maxUses: number
- usedCount: number

/aiAlerts/{alertId}
- type: delayed_order | risky_order | customer_complaint | supplier_issue | low_stock | refund_request | daily_report
- severity: info | warning | urgent
- title: string
- summary: string
- relatedOrderId: string | null
- relatedTicketId: string | null
- status: open | reviewed | resolved
- recommendedAction: string
- createdAt: timestamp

/aiLogs/{logId}
- actionType: string
- inputRef: string
- outputSummary: string
- modelUsed: string
- approvalRequired: boolean
- approvedBy: string | null
- executed: boolean
- createdAt: timestamp

/settings/store
- storeName: string
- supportEmail: string
- currency: string
- shippingPolicyVersion: string
- returnPolicyVersion: string
- aiAutomationLevel: manual | semi_auto | auto_safe_tasks
```

## 11. Cloud Functions Required

Cloud Functions are required because secret keys and private actions must never run from the customer browser. Use functions for Stripe, email, AI, supplier actions, fraud checks, and scheduled jobs.

- **createCheckoutSession** - Creates a Stripe Checkout Session from cart data.
- **stripeWebhook** - Receives Stripe payment events and updates order payment status.
- **onOrderCreated** - Sends admin alert and starts fulfillment workflow.
- **sendOrderConfirmationEmail** - Sends receipt and order confirmation.
- **sendTrackingEmail** - Sends tracking number and order status.
- **createSupportTicket** - Creates a support ticket from contact form or email.
- **aiClassifySupportTicket** - Uses AI to categorize support tickets and draft replies.
- **aiMonitorOrders** - Finds delayed, unfulfilled, risky, or missing-tracking orders.
- **aiDailyReport** - Creates daily report with sales, issues, refunds, and tasks.
- **checkAbandonedCarts** - Finds abandoned carts and sends approved emails.
- **checkSupplierStatus** - Checks supplier stock, price, and availability if API exists.
- **processRefundRequest** - Requires admin approval before refunding.
- **adminUpdateOrderStatus** - Validates admin role before changing order status.
- **logAuditEvent** - Saves important admin and AI actions.

## 12. Security Requirements

- Never expose Stripe secret key in the frontend.
- Never expose supplier API keys in the frontend.
- Never expose AI API keys in the frontend.
- Only admins can read all orders.
- Customers can only read their own orders.
- Public users can read active products and categories only.
- Only admins can create or edit products.
- Only Cloud Functions can mark an order as paid after Stripe webhook verification.
- AI cannot refund, cancel paid orders, or change prices without admin approval in V6.
- All AI actions must be logged in aiLogs.
- Use rate limiting or abuse controls for public forms.
- Use validation for all Cloud Function inputs.
- Use least privilege for service accounts and API keys.

### 12.1 Basic Security Rules Strategy

Security rule strategy in plain English:

- Anyone can read active products and active categories.
- Only admins can create, update, or delete products.
- Customers can read their own customer profile.
- Customers can read their own orders when their auth uid or verified email matches.
- Customers cannot manually change paymentStatus or fulfillmentStatus.
- Only Cloud Functions can update paymentStatus after Stripe confirms payment.
- Support tickets can be created by public users with validation.
- Support ticket details can only be read by admins or the matching authenticated customer.
- aiAlerts and aiLogs are admin-only.
- settings are public only for safe storefront settings; private settings are admin-only.

## 13. AI Operations Assistant Module

The AI Operations Assistant is not a separate website. It is a backend module and admin dashboard section inside the same project. It should work like a 24/7 business assistant that watches everything but does not take risky actions without approval.

### 13.1 AI Control Center Pages

- **AI Overview:** shows urgent alerts, open issues, daily summary.
- **Order Watch:** delayed orders, unfulfilled orders, missing tracking, suspicious orders.
- **Support Inbox:** customer messages with AI category, summary, and reply draft.
- **Supplier Watch:** product stock, supplier price changes, unavailable products.
- **Daily Reports:** sales, profit estimate, refunds, problems, next actions.
- **Automation Rules:** what AI can do automatically and what requires approval.
- **AI Activity Log:** every AI analysis, draft, alert, and action.

### 13.2 AI Automation Levels

- **Level 1 - Manual Approval:** AI only suggests and drafts. Admin must approve all actions.
- **Level 2 - Semi-Automatic:** AI can send safe tracking replies and routine FAQ replies.
- **Level 3 - Safe Automation:** AI can handle predefined low-risk tasks, but refunds, cancellations, pricing, and legal issues still require approval.

### 13.3 AI Rules

- Never issue refunds without approval.
- Never cancel a paid order without approval.
- Never change product price without approval.
- Never promise a delivery date unless tracking confirms it.
- Always escalate angry customers, legal threats, chargebacks, payment disputes, and high-value orders.
- Always be polite, short, and professional with customers.
- Always log what the AI did and why.
- Always show the source data used for recommendations when possible.

## 14. Order Lifecycle

1. Customer adds product to cart.
2. Customer starts checkout.
3. Frontend calls createCheckoutSession Cloud Function.
4. Cloud Function creates Stripe Checkout Session.
5. Customer completes payment on Stripe Checkout.
6. Stripe sends webhook to stripeWebhook Cloud Function.
7. stripeWebhook verifies event signature.
8. Cloud Function marks order as paid in Firestore.
9. Order confirmation email is sent.
10. Admin dashboard shows new paid order.
11. AI checks order for risk, supplier info, and fulfillment status.
12. Admin places supplier order manually or through supplier automation.
13. Tracking number is added.
14. Customer receives tracking email.
15. AI watches for delays or delivery problems.
16. Order is marked delivered.
17. Review request email can be sent after delivery.

## 15. Admin Dashboard Requirements

### 15.1 Admin Overview

- Today sales.
- Pending orders.
- Unfulfilled orders.
- Delayed orders.
- Open support tickets.
- Refund requests.
- AI urgent alerts.
- Best-selling products.
- Estimated profit.

### 15.2 Product Admin

- Create product.
- Edit product.
- Upload images.
- Manage variants.
- Set supplier cost.
- Set selling price.
- Set status.
- Set SEO title and description.
- Archive product.
- Duplicate product.

### 15.3 Order Admin

- View order list.
- Filter by status.
- Open order details.
- View payment status.
- View customer address.
- View items.
- View supplier cost and estimated profit.
- Add supplier order ID.
- Add tracking number.
- Update fulfillment status.
- Create refund request.
- Add admin notes.
- View AI recommendations.

### 15.4 Support Admin

- View support tickets.
- Filter by category and priority.
- Read customer message.
- See AI summary.
- Edit AI draft response.
- Send response.
- Mark solved.
- Escalate ticket.
- Link ticket to order.

## 16. Email System

- Use a backend email provider. Do not send important emails directly from the browser.
- Required templates: order confirmation, shipping update, tracking number, refund confirmation, support reply, abandoned cart, delayed shipment apology, supplier reminder, review request.
- Every email should be saved to an emailLogs collection or inside order/ticket history.
- Customer emails should be short, professional, and clear.

**Email template tone:**

- Simple English.
- Professional.
- No fake promises.
- Give clear next step.
- Include order number when possible.
- Include support email in footer.

## 17. Analytics Requirements

- Track product views.
- Track add to cart.
- Track checkout started.
- Track purchase completed.
- Track abandoned cart.
- Track traffic source.
- Track conversion rate.
- Track refund rate.
- Track product profit estimate.
- Track support issues per product.

**Dashboard metrics:** revenue, orders, average order value, conversion rate, gross profit estimate, refund amount, top products, worst products, delayed orders, support tickets, ad spend if connected later.

## 18. SEO Requirements

- Clean URLs such as /products/360-dashboard-phone-holder.
- Meta title and meta description for every product.
- Image alt text.
- Sitemap.xml.
- Robots.txt.
- Product schema markup.
- Fast mobile page speed.
- Blog system in later version.
- Avoid copied supplier descriptions.

## 19. Product Selection Rules

- Do not sell counterfeit branded products.
- Avoid regulated products, supplements, medicine, weapons, or unsafe products.
- Avoid products with high damage risk unless packaging is proven good.
- Avoid products with confusing sizing unless the page explains sizing clearly.
- Target products with at least $10 to $20 estimated profit after fees and shipping.
- Order samples for products before scaling ads.
- Start with 20 to 30 products only.

## 20. Testing and Launch Checklist

- Test add to cart.
- Test cart update.
- Test discount code.
- Test checkout in Stripe test mode.
- Test successful payment webhook.
- Test failed payment.
- Test order confirmation email.
- Test admin order dashboard.
- Test tracking update.
- Test support form.
- Test refund request flow.
- Test mobile design.
- Test policy pages.
- Test SEO metadata.
- Test Firestore security rules.
- Test Cloud Function errors.
- Test AI alert creation.
- Test daily report.
- Test backup/export process.

**Launch rule:** Do not go live until a test order can go from cart to payment to order confirmation to admin dashboard to fulfillment status to tracking email.

## 21. Claude Cheat Codes - Copy and Paste Prompts

Use these prompts in Claude when you want it to build the website professionally. Paste one phase at a time. Do not ask Claude to build everything in one message unless you only want a high-level skeleton.

### 21.1 Master /godmode Engineer Prompt

```
/godmode
You are a senior full-stack software engineer, product architect, security-minded Firebase backend developer, and ecommerce systems designer.

Build a professional dropshipping ecommerce website called Allyoucanuse.com.

Main goal:
Create one premium ecommerce website for useful products, starting with car accessories. The system must include a customer storefront, admin dashboard, Firebase backend, Stripe checkout, order management, supplier workflow, customer support, analytics, and an AI Operations Assistant module.

Technology requirements:
- Frontend: Next.js with TypeScript
- Styling: Tailwind CSS
- Backend: Firebase Cloud Functions with TypeScript
- Database: Cloud Firestore
- Auth: Firebase Auth
- Storage: Firebase Storage
- Payments: Stripe Checkout and Stripe webhooks
- Email: Resend or SendGrid through backend only
- AI: AI API called only through Cloud Functions
- Deployment: Firebase Hosting or Vercel plus Firebase backend

Engineering rules:
- Do not put secret keys in frontend code.
- Use environment variables for private keys.
- Use Firestore security rules.
- Use role-based admin access.
- Use clean folder structure.
- Use reusable components.
- Use strong TypeScript types.
- Use server-side validation for all important actions.
- Use Stripe webhooks to confirm payment.
- Log important admin and AI actions.
- Build in phases, not all at once.

Output format:
1. Explain architecture.
2. Create folder structure.
3. Create data models.
4. Create frontend components.
5. Create Firebase backend functions.
6. Create security rules.
7. Create test checklist.
8. Tell me exactly what files to create or update.

Start with V1 storefront MVP unless I ask for another phase.
```

### 21.2 V1 Storefront Prompt

```
/godmode build V1 storefront
Create the customer storefront for Allyoucanuse.com using Next.js, TypeScript, and Tailwind CSS.

Build these pages:
- Home
- Shop
- Category page
- Product detail page
- Cart
- Checkout redirect page
- Order success page
- Track order page
- Contact page
- About page
- FAQ page
- Shipping policy
- Return and refund policy
- Privacy policy
- Terms of service

Requirements:
- Mobile-first design
- Premium ecommerce look
- Clean navigation
- Product cards
- Category filters
- Search bar
- Add to cart
- Cart drawer or cart page
- Quantity update
- Remove item
- Discount code input placeholder
- SEO metadata per page
- Footer with all policy links

Use mock products first if backend is not ready.
Write clean TypeScript components and explain how each file works.
```

### 21.3 V2 Firebase Backend Prompt

```
/godmode build V2 Firebase backend
Create the Firebase backend for Allyoucanuse.com.

Use:
- Firebase Auth
- Cloud Firestore
- Firebase Storage
- Cloud Functions with TypeScript
- Firestore Security Rules

Create these Firestore collections:
- products
- categories
- customers
- carts
- orders
- suppliers
- supportTickets
- discounts
- aiAlerts
- aiLogs
- settings

Create TypeScript interfaces for all data models.
Create backend validation helpers.
Create Firebase initialization files.
Create admin role strategy using custom claims.
Create sample seed data for products and categories.
Create safe Firestore security rules.

Do not create any insecure public write access except controlled support ticket/contact form creation with validation.
```

### 21.4 Stripe Checkout and Webhook Prompt

```
/godmode build Stripe checkout
Add Stripe Checkout to Allyoucanuse.com using Firebase Cloud Functions.

Requirements:
- createCheckoutSession callable or HTTPS function
- Validate cart items on the server using Firestore product prices
- Never trust frontend price totals
- Create Stripe Checkout Session
- Save pending order in Firestore
- Redirect customer to Stripe Checkout
- stripeWebhook HTTPS function
- Verify Stripe webhook signature
- On successful checkout.session.completed, mark order as paid
- Save stripeCheckoutSessionId and stripePaymentIntentId
- Send order confirmation email after payment is confirmed
- Handle failed/canceled payments safely
- Add local test instructions
- Add environment variable names

Output code files and explain each step.
```

### 21.5 Admin Dashboard Prompt

```
/godmode build admin dashboard
Create a private admin dashboard for Allyoucanuse.com.

Pages:
- Admin overview
- Orders
- Order details
- Products
- Product create/edit
- Customers
- Suppliers
- Support tickets
- Discounts
- Analytics
- AI Control Center
- Settings

Requirements:
- Admin login with Firebase Auth
- Only users with admin custom claim can access admin pages
- Show order statuses
- Update fulfillment status
- Add tracking number
- Add supplier order ID
- Create/edit products
- View estimated profit per order
- View support tickets
- View AI alerts
- Keep clean professional UI

Use reusable components and protect routes.
```

### 21.6 AI Operations Assistant Prompt

```
/godmode build AI Operations Assistant
Build the AI Operations Assistant module for Allyoucanuse.com.

The AI should not be a separate website. It must be a backend module and an admin dashboard section.

Build:
- AI Control Center page
- aiAlerts collection
- aiLogs collection
- aiMonitorOrders Cloud Function
- aiClassifySupportTicket Cloud Function
- aiDailyReport scheduled Cloud Function
- AI draft reply system for support tickets
- Manual approval workflow

Rules:
- AI cannot issue refunds automatically.
- AI cannot cancel paid orders automatically.
- AI cannot change prices automatically.
- AI cannot promise delivery dates unless tracking confirms it.
- AI must escalate legal threats, angry customers, chargebacks, payment disputes, and high-value orders.
- Every AI action must be logged.

Automation levels:
- Manual approval
- Semi-automatic safe replies
- Safe automation only for low-risk tasks

Output the code architecture, data models, functions, and admin UI components.
```

### 21.7 Supplier Workflow Prompt

```
/godmode build supplier workflow
Create supplier management and dropshipping fulfillment workflow for Allyoucanuse.com.

Requirements:
- supplier profile page
- supplier fields on product
- supplier cost per product
- supplier product URL
- supplier SKU
- supplier order ID on order
- manual fulfillment status updates
- tracking number input
- supplier reminder email template
- AI supplier issue alerts
- low stock or unavailable product flag
- price change alert if API or manual import detects change

Do not auto-order from supplier in the first version unless admin approves.
```

### 21.8 QA and Security Review Prompt

```
/godmode QA review
Act as a senior QA engineer and security reviewer.

Review the Allyoucanuse.com codebase for:
- Broken checkout flow
- Insecure Firebase rules
- Secret keys exposed in frontend
- Missing server-side validation
- Stripe webhook mistakes
- Customers able to read other customers' orders
- Admin pages accessible by non-admin users
- Missing error handling
- Missing logs
- Mobile UI issues
- SEO issues
- Missing policy pages
- AI actions without approval

Output:
1. Critical issues
2. High-priority issues
3. Medium-priority improvements
4. Recommended fixes
5. Test cases I should run before launch
```

## 22. Definition of Done by Phase

**V1 Done** — User can browse products, add to cart, view cart, and see policy pages on mobile.

**V2 Done** — Firebase data models exist, products load from Firestore, admin login works, and security rules block unauthorized access.

**V3 Done** — Admin can manage products and orders from dashboard.

**V4 Done** — Order emails, support tickets, and tracking emails work from backend.

**V5 Done** — Each order can be connected to supplier workflow and tracking.

**V6 Done** — AI can create alerts, classify tickets, draft replies, and generate daily reports without taking risky actions.

**V7 Done** — Analytics show funnel, conversion, product views, and purchase events.

**V8 Done** — Scheduled jobs handle abandoned carts, delayed orders, and supplier checks.

**V9 Done** — Security rules, backend validation, audit logs, and role-based access are tested.

**V10 Done** — System is ready to scale or duplicate for a second niche site.

## 23. Files and Folder Structure

```
allyoucanuse/
- apps/
  - web/
    - app/
      - page.tsx
      - shop/
      - products/[slug]/
      - cart/
      - checkout/
      - order-success/
      - track-order/
      - support/
      - admin/
    - components/
      - layout/
      - product/
      - cart/
      - checkout/
      - admin/
      - ai/
    - lib/
      - firebaseClient.ts
      - cart.ts
      - analytics.ts
      - types.ts
    - styles/
- functions/
  - src/
    - index.ts
    - checkout/
    - webhooks/
    - emails/
    - orders/
    - suppliers/
    - ai/
    - admin/
    - utils/
- firestore.rules
- storage.rules
- firebase.json
- .firebaserc
- package.json
- README.md
- .env.example
```

## 24. Plain Text Build Commands for Yourself

**Personal build order:**

1. Create repo.
2. Create Next.js app with TypeScript.
3. Add Tailwind CSS.
4. Create Firebase project.
5. Add Firebase client config.
6. Create Firestore collections and seed products.
7. Build storefront pages.
8. Build cart logic.
9. Build Stripe checkout Cloud Function.
10. Build Stripe webhook.
11. Build admin dashboard.
12. Build product manager.
13. Build order manager.
14. Build email templates.
15. Build supplier workflow.
16. Build AI Control Center.
17. Add analytics pixels.
18. Test full checkout in test mode.
19. Test security rules.
20. Launch only after a complete test order works.

## 25. References Used for Technical Direction

- **Firebase Cloud Functions documentation:** Cloud Functions can run backend code in response to events, HTTPS requests, Admin SDK actions, or Cloud Scheduler jobs.
- **Firebase Firestore trigger documentation:** Firestore document changes can trigger Cloud Functions; functions must be idempotent because events may be delivered more than once.
- **Firebase Security Rules documentation:** rules can secure Firestore and Storage access and enforce conditions such as authentication and data validation.
- **Stripe Checkout documentation:** a Checkout Session represents a customer payment session and should be created when the customer attempts to pay.
- **Stripe Webhooks documentation:** Stripe can send event data to your backend endpoint when events happen in the Stripe account.
- **Firebase payments with Stripe documentation:** Firebase and Stripe can process payments in a web app without building your own server infrastructure.

## 26. Final Recommendation

Build one professional website first. Start with the storefront, then Firebase backend, then admin dashboard, then payments, then customer communication, then AI operations. Do not start with full automation. First, make the AI watch, summarize, draft, and alert. After the store is working, you can slowly allow safe automatic actions.

The winning system is not just a pretty website. The winning system is a business machine: products, checkout, orders, supplier workflow, support, tracking, analytics, profit tracking, and AI monitoring.

## 27. Claude Plain Mode Start Instructions

This section must be pasted into Claude before any coding starts. It tells Claude exactly where to begin without removing or changing the roadmap above. Use this when you open a new Claude chat or when Claude seems lost.

**Important:** Claude should start in plain mode. That means it should explain and build step by step using clean engineering instructions, not jump around, not skip setup, and not generate random files before the foundation is ready.

Use this order: first plan the project structure, then create the repository, then build V0, then move to V1, then continue version by version. Claude must not start with AI automation, Stripe, or supplier APIs until the basic storefront and Firebase foundation are working.

### 27.1 What Claude Must Do First

- Confirm the website goal: one professional dropshipping website for Allyoucanuse.com.
- Confirm the first niche: car accessories, unless the owner changes it later.
- Use Next.js with TypeScript for the frontend and admin dashboard.
- Use Firebase for Auth, Firestore, Storage, Cloud Functions, Cloud Scheduler, and Hosting or compatible deployment.
- Use Stripe Checkout for payments and Stripe webhooks for payment confirmation.
- Build the project in phases. Do not build everything in one messy response.
- Create clean folders, reusable components, typed interfaces, environment variables, and clear backend boundaries.
- Never put secret keys in frontend code.
- Use admin approval for risky AI actions such as refunds, cancellations, price changes, and customer dispute handling.

### 27.2 Exact Plain Mode Prompt to Paste into Claude

```
/godmode engineer plain mode

You are acting as a senior full-stack ecommerce engineer, Firebase architect, and product builder. I am building Allyoucanuse.com, one professional dropshipping website. Do not build three websites right now. Build one strong website first.

Use this tech stack:
- Next.js with TypeScript
- Firebase Auth
- Firestore
- Firebase Storage
- Firebase Cloud Functions
- Firebase Cloud Scheduler
- Stripe Checkout
- Stripe webhooks
- Email service integration later
- AI Operations Assistant later inside the admin dashboard

Your job is to start from the beginning and build the project professionally in phases. Do not skip steps. Do not start with AI automation, supplier APIs, or advanced features until the foundation works.

Start with V0 only.

V0 goal:
- Create the project structure
- Set up Next.js with TypeScript
- Set up Tailwind CSS or a clean styling system
- Create Firebase config files
- Create environment variable examples
- Create the main route structure
- Create placeholder pages for customer website and admin dashboard
- Create TypeScript models for Product, Customer, Order, CartItem, Supplier, SupportTicket, and AIAlert
- Create a clean README that explains how to run the project locally

Before writing code, show me the folder structure you recommend. Then give me the exact terminal commands. Then create the first files. Keep the code clean, modular, and production-minded.

Rules:
- Use plain English explanations.
- Use TypeScript.
- Do not expose secret keys.
- Do not create fake payment logic in the frontend.
- Do not create unnecessary features yet.
- Do not move to V1 until V0 is complete.
- After each phase, give me a checklist of what is complete and what I must test.

Begin with V0 project setup.
```

### 27.3 Claude Must Follow This Build Order

1. V0 - Project setup and clean folder structure.
2. V1 - Storefront pages: home, collections, product details, cart UI, policies, contact, FAQ, track order page.
3. V2 - Firebase foundation: Auth, Firestore collections, Storage, security rules draft, seed products.
4. V3 - Cart and checkout preparation: cart state, checkout summary, order draft creation.
5. V4 - Stripe Checkout and webhook: create checkout session, confirm payment, update order status.
6. V5 - Admin dashboard: admin login, products, orders, customers, suppliers, refunds, analytics shell.
7. V6 - Fulfillment workflow: supplier order status, tracking numbers, shipping updates, manual fulfillment controls.
8. V7 - Customer support system: support tickets, contact form, email templates, tracking replies, refund request flow.
9. V8 - AI Operations Assistant: AI alerts, order monitoring, support email drafts, delayed order detection, daily reports.
10. V9 - Marketing and analytics: SEO, pixels, abandoned cart flow, review system, blog/content pages.
11. V10 - Production launch: final testing, security review, performance review, Stripe live mode, backup plan, monitoring.

### 27.4 What Claude Should Not Do at the Start

- Do not build the AI assistant first.
- Do not connect real supplier APIs before products, orders, and admin tools exist.
- Do not add Stripe live keys before test mode works.
- Do not hard-code admin emails, API keys, product data, or secret values in the frontend.
- Do not create a messy one-file app.
- Do not skip Firestore rules or admin permission planning.
- Do not launch the website until a full test order can be placed, paid, confirmed, fulfilled, tracked, and refunded in test mode.

### 27.5 First Claude Response Must Include

- A short confirmation of the project goal.
- The recommended folder structure.
- The terminal commands to create the app.
- The Firebase setup checklist.
- The first TypeScript models to create.
- The first placeholder pages to create.
- A V0 completion checklist.

### 27.6 V0 Definition of Done

- Next.js project runs locally with no errors.
- TypeScript is configured.
- Firebase client config file exists but secrets are stored in environment variables.
- Basic routes exist for home, shop, product detail placeholder, cart, checkout placeholder, track order, support, policies, and admin.
- TypeScript interfaces exist for the main business objects.
- README explains how to run the project.
- No real payment, AI, supplier, or email automation is active yet.

### 27.7 Plain Mode Reminder for Claude

Use this reminder anytime Claude starts moving too fast:

> Stay in plain mode. Do not skip the current phase. Do not build advanced features until the current phase is complete. Explain the next action, write the code, then give me a test checklist. Build like a real engineer preparing a production ecommerce store.
