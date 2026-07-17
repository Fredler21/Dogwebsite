/*
 * One-off: load the starter catalog (12 dog products) into Firestore as DRAFTS.
 *
 * Everything lands as status:'draft' / active:false, so nothing is public or
 * buyable until you open each product in /admin/products, add the real supplier
 * photo, confirm the price, and switch it to Active. Re-running is safe: a
 * product whose slug already exists is skipped, not duplicated.
 *
 * How to run (same as grant-admin.js):
 *   1. Firebase console -> settings -> Service accounts -> "Generate new private
 *      key". Save the JSON outside the repo.
 *   2. From the functions/ folder:
 *
 *      PowerShell:
 *        $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccount.json"
 *        node scripts/seed-products.js
 *
 *      Bash:
 *        GOOGLE_APPLICATION_CREDENTIALS="/c/path/to/serviceAccount.json" \
 *          node scripts/seed-products.js
 */
const admin = require('firebase-admin');

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to your service-account JSON first (see header).');
  process.exit(1);
}

admin.initializeApp(); // reads GOOGLE_APPLICATION_CREDENTIALS
const db = admin.firestore();

// price / compareAt / cost / ship are in CENTS. category ids match the store.
const PRODUCTS = [
  { category: 'toys', title: 'Snuffle Feeding Mat', price: 2600, compareAt: 3600, cost: 600, ship: 500,
    description: 'Turn mealtime into a game. Hide kibble or treats in the soft fabric folds and let your dog sniff, forage, and work for every bite. Great for slowing down fast eaters and burning off nervous energy on rainy days.' },
  { category: 'toys', title: 'Interactive Treat Puzzle', price: 2400, compareAt: 3300, cost: 600, ship: 500,
    description: 'A puzzle that keeps clever dogs occupied. Your pup slides and flips the covers to find hidden treats, which builds focus and takes the edge off boredom. Wipes clean in seconds when the fun is over.' },
  { category: 'beds', title: 'Calming Donut Bed', price: 4900, compareAt: 6900, cost: 1600, ship: 1200,
    description: 'A deep, plush nest your dog can burrow into and feel safe. The raised rim gives them somewhere to rest their head, and the soft filling helps anxious sleepers settle down and stay cozy all night.' },
  { category: 'beds', title: 'Self Cooling Gel Mat', price: 3400, compareAt: 4400, cost: 1000, ship: 800,
    description: 'Keeps your dog comfortable when the weather heats up. The pressure activated gel stays cool with no water, no power, and no fridge needed. Perfect for crates, car rides, and hot afternoons on the porch.' },
  { category: 'walking', title: 'No Pull Adjustable Harness', price: 3400, compareAt: 4500, cost: 900, ship: 500,
    description: 'Walks without the choking and pulling. The front clip gently turns your dog back toward you instead of straining their neck, and four adjustment points give a snug, comfortable fit on almost any body shape.' },
  { category: 'walking', title: 'Rechargeable LED Safety Collar', price: 2400, compareAt: 3200, cost: 500, ship: 400,
    description: 'Keep your dog visible on every evening walk. The rechargeable band glows bright for hours on one charge and switches between steady and flashing, so drivers and other walkers see you coming from far away.' },
  { category: 'grooming', title: 'Deshedding Grooming Glove', price: 1800, compareAt: 2500, cost: 400, ship: 400,
    description: 'Grooming that feels like petting. Soft rubber tips lift loose fur and massage the coat at the same time, so most dogs actually enjoy it. The fur sticks right to the glove and peels off in one piece.' },
  { category: 'grooming', title: 'Paw Cleaner Cup', price: 1800, compareAt: 2600, cost: 500, ship: 400,
    description: 'Muddy paws, meet their match. Add a little water, dip each paw, give a gentle twist, and the soft silicone bristles clean between the toes. No more dirty prints across your floors after every walk.' },
  { category: 'feeding', title: 'Slow Feeder Bowl', price: 1900, compareAt: 2600, cost: 400, ship: 500,
    description: 'For the dog who inhales dinner. The winding ridges make your pup eat around them, which slows things down, helps digestion, and cuts back on the gulped air that causes bloating. Fits a normal portion with room to spare.' },
  { category: 'feeding', title: 'Lick Mat', price: 1600, compareAt: 2200, cost: 300, ship: 400,
    description: 'A calm, happy distraction. Spread on peanut butter, yogurt, or wet food and let your dog lick away, which soothes them during baths, nail trims, or time alone. Suction cups hold it flat to the floor or tub.' },
  { category: 'travel', title: 'Car Back Seat Hammock', price: 3900, compareAt: 5400, cost: 1200, ship: 900,
    description: 'Protect your back seat and keep your dog secure. The waterproof hammock catches fur, mud, and scratches, and the raised sides help stop your pup sliding into the footwell on quick stops. Buckles on in a couple of minutes.' },
  { category: 'travel', title: 'Collapsible Travel Water Bottle', price: 1900, compareAt: 2600, cost: 500, ship: 400,
    description: 'Fresh water anywhere you both go. Tip the bottle and water fills the built in bowl, then press the button and it drains back in with no waste. The whole thing folds flat for pockets, bags, and long hikes.' },
];

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

(async () => {
  let created = 0, skipped = 0;
  for (const p of PRODUCTS) {
    const slug = slugify(p.title);
    const dupe = await db.collection('products').where('slug', '==', slug).limit(1).get();
    if (!dupe.empty) {
      console.log(`skip  ${p.title} (slug "${slug}" already exists)`);
      skipped++;
      continue;
    }
    const now = Date.now();
    await db.collection('products').add({
      title: p.title,
      slug,
      description: p.description,
      categoryId: p.category,
      images: [],                 // add the real supplier photo in /admin before activating
      price: p.price,
      compareAtPrice: p.compareAt,
      active: false,              // security rules gate public reads on this
      status: 'draft',            // checkout + admin lifecycle
      trackInventory: true,
      inventoryCount: 25,
      stockStatus: 'in_stock',
      costCents: p.cost,          // admin-only sourcing fields
      shippingCostCents: p.ship,
      vendor: 'Refined Paw',
      createdAt: now,
      updatedAt: now,
    });
    console.log(`add   ${p.title}  ($${(p.price / 100).toFixed(2)}, ${p.category})`);
    created++;
  }
  console.log(`\nDone. ${created} added, ${skipped} skipped. Open /admin/products to add photos and activate.`);
  process.exit(0);
})().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
