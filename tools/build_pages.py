import os
# Regenerates all *.html pages in the project root. Run: python3 tools/build_pages.py
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..'))
STORE='https://elclosetdelacielausa.com'
NAV=[('shop','Shop','shop.html'),('collections','Collections','collections.html'),('necklaces','Necklaces','necklaces.html'),('rings','Rings','rings.html'),('about','About Us','about.html'),('contact','Contact','contact.html')]
SVG_SEARCH='<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>'
SVG_USER='<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5c1.2-4 4-5.8 7.5-5.8s6.3 1.8 7.5 5.8"/></svg>'
SVG_BAG='<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M5 8h14l-1.2 12.5H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>'
SVG_MENU='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
PREV='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>'
NEXT='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>'

def head(title,desc,page):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="icon" href="images/logo-closet-de-la-ciela.webp" type="image/webp">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@400;500&family=Syncopate:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/styles.css">
</head>
<body data-page="{page}">
<a class="skip" href="#main">Skip to content</a>
<div class="announce" role="region" aria-label="Store announcements"><div class="announce-track"><p class="is-active">Free shipping on selected orders</p><p>International shipping from USA</p><p>14K–18K gold · 925 sterling silver · Moissanite</p></div></div>
<header class="site-header">
<div class="wrap">
<div class="header-row">
<button class="icon-btn nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Open menu">{SVG_MENU}</button>
<a class="logo" href="index.html" aria-label="El Closet de la Ciela Jewelry, home"><img src="images/logo-closet-de-la-ciela.webp" width="180" height="46" alt="El Closet de la Ciela Jewelry"></a>
<nav class="main-nav" id="main-nav" aria-label="Main">
<ul>
''' + '\n'.join(f'<li><a href="{h}"{" aria-current=\"page\"" if k==page else ""}>{n}</a></li>' for k,n,h in NAV) + f'''
</ul>
</nav>
<div class="header-actions">
<button class="icon-btn search-toggle" type="button" aria-label="Search" aria-expanded="false" aria-controls="search-bar">{SVG_SEARCH}</button>
<a class="icon-btn" href="{STORE}/account" aria-label="My account" target="_blank" rel="noopener">{SVG_USER}</a>
<a class="icon-btn" href="{STORE}/cart" aria-label="Shopping bag" target="_blank" rel="noopener">{SVG_BAG}</a>
</div>
</div>
</div>
<div class="search-bar" id="search-bar">
<div class="wrap">
<form role="search"><label class="sr-only" for="site-q">Search jewelry</label><input id="site-q" type="search" placeholder="Search jewelry…" autocomplete="off"><button class="btn" type="submit">Search</button></form>
</div>
</div>
</header>
<main id="main">
'''

def foot():
    return f'''</main>
<footer class="site-footer">
<div class="wrap">
<div class="footer-grid">
<div class="footer-brand">
<img src="images/logo-closet-de-la-ciela.webp" width="180" height="46" alt="El Closet de la Ciela Jewelry">
<p>Full of Jewelry, Full of Joy. International shipments from USA.</p>
</div>
<div>
<h4>Shop</h4>
<ul><li><a href="shop.html">All jewelry</a></li><li><a href="collections.html">Collections</a></li><li><a href="necklaces.html">Necklaces</a></li><li><a href="rings.html">Rings</a></li></ul>
</div>
<div>
<h4>Company</h4>
<ul><li><a href="about.html">About Us</a></li><li><a href="contact.html">Contact</a></li><li><a href="https://www.instagram.com/elclosetdelaciela/" target="_blank" rel="noopener">Instagram</a></li><li><a href="https://www.facebook.com/ElClosetDeLaCiela" target="_blank" rel="noopener">Facebook</a></li></ul>
</div>
<div>
<h4>Policies</h4>
<ul><li><a href="{STORE}/policies/terms-of-service" target="_blank" rel="noopener">Terms of Service</a></li><li><a href="{STORE}/policies/refund-policy" target="_blank" rel="noopener">Refund Policy</a></li><li><a href="{STORE}/policies/shipping-policy" target="_blank" rel="noopener">Shipping Policy</a></li></ul>
</div>
</div>
<div class="footer-bottom"><span>© <span data-year>2026</span> El Closet de la Ciela USA</span><span>Free shipping excludes taxes and international customs fees</span></div>
<p class="dev-credit">Development: <a href="https://www.erickhernandezarias.net/" target="_blank" rel="noopener">Erick Hernandez Arias</a></p>
</div>
</footer>
<script src="js/products.js"></script>
<script src="js/main.js"></script>
</body>
</html>
'''

def newsletter():
    return '''<section class="section"><div class="wrap newsletter">
<h2 class="h2">Sign up for the newsletter</h2>
<p class="lede">New pieces, restocks and offers, straight to your inbox.</p>
<form class="nl-form" data-demo-form data-success="Thank you for subscribing! (demo: no email was sent)" novalidate>
<label class="sr-only" for="nl-email">Your email</label>
<input id="nl-email" type="email" placeholder="Your email" autocomplete="email">
<button type="submit">Submit</button>
</form>
<p class="form-msg" role="status" aria-live="polite"></p>
</div></section>
'''

def page_hero(crumb,eyebrow,title,lede,img=None,alt=''):
    cls=' has-img' if img else ''
    im=f'<img src="{img}" alt="{alt}" width="1100" height="825">' if img else ''
    return f'''<section class="page-hero{cls}"><div class="wrap">
<div style="display:grid;gap:16px;{'justify-items:start' if img else 'justify-items:center'}">
<p class="crumbs" style="margin:0"><a href="index.html">Home</a> / {crumb}</p>
<span class="eyebrow">{eyebrow}</span>
<h1 class="h1">{title}</h1>
<p class="lede">{lede}</p>
</div>{im}
</div></section>
'''

def write(name,html):
    open(name,'w').write(html)

# ---------------- HOME ----------------
home=head('El Closet de la Ciela | Jewelry — Full of Jewelry, Full of Joy','14K–18K gold, 925 sterling silver and moissanite jewelry shipped from the USA.','home')+f'''<section id="top">
<div class="hs" role="region" aria-roledescription="carousel" aria-label="Featured collections">
<div class="hs-track" aria-live="off">
<article class="hs-slide is-active hs-full" role="group" aria-roledescription="slide" aria-label="1 of 4" style="background:#E8A9D6">
<a href="shop.html" aria-label="Welcome to our closet, shop new favorites" style="display:block;position:absolute;inset:0"><img src="images/hero-welcome.jpg" alt="Model wearing pavé hoop earrings against a pink and lilac backdrop, with the text Welcome to our closet" style="object-position:50% 62%"><span class="btn hs-full-cta">Shop new favorites</span></a>
</article>
<article class="hs-slide" role="group" aria-roledescription="slide" aria-label="2 of 4" style="background:#CFE6E3">
<div class="hs-text">
<span class="hs-eyebrow">Necklaces</span>
<h2 class="hs-title">Layer, stack <em>and mix</em></h2>
<p class="hs-copy">Find your new favorites in 14K–18K gold, 925 sterling silver and moissanite, shipped from the USA.</p>
<a class="btn" href="necklaces.html">Shop necklaces</a>
</div>
<div class="hs-media"><img src="images/necklaces-layered.webp" alt="Two layered necklaces, a bezel-set drop necklace and a pear-cut pendant" loading="lazy"></div>
</article>
<article class="hs-slide" role="group" aria-roledescription="slide" aria-label="3 of 4" style="background:#F3DDEC">
<div class="hs-text">
<span class="hs-eyebrow">Rings</span>
<h2 class="hs-title">Stack them, <em>love them</em></h2>
<p class="hs-copy">Slim bezel-set bands made to be worn together. Everyday sparkle that goes with everything.</p>
<a class="btn" href="rings.html">Shop rings</a>
</div>
<div class="hs-media"><img src="images/rings-stacked.webp" alt="Two slim bezel-set rings on a hand resting on blue velvet" loading="lazy"></div>
</article>
<article class="hs-slide" role="group" aria-roledescription="slide" aria-label="4 of 4" style="background:#DCE6F5">
<div class="hs-text">
<span class="hs-eyebrow">New color</span>
<h2 class="hs-title">A little <em>rainbow</em> for every day</h2>
<p class="hs-copy">Playful color for your neckline, in delicate pieces that go with everything.</p>
<a class="btn" href="shop.html?collection=new">Discover new arrivals</a>
</div>
<div class="hs-media"><img src="images/products/candy-baguette-zirconia-necklace-1.webp" alt="Candy Baguette Zirconia Necklace" loading="lazy" style="object-position:50% 30%"></div>
</article>
</div>
<div class="hs-ctrl">
<div class="hs-dots">
<button type="button" class="hs-dot" aria-label="Go to slide 1" aria-current="true"></button>
<button type="button" class="hs-dot" aria-label="Go to slide 2"></button>
<button type="button" class="hs-dot" aria-label="Go to slide 3"></button>
<button type="button" class="hs-dot" aria-label="Go to slide 4"></button>
</div>
<div class="hs-arrows">
<button type="button" class="hs-btn hs-prev" aria-label="Previous slide">{PREV}</button>
<button type="button" class="hs-btn hs-next" aria-label="Next slide">{NEXT}</button>
</div>
</div>
</div>
<div class="trust"><div class="wrap"><span>14K–18K gold</span><span>925 sterling silver</span><span>Moissanite &amp; zirconia</span><span>Ships from the USA</span></div></div>
</section>

<section id="new" class="section">
<div class="section-head"><span class="pill">New arrivals</span></div>
<div class="rail-wrap">
<div class="rail" data-products data-collection="new" data-limit="12"></div>
<div class="rail-progress" aria-hidden="true"><span></span></div>
<div class="rail-ctrl"><button type="button" class="hs-btn" data-rail="prev" aria-label="Previous products">{PREV}</button><button type="button" class="hs-btn" data-rail="next" aria-label="Next products">{NEXT}</button></div>
</div>
<div class="section-head" style="margin:32px 0 0"><a class="btn btn-ghost" href="shop.html">View all jewelry</a></div>
</section>

<section id="collections" class="section"><div class="wrap">
<div class="section-head"><h2 class="h2">Shop by collection</h2></div>
<div class="col-grid">
<a class="col-card" href="shop.html?collection=gold"><img src="images/products/celeste-moissanite-eternity-ring-1.webp" alt="" loading="lazy"><span class="col-text"><span class="eyebrow">Collection</span><span class="col-title">14K–18K Gold</span><span class="col-count" data-count="gold"></span></span></a>
<a class="col-card" href="shop.html?collection=silver"><img src="images/necklaces-layered.webp" alt="" loading="lazy"><span class="col-text"><span class="eyebrow">Collection</span><span class="col-title">925 Sterling Silver</span><span class="col-count" data-count="silver"></span></span></a>
<a class="col-card" href="shop.html?collection=new"><img src="images/products/mini-bezel-drops-necklace-1.webp" alt="" loading="lazy"><span class="col-text"><span class="eyebrow">Just in</span><span class="col-title">New Arrivals</span><span class="col-count" data-count="new"></span></span></a>
<a class="col-card" href="shop.html"><img src="images/rings-stacked.webp" alt="" loading="lazy"><span class="col-text"><span class="eyebrow">Everything</span><span class="col-title">All Jewelry</span><span class="col-count" data-count="all"></span></span></a>
</div>
</div></section>

<section id="necklaces" class="section" style="padding-top:clamp(64px,8vw,112px)">
<div class="split">
<div class="split-media"><img src="images/necklaces-layered.webp" alt="Two layered necklaces, a bezel-set drop necklace and a pear-cut pendant" style="object-position:50% 30%" loading="lazy"></div>
<div class="split-text"><div>
<span class="eyebrow">Necklaces</span>
<h2 class="h2">Made to be layered</h2>
<p class="lede" style="text-align:center">Bezel-set drops and pear-cut pendants that stack on a single neckline.</p>
<a class="btn" href="necklaces.html">Shop necklaces</a>
</div></div>
</div>
</section>

<section id="rings" style="margin-top:clamp(40px,5vw,72px)">
<div class="split rev">
<div class="split-text"><div>
<span class="eyebrow">Rings</span>
<h2 class="h2">Eternity, every day</h2>
<p class="lede" style="text-align:center">Slim bezel bands and full moissanite eternity rings, stackable and light on the hand.</p>
<a class="btn" href="rings.html">Shop rings</a>
</div></div>
<div class="split-media" style="background:#B9CBE3"><img src="images/rings-stacked.webp" alt="Two slim bezel-set rings on a hand resting on blue velvet" loading="lazy"></div>
</div>
</section>


<section class="section"><div class="wrap" style="max-width:1200px">
<a href="https://www.instagram.com/elclosetdelaciela/" target="_blank" rel="noopener"><img src="images/community-instagram.webp" width="1400" height="882" alt="Follow us and be part of the community, #CIELALOVERS, follow us on Instagram" loading="lazy"></a>
</div></section>

<section id="story" class="section"><div class="wrap about-home">
<div class="about-text">
<h2 class="h2">About us</h2>
<p class="lede">At El Clóset de la Ciela, we believe that every piece of jewelry should tell a story. Since 2013, inspired by the passion of Angelina Flores, ‘La Ciela,’ we have been selecting dainty and one-of-a-kind pieces that combine elegance with a fresh, youthful touch. Today, we reach from the Dominican Republic to the world, with international shipping and an online store based in the U.S., offering modern, accessible jewelry with that unmistakable joy our packages bring when they arrive.</p>
<span class="rule"></span>
<blockquote class="about-quote">“More than accessories, we deliver small treasures wrapped in a unique shopping experience.”</blockquote>
<a class="btn btn-ghost" href="about.html">Discover our story</a>
</div>
<div class="about-photo"><img src="images/about-seal.webp" width="573" height="780" alt="El Closet de la Ciela seal, since 2013" loading="lazy"></div>
</div></section>
'''+newsletter()+foot()
write('index.html',home)

# ---------------- SHOP ----------------
def chip(f,v,l,pressed=False): return f'<button type="button" class="chip" data-filter="{f}" data-value="{v}" aria-pressed="{str(pressed).lower()}">{l}</button>'
shop=head('Shop all jewelry | El Closet de la Ciela','Browse earrings, necklaces, bracelets and rings in 925 sterling silver, gold and moissanite.','shop')+page_hero('Shop','The catalog','Shop all jewelry','Earrings, necklaces, bracelets and rings. Every piece links to the live store at elclosetdelacielausa.com.')+f'''<section class="section" style="padding-top:clamp(32px,4vw,56px)"><div class="wrap">
<div class="toolbar">
<div>
<div class="chips" role="group" aria-label="Category" style="margin-bottom:10px">{chip('category','all','All',True)}{chip('category','necklaces','Necklaces')}{chip('category','earrings','Earrings')}{chip('category','bracelets','Bracelets')}{chip('category','rings','Rings')}</div>
<div class="chips" role="group" aria-label="Collection">{chip('collection','all','All collections',True)}{chip('collection','new','New arrivals')}{chip('collection','silver','925 Silver')}{chip('collection','gold','14K–18K Gold')}</div>
</div>
<div class="tools">
<label class="sr-only" for="shop-q">Search</label><input id="shop-q" type="search" placeholder="Search…" style="min-height:40px;border:1px solid var(--mint-line);border-radius:999px;padding:0 16px;font:inherit;background:#fff;color:var(--deep)">
<label class="check"><input type="checkbox" id="shop-stock"> In stock only</label>
<label class="sr-only" for="shop-sort">Sort</label>
<select id="shop-sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="az">Name: A–Z</option></select>
</div>
</div>
<p class="count" id="shop-count" role="status" aria-live="polite" style="margin:0 0 24px"></p>
<div class="grid" id="shop-grid"></div>
<div class="pager" id="shop-more" hidden><button type="button" class="btn btn-ghost">Load more</button></div>
</div></section>
'''+foot()
write('shop.html',shop)

# ---------------- COLLECTIONS ----------------
col=head('Collections | El Closet de la Ciela','Shop by collection: 14K–18K gold, 925 sterling silver, best sellers and new arrivals.','collections')+page_hero('Collections','Shop by collection','Collections','Pick a collection to start browsing.')+'''<section class="section" style="padding-top:clamp(32px,4vw,56px)"><div class="wrap">
<div class="col-grid">
<a class="col-card" href="shop.html?collection=gold"><img src="images/products/celeste-moissanite-eternity-ring-1.webp" alt="" loading="lazy"><span class="col-text"><span class="eyebrow">Collection</span><span class="col-title">14K–18K Gold</span><span class="col-count" data-count="gold"></span></span></a>
<a class="col-card" href="shop.html?collection=silver"><img src="images/necklaces-layered.webp" alt="" loading="lazy"><span class="col-text"><span class="eyebrow">Collection</span><span class="col-title">925 Sterling Silver</span><span class="col-count" data-count="silver"></span></span></a>
<a class="col-card" href="shop.html?collection=new"><img src="images/products/mini-bezel-drops-necklace-1.webp" alt="" loading="lazy"><span class="col-text"><span class="eyebrow">Just in</span><span class="col-title">New Arrivals</span><span class="col-count" data-count="new"></span></span></a>
<a class="col-card" href="shop.html"><img src="images/rings-stacked.webp" alt="" loading="lazy"><span class="col-text"><span class="eyebrow">Everything</span><span class="col-title">All Jewelry</span><span class="col-count" data-count="all"></span></span></a>
</div>
</div></section>
<section class="section"><div class="wrap">
<div class="section-head"><h2 class="h2">Shop by type</h2></div>
<div class="benefits">
<a class="value" href="necklaces.html"><h3>Necklaces</h3><p>Layering chains, tennis necklaces and chokers.</p></a>
<a class="value" href="shop.html?category=earrings"><h3>Earrings</h3><p>Studs, hoops and drops for every day.</p></a>
<a class="value" href="shop.html?category=bracelets"><h3>Bracelets</h3><p>Tennis and wave bracelets.</p></a>
<a class="value" href="rings.html"><h3>Rings</h3><p>Moissanite eternity bands, made to stack.</p></a>
</div>
</div></section>
'''+foot()
write('collections.html',col)

# ---------------- NECKLACES / RINGS ----------------
for key,name,eyeb,lede,img,alt,cat in [
 ('necklaces','Necklaces','Made to be layered','Bezel-set drops, pear-cut pendants and tennis chains that stack on a single neckline.','images/necklaces-layered.webp','Two layered necklaces, a bezel-set drop necklace and a pear-cut pendant','necklaces'),
 ('rings','Rings','Eternity, every day','Slim bezel bands and full moissanite eternity rings, stackable and light on the hand.','images/rings-stacked.webp','Two slim bezel-set rings on a hand resting on blue velvet','rings')]:
    h=head(f'{name} | El Closet de la Ciela',lede,key)+page_hero(name,eyeb,name,lede,img,alt)+f'''<section class="section" style="padding-top:clamp(40px,5vw,72px)"><div class="wrap">
<div class="toolbar"><p class="count" style="margin:0">{name} · all pieces</p><a class="btn btn-ghost" href="shop.html?category={cat}">Filter &amp; sort in Shop</a></div>
<div class="grid" data-products data-category="{cat}"></div>
</div></section>
'''+foot()
    write(f'{key}.html',h)

# ---------------- ABOUT ----------------
about=head('About Us | El Closet de la Ciela','The story behind El Closet de la Ciela: jewelry that feels like yours, every day of the week.','about')+page_hero('About Us','About us','Jewelry that feels like yours','Full of Jewelry, Full of Joy.')+'''<section class="section" style="padding-top:clamp(40px,5vw,72px)"><div class="wrap">
<div class="prose">
<p>[Your brand story goes here: since 2013, where the pieces come from and why people wear them every day.]</p>
<h2>What we make</h2>
<p>14K–18K gold, 925 sterling silver, moissanite and zirconia jewelry, designed to be layered, stacked and worn every day.</p>
<div class="values">
<div class="value"><h3>Everyday pieces</h3><p>Light, comfortable jewelry that goes from morning to night.</p></div>
<div class="value"><h3>Quality materials</h3><p>14K–18K gold, 925 sterling silver and moissanite.</p></div>
<div class="value"><h3>Shipped from the USA</h3><p>International shipments, packed and sent from the United States.</p></div>
</div>
<p style="margin-top:12px"><a class="btn" href="shop.html">Shop the collection</a></p>
</div>
</div></section>
'''+foot()
write('about.html',about)

# ---------------- CONTACT ----------------
contact=head('Contact | El Closet de la Ciela','Get in touch with El Closet de la Ciela.','contact')+page_hero('Contact','Get in touch','Contact us','Questions about an order or a piece? Write to us.')+f'''<section class="section" style="padding-top:clamp(40px,5vw,72px)"><div class="wrap">
<div class="contact-grid">
<div>
<form class="form" data-demo-form data-success="Thanks! Your message was validated (demo: no email was sent)." novalidate>
<div class="field"><label for="c-name">Name</label><input id="c-name" name="name" type="text" autocomplete="name"></div>
<div class="field"><label for="c-email">Email</label><input id="c-email" type="email" autocomplete="email"></div>
<div class="field"><label for="c-msg">Message</label><textarea id="c-msg"></textarea></div>
<div><button class="btn" type="submit">Send message</button></div>
<p class="form-msg" role="status" aria-live="polite"></p>
</form>
</div>
<aside class="info">
<div><h3>Follow us</h3><p style="margin:0"><a href="https://www.instagram.com/elclosetdelaciela/" target="_blank" rel="noopener">Instagram</a> · <a href="https://www.facebook.com/ElClosetDeLaCiela" target="_blank" rel="noopener">Facebook</a></p></div>
<div><h3>Shipping</h3><p style="margin:0;color:var(--body)">International shipments from USA. Free shipping on selected orders; taxes and customs fees not included.</p></div>
<div><h3>Policies</h3>
<details class="policy" id="policies"><summary>Shipping policy</summary><p>Read the full policy in our <a href="{STORE}/policies/shipping-policy" target="_blank" rel="noopener">online store</a>.</p></details>
<details class="policy"><summary>Refund policy</summary><p>Read the full policy in our <a href="{STORE}/policies/refund-policy" target="_blank" rel="noopener">online store</a>.</p></details>
<details class="policy"><summary>Terms of service</summary><p>Read the full terms in our <a href="{STORE}/policies/terms-of-service" target="_blank" rel="noopener">online store</a>.</p></details>
</div>
</aside>
</div>
</div></section>
'''+foot()
write('contact.html',contact)

product=head('Product | El Closet de la Ciela','El Closet de la Ciela jewelry.','shop')+'''<section class="section" id="product" style="padding-top:clamp(32px,4vw,56px)"><div class="wrap"><p class="empty">Loading…</p></div></section>
<section class="section"><div class="wrap">
<div class="section-head"><h2 class="h2">You may also like</h2></div>
<div class="grid" id="related"></div>
</div></section>
'''+foot()
write('product.html',product)
print('ok')
