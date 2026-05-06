-- =====================================================
-- BLOG POSTS SEED DATA — Men's World Kenya
-- =====================================================
-- Run this in Supabase SQL Editor AFTER supabase-schema.sql
-- These are 8 original articles written for Men's World Kenya.
-- =====================================================

-- Clear existing sample post first to avoid slug conflicts
DELETE FROM public.blog_posts WHERE slug IN (
  '5-ways-to-style-a-turkish-suit',
  'how-to-dress-sharp-on-a-budget-kenya',
  'complete-guide-to-suit-fit',
  'best-shoes-for-kenyan-men',
  'office-to-evening-style-guide',
  'how-to-care-for-your-suits',
  'building-a-capsule-wardrobe-kenya',
  'dress-code-guide-kenyan-events',
  'how-to-choose-dress-shirt'
);

INSERT INTO public.blog_posts
  (title, slug, excerpt, content, cover_image, category, author_name, published, read_time)
VALUES

-- ── POST 1 ────────────────────────────────────────────
(
  '5 Ways to Style a Turkish Suit for Any Occasion',
  '5-ways-to-style-a-turkish-suit',
  'From boardroom meetings to weekend weddings — learn how to get maximum versatility from your Men''s World Turkish suit.',
  '<p>A well-fitted Turkish suit is the single most versatile item in a Kenyan gentleman''s wardrobe. Whether you''re closing a deal in Nairobi''s CBD, attending a Saturday wedding in Karen, or celebrating a family function in the village, the right suit worn the right way says everything about who you are before you even open your mouth.</p>

<p>At Men''s World Kenya, our Turkish suits are crafted from premium wool blends that drape beautifully in both Nairobi''s cool evenings and the warm afternoons of the coast. Here are five ways to style yours.</p>

<h2>1. The Classic Boardroom Look</h2>

<p>For office and corporate settings, wear your suit fully — jacket and matching trouser — with a crisp white dress shirt and a slim tie in a solid colour like burgundy, navy or forest green. Keep accessories minimal. A leather belt that matches your Oxford shoes, a simple watch, and a pocket square folded in a straight presidential fold. Let the suit do the talking.</p>

<div class="tip"><p><strong>Tip:</strong> In Nairobi''s CBD, the charcoal grey suit is king. It reads serious without being harsh, and pairs with almost every shirt colour.</p></div>

<h2>2. The Wedding Guest</h2>

<p>For weddings, you have more freedom to introduce personality. Try a navy suit with a light blue shirt left open at the collar — no tie — and brown suede loafers. Add a pocket square in a bold pattern: paisley, florals, or geometric prints all work. This says "I made an effort" without trying too hard.</p>

<p>If the wedding has a specific colour theme, use your pocket square and tie to incorporate that colour rather than changing your whole outfit.</p>

<h2>3. Smart Casual — Jacket Only</h2>

<p>One of the most underused tricks with a two-piece suit is wearing the jacket separately as a blazer. Pair your suit jacket with dark slim jeans and a plain white or black crew-neck T-shirt. Finish with clean white sneakers or loafers. This is the perfect outfit for a nice dinner, a casual Friday, or a date night in Westlands.</p>

<blockquote><p>"The suit jacket is doing all the heavy lifting. Once it''s on, everything underneath becomes a detail."</p></blockquote>

<h2>4. The Funeral or Formal Ceremony</h2>

<p>For more solemn occasions, stick to your darkest suit — black or very dark navy. White shirt. Black tie. Black leather shoes, polished. This is not the time for experimentation. The goal is to show respect through restraint. Keep everything pressed, fitted, and clean.</p>

<h2>5. The Evening Event</h2>

<p>For dinners, galas, or evening events, introduce texture and richness. A black suit with a deep jewel-toned shirt — emerald, sapphire, or wine — and black leather shoes looks striking under evening lighting. Skip the tie and leave the top button undone for a relaxed elegance that photographs beautifully.</p>

<h2>Final Thought</h2>

<p>The Turkish suits at Men''s World Kenya are designed precisely for this kind of versatility. Made with structure that holds through a full day of meetings and comfort that survives a long evening, they are built for the modern Kenyan man who needs to look sharp across every setting life throws at him.</p>

<p>Visit us at <strong>Yala Towers, Shop 101, Biashara Street, Nairobi</strong> — or order via WhatsApp on <strong>0716 057 611</strong> and we''ll deliver to your door anywhere in Kenya.</p>',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
  'Style Tips',
  'Men''s World Kenya',
  TRUE,
  6
),

-- ── POST 2 ────────────────────────────────────────────
(
  'How to Dress Sharp on a Budget in Kenya',
  'how-to-dress-sharp-on-a-budget-kenya',
  'Looking good doesn''t require spending a fortune. Here''s how Kenyan men can build a sharp, versatile wardrobe without breaking the bank.',
  '<p>There''s a common misconception that dressing well is expensive. It''s not. Dressing poorly is expensive — because you keep buying things that don''t work together, don''t last, and don''t make you feel confident. Dressing well, done right, is one of the smartest investments you can make.</p>

<p>Here is a practical, no-nonsense guide to building a sharp wardrobe on a Kenyan budget.</p>

<h2>Start With the Basics — Not the Trends</h2>

<p>Trends change every season. Basics never go out of style. Before you buy anything else, make sure you own these five items:</p>

<ul>
<li>One well-fitted dark suit (navy or charcoal)</li>
<li>Two white dress shirts and one light blue shirt</li>
<li>One pair of black Oxford shoes, well polished</li>
<li>Two pairs of dark trousers (black and khaki)</li>
<li>One dark leather belt that matches your shoes</li>
</ul>

<p>These pieces work together in dozens of combinations. With just these five items, you can dress appropriately for a job interview, a wedding, a church service, or a business meeting.</p>

<h2>Buy Less, Buy Better</h2>

<p>A Ksh 8,500 Turkish suit from Men''s World Kenya that fits you perfectly and lasts five years is dramatically better value than three Ksh 3,000 suits from a roadside stall that lose their shape after six months. Every time you buy something cheap that doesn''t last, you pay for it twice.</p>

<div class="tip"><p><strong>The Ksh 500 test:</strong> Before buying any item, ask yourself — "Would I still want this if it cost Ksh 500 more?" If the answer is no, you''re buying price, not value.</p></div>

<h2>Fit Is Everything — And It''s Free</h2>

<p>The single biggest upgrade you can make to your wardrobe costs nothing: wear clothes that actually fit your body. A Ksh 2,500 shirt that fits perfectly looks better than a Ksh 12,000 designer shirt that''s too big or too tight. Shoulders should sit at your shoulder. Shirt cuffs should peek slightly past your jacket sleeve. Trouser break should be minimal.</p>

<p>If something fits everywhere except one small area, a good tailor in Nairobi can alter it for Ksh 200–500. That''s always worth it.</p>

<h2>The Power of Clean and Pressed</h2>

<p>Iron your shirts. Polish your shoes. Keep your clothes lint-free and hanging properly. These habits cost almost nothing and make an enormous difference to how you''re perceived. A cheap outfit that is clean and pressed will almost always beat an expensive outfit that is wrinkled and scuffed.</p>

<h2>Build Gradually, Not All at Once</h2>

<p>You don''t need to buy everything at once. Add one quality piece per month. After six months you''ll have a wardrobe that serves you far better than anything bought in a panic shopping spree.</p>

<blockquote><p>"Dress for where you want to go, not just where you are."</p></blockquote>

<p>At Men''s World Kenya, we''ve specifically built our pricing to make quality accessible to every man — from the recent graduate stepping into his first job to the entrepreneur who needs to look like the CEO he is. Visit us at Yala Towers or reach us on WhatsApp: <strong>0716 057 611</strong>.</p>',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80',
  'Style Tips',
  'Men''s World Kenya',
  TRUE,
  5
),

-- ── POST 3 ────────────────────────────────────────────
(
  'The Complete Guide to Suit Fit for Kenyan Men',
  'complete-guide-to-suit-fit',
  'A suit that doesn''t fit is just expensive fancy dress. Here''s exactly what a well-fitted suit should look like — and how to know if yours does.',
  '<p>Walk through any Nairobi office block, wedding venue or church on Sunday and you''ll notice something: most men are wearing suits. But far fewer men are wearing suits that actually fit them. The difference between a man who looks effortlessly sharp and one who just looks like he''s wearing a suit is almost always fit.</p>

<p>Here is your definitive guide to suit fit — what to look for, what to avoid, and how to fix it.</p>

<h2>The Shoulders — The Most Important Part</h2>

<p>The shoulder seam of your jacket should sit exactly at the edge of your shoulder — not hanging over, not pulling back. This is the one measurement that is almost impossible to alter cheaply. If the shoulders don''t fit, don''t buy the suit.</p>

<p>When you raise your arms slightly, the jacket should lift with you rather than pulling tightly across the back. If you see horizontal pulling lines across the upper back, the jacket is too small in the shoulders.</p>

<h2>The Chest — Enough to Button Comfortably</h2>

<p>When you button your jacket, you should be able to slide a flat hand inside without straining the fabric. You should also be able to breathe deeply without the button pulling. If you see an X-shape forming at the button, the chest is too tight.</p>

<div class="tip"><p><strong>Remember:</strong> A single-button suit jacket should show a slight waist suppression — an hourglass shape — when buttoned. If it hangs straight like a rectangle, it''s too big.</p></div>

<h2>The Sleeve Length</h2>

<p>Your jacket sleeve should end where your wrist begins, showing approximately 1–1.5cm of your shirt cuff. This "shirt peek" is not optional — it is a mark of a properly fitted suit. If your shirt is not visible at all, your jacket sleeves are too long.</p>

<h2>The Jacket Length</h2>

<p>A classic rule: your jacket should be long enough to cover your seat entirely, and the bottom of the jacket should line up roughly with your knuckles when your arms hang naturally at your sides.</p>

<h2>The Trousers</h2>

<p>Trouser fit has three key areas:</p>

<ul>
<li><strong>The seat:</strong> Should follow your body without sagging or pulling</li>
<li><strong>The thighs:</strong> Should have some room — not tight, not baggy</li>
<li><strong>The break:</strong> Modern style favors a slight break or no break at all — avoid excess fabric pooling at your shoes</li>
</ul>

<h2>What a Tailor Can Fix</h2>

<p>Almost everything except the shoulders can be altered. Sleeves can be shortened. The body can be taken in. Trouser hems and waistbands are easy to adjust. A good tailor in Nairobi will charge Ksh 300–800 for most alterations — always worth it.</p>

<p>At Men''s World Kenya, our team will help you find the right size before you buy. Visit us at <strong>Yala Towers, Shop 101</strong> and try before you commit.</p>',
  'https://images.unsplash.com/photo-1594938298603-c8148c4b1690?w=1200&q=80',
  'Style Guide',
  'Men''s World Kenya',
  TRUE,
  7
),

-- ── POST 4 ────────────────────────────────────────────
(
  'The Best Shoes for Kenyan Men — and When to Wear Each',
  'best-shoes-for-kenyan-men',
  'Your shoes tell people where you''ve been and where you''re going. Here''s the definitive guide to men''s footwear for every occasion in Kenya.',
  '<p>There is an old saying among tailors: a man can get away with many things, but never bad shoes. Your shoes are the first thing many people notice and the last thing you should cut corners on. Here is everything you need to know about building a shoe wardrobe that works for Kenyan life.</p>

<h2>The Oxford — Your Foundation</h2>

<p>The Oxford shoe is the most formal shoe a man can wear, and every serious Kenyan man should own at least one pair in black leather. Closed lacing, clean toe, minimal decoration. This is the shoe for funerals, job interviews, court appearances, and any formal event where you need to project absolute authority and seriousness.</p>

<p>Brown Oxford shoes are slightly less formal and pair beautifully with navy or grey suits for weddings and business meetings where you want to look polished but approachable.</p>

<h2>The Derby — Slightly More Relaxed</h2>

<p>The Derby has an open lacing system, making it slightly less formal than the Oxford but still very much a dress shoe. It''s more forgiving on different foot shapes and works well with suits for the office, church, and smart-casual settings.</p>

<div class="tip"><p><strong>Kenyan climate tip:</strong> Black leather shoes show dust more quickly in Nairobi''s dry season. A quick buff with a soft cloth each morning keeps them looking sharp all day.</p></div>

<h2>The Loafer — Smart Casual King</h2>

<p>Slip-on loafers — particularly in tan, cognac, or dark brown — are among the most versatile shoes a Kenyan man can own. They dress down a suit perfectly, elevate a pair of chinos, and add sophistication to a casual outfit. Avoid wearing loafers with very formal suits — save those for Oxfords.</p>

<h2>Chelsea Boots — For the Man Who Wants to Stand Out</h2>

<p>Chelsea boots with a sharp suit are a powerful combination that most Kenyan men haven''t fully embraced yet. In black or dark brown leather with a thin sole, they look fantastic with slim trousers and add a modern, fashion-forward edge to classic tailoring.</p>

<h2>Sneakers — Know When and How</h2>

<p>Clean, minimal leather sneakers (think white or off-white) work well with smart-casual outfits — suit jacket, jeans, T-shirt. They do not belong at the office, a wedding, or any formal event. The rule is simple: if you''re wearing a full suit, leave the sneakers at home.</p>

<h2>How Many Pairs Do You Need?</h2>

<p>To cover most occasions in Kenyan life, aim for these three pairs minimum:</p>

<ul>
<li>One pair of black Oxford or Derby shoes</li>
<li>One pair of brown leather loafers or Derbies</li>
<li>One pair of clean casual shoes or Chelsea boots</li>
</ul>

<p>Browse our full shoe collection at Men''s World Kenya — sizes 39 to 45, starting from Ksh 5,500. Available in-store at Yala Towers and via WhatsApp delivery nationwide.</p>',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
  'Style Guide',
  'Men''s World Kenya',
  TRUE,
  6
),

-- ── POST 5 ────────────────────────────────────────────
(
  'From Office to Evening: The One Outfit That Does Both',
  'office-to-evening-style-guide',
  'Long days in Nairobi mean you often go straight from the office to dinner or an event. Here''s how to dress for both without going home to change.',
  '<p>One of the realities of working and socialising in Nairobi is that your day rarely ends when the office closes. A board meeting at 3pm can easily become drinks in Westlands by 7pm, or a presentation in the morning can roll into a client dinner that evening. The man who planned for this looks effortless. The man who didn''t looks like he just came from work.</p>

<p>Here is how to build one outfit that works for both.</p>

<h2>The Foundation: A Versatile Suit in the Right Colour</h2>

<p>Navy blue is your best friend here. It''s authoritative enough for the boardroom and sophisticated enough for a restaurant or event. Charcoal grey works too. Avoid very light colours — they''re harder to keep fresh-looking across a long day — and avoid black unless the evening event is very formal.</p>

<h2>The Morning Setup: Professional Mode</h2>

<p>Start the day with your navy suit, a crisp white shirt, and a slim tie in a solid or subtle pattern. Add black Oxford shoes. This is your office configuration — clean, authoritative, professional.</p>

<h2>The Evening Transformation — 3 Small Changes</h2>

<p>When the working day ends and the social evening begins, make these three changes:</p>

<ul>
<li><strong>Remove the tie</strong> and open the top button of your shirt</li>
<li><strong>Add a pocket square</strong> if you didn''t have one — a simple white square fold adds personality</li>
<li><strong>Spray a light fragrance</strong> — your morning scent has faded; a quick spritz refreshes your presence</li>
</ul>

<blockquote><p>"The tie comes off and suddenly the same man who was running a meeting is now someone you want to have dinner with."</p></blockquote>

<p>That''s it. Three changes, under two minutes, and you''ve shifted from corporate professional to sophisticated evening guest without touching your suit.</p>

<h2>What to Keep in Your Office Drawer</h2>

<p>If you do this transition regularly, keep these at your desk or in your car:</p>

<ul>
<li>A lint roller</li>
<li>A spare pocket square</li>
<li>A small bottle of your evening fragrance</li>
<li>A shoe polishing cloth</li>
</ul>

<p>Two minutes of preparation separates a man who looks like he planned his evening from one who clearly just survived a long day.</p>

<h2>The Right Suit Makes It Easier</h2>

<p>All of this only works if your suit is made of a fabric that holds its shape across a long day. Cheap suits sag, crease, and shine under office lighting by midday. Our Turkish suits at Men''s World Kenya are structured specifically to maintain their drape across extended wear — so by the time 7pm arrives, you still look like you just put it on.</p>

<p>Find your perfect transitional suit at <strong>Yala Towers, Shop 101</strong> or order via WhatsApp: <strong>0716 057 611</strong>.</p>',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
  'Style Tips',
  'Men''s World Kenya',
  TRUE,
  5
),

-- ── POST 6 ────────────────────────────────────────────
(
  'How to Care for Your Suits So They Last for Years',
  'how-to-care-for-your-suits',
  'A quality suit is an investment. Here''s exactly how to clean, store, and maintain your suits so they look great for years.',
  '<p>A well-made suit, properly cared for, can last a decade or more. The same suit, neglected, looks tired within a year. Most men in Kenya have no idea how to properly care for their suits — and it''s costing them money and appearance.</p>

<p>Here is the complete maintenance guide.</p>

<h2>Rule One: Never Wash a Suit in a Machine</h2>

<p>This seems obvious but is violated constantly. Machine washing destroys the internal structure of a suit jacket — the canvas, the padding, the careful construction that gives it its shape. Once that structure is damaged, it cannot be repaired. The suit is ruined.</p>

<p>Suits should be dry cleaned. But not too frequently — dry cleaning uses chemicals that gradually break down fabric. Aim for dry cleaning only two to three times per year.</p>

<h2>Between Wears: The Brush</h2>

<p>Invest in a good clothes brush — a natural bristle brush costs about Ksh 500–800 at most shopping centres. After every wear, brush your suit jacket downward along the grain of the fabric. This removes dust, lint, and skin cells before they settle into the fibres. It also restores the nap of the fabric, keeping it looking fresh.</p>

<div class="tip"><p><strong>Simple habit:</strong> Brush your suit as soon as you take it off, while it''s still warm from your body. The fibres are more open and release particles more easily.</p></div>

<h2>Air It Out — Every Time</h2>

<p>Never put a suit directly back in the wardrobe after wearing it. Hang it in open air — ideally near a window with some ventilation — for at least an hour before storing. This allows body moisture to evaporate. A suit stored while damp develops odour that is very difficult to remove.</p>

<h2>The Right Hanger</h2>

<p>Thin wire hangers from the dry cleaner destroy suit shoulders over time. Invest in wide, curved wooden or plastic hangers that support the full shoulder of the jacket. Your suit jacket should never look like it''s fighting its hanger.</p>

<h2>Trouser Care</h2>

<p>Suit trousers crease easily and need regular pressing. Hang them using a trouser hanger with a clamp — hanging them by the waistband keeps the crease sharp and prevents horizontal creasing from folding. Press with a slightly damp cloth between the iron and the trouser to avoid shine on the fabric.</p>

<h2>Storage: Breathable, Not Plastic</h2>

<p>If storing a suit for a long period — say, a season — use a breathable cotton suit bag, not the plastic bags from dry cleaners. Plastic traps moisture and encourages mildew. Cedar blocks in the wardrobe repel moths naturally.</p>

<h2>Rotation is Maintenance</h2>

<p>If you wear the same suit every day, it will wear out far faster than if you rotate between two or three suits. The fibres need time to recover between wears. This is one of the strongest arguments for building a small collection rather than relying on a single suit.</p>

<p>Our full range of suits at Men''s World Kenya starts from Ksh 8,500. Built to last — if you take care of them. Visit us at Yala Towers or call <strong>0716 057 611</strong>.</p>',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  'Care Guide',
  'Men''s World Kenya',
  TRUE,
  5
),

-- ── POST 7 ────────────────────────────────────────────
(
  'Building a Capsule Wardrobe for the Kenyan Man',
  'building-a-capsule-wardrobe-kenya',
  'What if you could open your wardrobe every morning and instantly know what to wear? Here''s how to build a capsule wardrobe that works for Kenyan life.',
  '<p>A capsule wardrobe is a small, carefully chosen collection of clothing where every single piece works with every other piece. The result is maximum outfit combinations from minimum items — and zero wasted money on things you never wear.</p>

<p>Here is how to build one that suits the Kenyan climate, culture and lifestyle.</p>

<h2>The Concept: Everything Works With Everything</h2>

<p>The rule of a capsule wardrobe is strict: if a new piece doesn''t work with at least three other items you already own, don''t buy it. Every item earns its place by being versatile. This eliminates impulse purchases, one-occasion outfits, and the "I have nothing to wear" problem despite a full wardrobe.</p>

<h2>Your Kenyan Capsule — The Core 12 Pieces</h2>

<ul>
<li><strong>2 suits:</strong> One navy, one charcoal grey — the workhorses of formal dressing</li>
<li><strong>3 dress shirts:</strong> White, light blue, and pale grey — pair with everything</li>
<li><strong>2 trousers:</strong> Black slim-fit and khaki chinos — dress up or down</li>
<li><strong>2 T-shirts:</strong> White and black, fitted — the base of casual outfits</li>
<li><strong>1 blazer:</strong> Navy, worn as separates with jeans or chinos</li>
<li><strong>2 pairs of shoes:</strong> Black Oxford and tan loafer — cover 90% of occasions</li>
</ul>

<p>These 12 items create over 30 distinct outfits. That''s a different look every day for a full month.</p>

<h2>Colour Discipline: The Three-Colour Rule</h2>

<p>Build your capsule around three neutral colours — for most Kenyan men this works well as <strong>navy, grey, and white/cream</strong>. Everything in your wardrobe should work within this palette. Accent colours — burgundy, green, tan — can appear in accessories like ties and pocket squares but shouldn''t dominate.</p>

<blockquote><p>"When everything matches everything, getting dressed stops being a problem and starts being a pleasure."</p></blockquote>

<h2>Quality Over Quantity — Always</h2>

<p>A capsule wardrobe only works with quality pieces. A cheap white shirt that yellows and loses its shape after ten washes destroys the system. Every piece needs to look good consistently. This is why we recommend investing in fewer, better items — even if it means building your capsule over several months.</p>

<h2>Starting Your Capsule Today</h2>

<p>If you''re starting from scratch, begin here:</p>

<ul>
<li>Month 1: One suit + two shirts + one pair of Oxford shoes</li>
<li>Month 2: One pair of chinos + one pair of loafers + one T-shirt</li>
<li>Month 3: Second suit + blazer + second T-shirt</li>
</ul>

<p>After three months, your capsule is functional. After six, it''s complete.</p>

<p>Everything you need to build your capsule wardrobe is available at Men''s World Kenya, Yala Towers, Shop 101. WhatsApp us on <strong>0716 057 611</strong> and we''ll help you plan your capsule within your budget.</p>',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80',
  'Style Guide',
  'Men''s World Kenya',
  TRUE,
  6
),

-- ── POST 8 ────────────────────────────────────────────
(
  'Dress Code Decoded: What to Wear to Every Kenyan Event',
  'dress-code-guide-kenyan-events',
  'Smart casual, cocktail, black tie, traditional — Kenyan events have their own dress code language. Here''s exactly what each one means.',
  '<p>You''ve been invited to a corporate gala and the dress code says "cocktail attire." Or a friend''s ruracio says "smart casual." Or the wedding invitation says "formal but not black tie." What does any of this actually mean in a Kenyan context?</p>

<p>Here is your complete guide to Kenyan event dress codes — no guessing required.</p>

<h2>Casual</h2>

<p>In Kenya, "casual" at an event never means what it means at home on a Sunday. Event casual still means you made an effort. Think dark jeans or chinos — no shorts — with a neat polo shirt or plain T-shirt tucked in, and clean sneakers or loafers. No flip flops, no torn jeans, no vests.</p>

<h2>Smart Casual</h2>

<p>This is the most common and most misunderstood dress code in Kenya. Smart casual means: <strong>you look put-together, but it''s not a suit occasion</strong>. Chinos or dark trousers, a button-down shirt (tucked or neatly untucked), and leather loafers or clean leather sneakers. You can add a blazer for extra polish — it''s always appreciated.</p>

<div class="tip"><p><strong>Simple test for smart casual:</strong> If you''d wear it to a shopping mall, it''s too casual. If you''d wear it to a board meeting, it might be too formal. Aim for the middle.</p></div>

<h2>Business / Office Attire</h2>

<p>A full suit is ideal. If not a full suit, then well-fitted trousers, a dress shirt, and a blazer or sports jacket. Leather shoes — Oxford or Derby. A tie is optional unless stated. This is the baseline for any professional event, conference, or formal workplace.</p>

<h2>Cocktail Attire</h2>

<p>Cocktail attire in Kenya means a well-fitted suit — navy or charcoal work best — with a dress shirt and optional tie. This is not the time for a casual blazer over jeans. Smart leather shoes, a pocket square, and clean grooming are expected. Think: you could walk into a boardroom or a wedding reception and look appropriate in either.</p>

<h2>Formal / Black Tie</h2>

<p>Rarely requested in Kenya but increasingly common at gala dinners and corporate awards. A dark suit — ideally black — with a white dress shirt and either a black tie or black bow tie. Black Oxford shoes, highly polished. If the invitation says "black tie optional" and you don''t own a tuxedo, a very sharp black suit is completely acceptable.</p>

<h2>Traditional / Cultural Events</h2>

<p>Ruracio, dowry ceremonies, and cultural celebrations vary by community. If your own cultural dress is available and appropriate, wear it with pride. If you''re attending another community''s event, a well-fitted suit in a warm colour — deep brown, navy, or dark green — is a universally respectful choice. When in doubt, ask the host family.</p>

<h2>Church</h2>

<p>Most Kenyan churches expect a suit or at minimum smart trousers and a collared shirt. Jeans are generally accepted in younger, more contemporary churches but read the room of your specific congregation. When visiting someone else''s church, always err toward more formal.</p>

<blockquote><p>"The dress code is not about restriction — it''s about showing your host that you took their event seriously enough to prepare."</p></blockquote>

<p>Whatever the occasion, Men''s World Kenya has you covered. Visit us at <strong>Yala Towers, Shop 101, Biashara Street, Nairobi</strong> or order via WhatsApp on <strong>0716 057 611</strong>. Nationwide delivery available.</p>',
  'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1200&q=80',
  'Style Guide',
  'Men''s World Kenya',
  TRUE,
  7
)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image,
  category = EXCLUDED.category,
  published = EXCLUDED.published,
  read_time = EXCLUDED.read_time,
  updated_at = NOW();

-- Confirm
SELECT id, title, category, read_time, published
FROM public.blog_posts
ORDER BY created_at DESC;
