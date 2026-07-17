import { NextResponse, type NextRequest } from 'next/server';

// Pre-launch holding page. Flip off at launch by removing the COMING_SOON env
// var in Vercel (or setting it to anything other than "1") and redeploying.
// /admin stays open so products can be added while the public sees this page.
const COMING_SOON_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Refined Paw | Launching soon</title>
<style>
  :root { --teal:#0f766e; --amber:#f59e0b; --surface:#fbfaf8; --ink:#1c1917; --muted:#57534e; }
  * { box-sizing:border-box; margin:0; padding:0; }
  html,body { height:100%; }
  body {
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color:var(--ink); background:var(--surface);
    display:flex; align-items:center; justify-content:center; min-height:100vh; padding:24px;
    background-image: radial-gradient(1200px 600px at 50% -10%, rgba(15,118,110,0.10), transparent 60%);
  }
  .card { width:100%; max-width:560px; text-align:center; }
  .badge {
    display:inline-flex; align-items:center; gap:8px; font-weight:700; letter-spacing:.02em;
    color:var(--teal); font-size:15px; text-transform:uppercase;
  }
  .paw { font-size:56px; line-height:1; }
  h1 { font-size:clamp(28px,6vw,44px); font-weight:800; margin:18px 0 10px; letter-spacing:-0.02em; }
  h1 .amp { color:var(--teal); }
  p.lead { font-size:clamp(15px,3.5vw,18px); color:var(--muted); line-height:1.55; margin:0 auto; max-width:44ch; }
  .rule { width:56px; height:4px; border-radius:999px; background:var(--amber); margin:26px auto; }
  .foot { margin-top:28px; font-size:14px; color:var(--muted); }
  .foot a { color:var(--teal); text-decoration:none; font-weight:600; }
  .foot a:hover { text-decoration:underline; }
</style>
</head>
<body>
  <main class="card">
    <div class="paw" aria-hidden="true">🐾</div>
    <div class="badge">Refined&nbsp;Paw</div>
    <h1>We're getting everything <span class="amp">ready</span>.</h1>
    <p class="lead">We're a small team putting together thoughtful, well made gear for happy, healthy dogs. We want it to be just right, so give us a little time. Check back soon. We can't wait to show you around.</p>
    <div class="rule"></div>
    <p class="foot">Have a question? Reach us anytime at <a href="mailto:support@refinedpaw.com">support@refinedpaw.com</a></p>
  </main>
</body>
</html>`;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin + API always pass through (so products can be managed pre-launch).
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Public routes show the holding page while COMING_SOON is enabled.
  if (process.env.COMING_SOON === '1') {
    return new NextResponse(COMING_SOON_HTML, {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
    });
  }

  return NextResponse.next();
}

// Run on everything except Next internals and known static files.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)'],
};
