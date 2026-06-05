import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, getCategories } from "../services/api";
import ProductCard from "../components/product/ProductCard";

const EMOJIS = {
  Produce: "🥬",
  Dairy: "🥛",
  Meat: "🥩",
  Bakery: "🍞",
  Beverages: "🧴",
  Snacks: "🍿",
  Frozen: "🧊",
  Cleaning: "🧹",
  "Fruits & Vegetables": "🍎",
  "Meat & Seafood": "🥩",
  "Canned Goods": "🥫",
  "Personal Care": "💊",
  Household: "🧹",
  "Frozen Foods": "🧊",
  Seafood: "🐟",
  Organic: "🌿",
};

const FEATURES = [
  {
    icon: "🚚",
    title: "Free Delivery",
    sub: "On orders over $50",
    color: "#dcfce7",
  },
  {
    icon: "🔒",
    title: "Secure Payment",
    sub: "100% safe & secure",
    color: "#dbeafe",
  },
  {
    icon: "🌿",
    title: "100% Organic",
    sub: "Certified products",
    color: "#fef9c3",
  },
  { icon: "↩️", title: "Easy Returns", sub: "30-day policy", color: "#fce7f3" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
    getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  // Only in-stock or low-stock products for homepage
  const featuredProducts = products
    .filter((p) => p.Current_Stock > 0)
    .slice(0, 10);
  const dealProducts = products.filter((p) => p.Current_Stock > 0).slice(0, 3);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .hm-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#fff7ed,#fef3c7);color:#d97706;border:1.5px solid #fcd34d;border-radius:99px;padding:5px 14px;font-size:12px;font-weight:700;letter-spacing:.3px;margin-bottom:20px}
        .hm-h1{font-family:'Plus Jakarta Sans',sans-serif;font-size:52px;font-weight:800;line-height:1.15;color:#111827;margin-bottom:16px}
        .hm-hero-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border-radius:13px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;text-decoration:none;transition:all .25s}
        .hm-hero-btn.primary{background:linear-gradient(135deg,#15803d,#22c55e);color:#fff;box-shadow:0 4px 16px rgba(21,128,61,.3)}
        .hm-hero-btn.primary:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(21,128,61,.4)}
        .hm-hero-btn.outline{background:#fff;color:#15803d;border:2px solid #86efac}
        .hm-hero-btn.outline:hover{background:#f0fdf4;transform:translateY(-3px)}
        .hm-feat{background:#fff;border-radius:16px;padding:20px;display:flex;align-items:center;gap:14px;box-shadow:0 2px 10px rgba(0,0,0,.05);border:1.5px solid #f3f4f6;transition:all .25s}
        .hm-feat:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.08)}
        .hm-section-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:32px;font-weight:800;color:#111827;margin-bottom:4px}
        .hm-section-title span{background:linear-gradient(135deg,#15803d,#16a34a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hm-cat-card{border-radius:16px;padding:22px 14px;text-align:center;display:flex;flex-direction:column;align-items:center;border:2px solid transparent;text-decoration:none;transition:all .25s;cursor:pointer}
        .hm-cat-card:hover{transform:translateY(-4px);box-shadow:0 10px 28px rgba(0,0,0,.1)}
        .hm-view-all{display:inline-flex;align-items:center;gap:6px;padding:9px 20px;border-radius:10px;background:#f0fdf4;color:#15803d;border:1.5px solid #bbf7d0;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;text-decoration:none;transition:all .2s}
        .hm-view-all:hover{background:#dcfce7;transform:translateY(-2px)}
        .hm-review-card{background:#fff;border-radius:18px;padding:24px;border:1.5px solid #f3f4f6;box-shadow:0 2px 10px rgba(0,0,0,.04);transition:all .25s}
        .hm-review-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.08)}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      `}</style>

      {/* ── HERO ── */}
      <section
        style={{
          background:
            "linear-gradient(135deg,#f0fdf4 0%,#ecfdf5 40%,#f0f9ff 100%)",
          padding: "72px 0 80px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg,rgba(21,128,61,.08),rgba(34,197,94,.06))",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 56,
              alignItems: "center",
            }}
          >
            <div>
              <div className="hm-badge">🌿 100% Organic &amp; Natural</div>
              <h1 className="hm-h1">
                Fresh &amp; Healthy
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg,#15803d,#22c55e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Organic Food
                </span>
                <br />
                Delivered to You
              </h1>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: 17,
                  lineHeight: 1.75,
                  marginBottom: 32,
                  maxWidth: 440,
                }}
              >
                Get the freshest produce, dairy, meat, and more — sourced
                directly from local Cambodian farms.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  marginBottom: 40,
                }}
              >
                <Link to="/shop" className="hm-hero-btn primary">
                  🛒 Shop Now
                </Link>
                <Link to="/about" className="hm-hero-btn outline">
                  Learn More
                </Link>
              </div>
              <div style={{ display: "flex", gap: 32 }}>
                {[
                  ["500+", "Products"],
                  ["10K+", "Customers"],
                  ["50+", "Brands"],
                ].map(([n, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: 26,
                        fontWeight: 800,
                        color: "#111827",
                      }}
                    >
                      {n}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#6b7280",
                        fontWeight: 500,
                      }}
                    >
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Hero product grid — real products */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 14,
              }}
            >
              {loading
                ? [...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#f0f0f0",
                        borderRadius: 16,
                        height: 110,
                        animation: "pulse 1.5s infinite",
                      }}
                    />
                  ))
                : products
                    .filter((p) => p.Current_Stock > 0)
                    .slice(0, 6)
                    .map((p) => (
                      <Link
                        to={`/shop/${p.Product_ID}`}
                        key={p.Product_ID}
                        style={{
                          background: "#fff",
                          borderRadius: 16,
                          padding: "18px 12px",
                          textAlign: "center",
                          boxShadow: "0 2px 12px rgba(0,0,0,.06)",
                          border: "1.5px solid #f3f4f6",
                          transition: "all .25s",
                          textDecoration: "none",
                          display: "block",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-6px)";
                          e.currentTarget.style.boxShadow =
                            "0 12px 32px rgba(21,128,61,.15)";
                          e.currentTarget.style.borderColor = "#86efac";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow =
                            "0 2px 12px rgba(0,0,0,.06)";
                          e.currentTarget.style.borderColor = "#f3f4f6";
                        }}
                      >
                        {p.Product_Image ? (
                          <img
                            src={p.Product_Image}
                            alt={p.Name}
                            style={{
                              width: 44,
                              height: 44,
                              objectFit: "cover",
                              borderRadius: 8,
                              margin: "0 auto 8px",
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: 44, marginBottom: 8 }}>
                            {EMOJIS[p.Category_Name] || "📦"}
                          </div>
                        )}
                        <p
                          style={{
                            fontSize: 12,
                            color: "#6b7280",
                            fontWeight: 600,
                            marginBottom: 4,
                          }}
                        >
                          {p.Name.length > 16
                            ? p.Name.slice(0, 14) + "…"
                            : p.Name}
                        </p>
                        <strong style={{ fontSize: 14, color: "#16a34a" }}>
                          ${Number(p.Unit_Price).toFixed(2)}
                        </strong>
                      </Link>
                    ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        style={{
          background: "#fff",
          padding: "28px 0",
          borderTop: "1px solid #f3f4f6",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 16,
            }}
          >
            {FEATURES.map((f) => (
              <div key={f.title} className="hm-feat">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: f.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: 3,
                    }}
                  >
                    {f.title}
                  </h4>
                  <p style={{ fontSize: 12, color: "#6b7280" }}>{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES — auto-scrolling marquee ── */}
      <section style={{ padding:'64px 0', background:'#f8f9fc', overflow:'hidden' }}>
        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .cat-marquee-track {
            display: flex;
            gap: 16px;
            animation: marquee 28s linear infinite;
            width: max-content;
          }
          .cat-marquee-track:hover { animation-play-state: paused; }
          .cat-card {
            flex-shrink: 0;
            width: 180px;
            border-radius: 16px;
            overflow: hidden;
            text-decoration: none;
            position: relative;
            box-shadow: 0 2px 12px rgba(13,27,62,0.10);
            transition: transform .25s, box-shadow .25s;
            display: block;
          }
          .cat-card:hover {
            transform: translateY(-5px) scale(1.03);
            box-shadow: 0 10px 32px rgba(13,27,62,0.18);
          }
          .cat-card img {
            width: 100%;
            height: 130px;
            object-fit: cover;
            display: block;
          }
          .cat-card-label {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            background: linear-gradient(0deg, rgba(13,18,64,0.88) 0%, transparent 100%);
            padding: 28px 12px 12px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 13px;
            font-weight: 700;
            color: #fff;
            letter-spacing: 0.2px;
          }
          .cat-card-count {
            font-size: 10px;
            font-weight: 500;
            color: rgba(255,255,255,0.65);
            margin-top: 2px;
          }
        `}</style>

        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px', marginBottom:36 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
            <div>
              <p style={{ color:'#c0272d', fontWeight:700, fontSize:13, textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>
                What we offer
              </p>
              <h2 className="hm-section-title">
                Popular <span>Categories</span>
              </h2>
            </div>
            <Link to="/shop" className="hm-view-all">View All</Link>
          </div>
        </div>

        {/* Marquee */}
        <div style={{ overflow:'hidden', position:'relative' }}>
          {/* Left fade */}
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:80, background:'linear-gradient(90deg,#f8f9fc,transparent)', zIndex:2, pointerEvents:'none' }} />
          {/* Right fade */}
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:80, background:'linear-gradient(270deg,#f8f9fc,transparent)', zIndex:2, pointerEvents:'none' }} />

          <div style={{ padding:'8px 0 16px' }}>
            <div className="cat-marquee-track">
              {/* Render twice for seamless loop */}
              {[...categories, ...categories].map((c, i) => {
                const CAT_IMAGES = {
                  'Fresh Fruits':         'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80',
                  'Fresh Vegetables':     'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80',
                  'Meat & Seafood':       'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80',
                  'Dairy & Eggs':         'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80',
                  'Rice & Grains':        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
                  'Instant Noodles':      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
                  'Cooking Oil':          'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
                  'Sauces & Condiments':  'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=80',
                  'Snacks & Biscuits':    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80',
                  'Beverages':            'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
                  'Frozen Foods':         'https://images.unsplash.com/photo-1616684000067-36952fde56ec?w=400&q=80',
                  'Canned Goods':         'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80',
                  'Bakery':               'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
                  'Personal Care':        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80',
                  'Household':            'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80',
                  'Baby & Kids':          'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
                }
                const fallback = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'
                const img = CAT_IMAGES[c.Category_Name] || fallback
                const count = products.filter(p => p.Category_Name === c.Category_Name).length
                return (
                  <Link
                    key={`${c.Category_ID}-${i}`}
                    to={`/shop?cat=${encodeURIComponent(c.Category_Name)}`}
                    className="cat-card"
                  >
                    <img src={img} alt={c.Category_Name} loading="lazy"
                      onError={e => { e.target.src = fallback }} />
                    <div className="cat-card-label">
                      <div>{c.Category_Name}</div>
                      <div className="cat-card-count">{count} products</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR PRODUCTS ── */}
      <section style={{ padding:'64px 0', background:'#fff' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:36 }}>
            <div>
              <p style={{ color:'#c0272d', fontWeight:700, fontSize:13, textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>Fresh Picks</p>
              <h2 className="hm-section-title">Popular <span>Products</span></h2>
            </div>
            <Link to="/shop" className="hm-view-all">View All</Link>
          </div>
          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:20 }}>
              {[...Array(5)].map((_,i) => (
                <div key={i} style={{ height:280, borderRadius:16, background:'#f3f4f6', animation:'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.slice(0,10).map(p => (
                <ProductCard key={p.Product_ID} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section style={{ padding:'64px 0', background:'linear-gradient(135deg,#0d1240 0%,#1a1f5e 100%)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p style={{ color:'#c0272d', fontWeight:700, fontSize:13, textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Why AMS Mart</p>
            <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:32, fontWeight:800, color:'#fff', lineHeight:1.2 }}>
              Your Trusted <span style={{ color:'#c0272d' }}>Supermarket</span>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
            {[
              [<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, 'Quality Guaranteed', 'All products are carefully selected and quality checked before reaching your hands.'],
              [<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, 'Open Every Day', 'We are open 7 days a week from 7:00 AM to 10:00 PM for your convenience.'],
              [<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, 'Loyalty Rewards', 'Earn points on every purchase and redeem them for exclusive discounts.'],
              [<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, 'Easy Payment', 'Pay with ABA, ACLEDA or Cash — fast, safe and hassle-free checkout.'],
            ].map(([icon, title, desc], i) => (
              <div key={i} style={{ background:'rgba(255,255,255,.06)', borderRadius:16, padding:28, border:'1px solid rgba(255,255,255,.1)', textAlign:'center', transition:'all .25s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.06)'}>
                <div style={{ width:60, height:60, borderRadius:16, background:'rgba(192,39,45,.15)', border:'1.5px solid rgba(192,39,45,.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>
                  {icon}
                </div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:16, fontWeight:800, color:'#fff', marginBottom:10 }}>{title}</div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, color:'rgba(255,255,255,.55)', lineHeight:1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:'64px 0', background:'#f8f9fc' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ background:'linear-gradient(135deg,#1a1f5e 0%,#0d1240 100%)', borderRadius:24, padding:'52px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:28 }}>
            <div>
              <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:30, fontWeight:800, color:'#fff', marginBottom:10, lineHeight:1.2 }}>
                Ready to Start Shopping?
              </h2>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, color:'rgba(255,255,255,.6)', maxWidth:480 }}>
                Browse hundreds of fresh products across all categories. Quality guaranteed on every order.
              </p>
            </div>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              <Link to="/shop" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 28px', borderRadius:12, background:'linear-gradient(135deg,#c0272d,#e53935)', color:'#fff', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:700, textDecoration:'none', boxShadow:'0 4px 16px rgba(192,39,45,.4)', transition:'all .25s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                Shop Now
              </Link>
              <Link to="/register" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 28px', borderRadius:12, background:'rgba(255,255,255,.1)', color:'#fff', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:700, textDecoration:'none', border:'1.5px solid rgba(255,255,255,.2)', transition:'all .25s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.18)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'}>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
