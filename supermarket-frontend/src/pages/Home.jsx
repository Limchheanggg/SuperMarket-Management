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

      {/* ── CATEGORIES — real from DB ── */}
      <section style={{ padding: "64px 0", background: "#fafafa" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 36,
            }}
          >
            <div>
              <p
                style={{
                  color: "#16a34a",
                  fontWeight: 700,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                What we offer
              </p>
              <h2 className="hm-section-title">
                Popular <span>Categories</span>
              </h2>
            </div>
            <Link to="/shop" className="hm-view-all">
              View All →
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6,1fr)",
              gap: 14,
            }}
          >
            {categories.slice(0, 12).map((c, i) => {
              const colors = [
                { color: "#dcfce7", border: "#86efac", text: "#15803d" },
                { color: "#dbeafe", border: "#93c5fd", text: "#1d4ed8" },
                { color: "#fee2e2", border: "#fca5a5", text: "#dc2626" },
                { color: "#fef3c7", border: "#fcd34d", text: "#d97706" },
                { color: "#e0e7ff", border: "#a5b4fc", text: "#4338ca" },
                { color: "#fce7f3", border: "#f9a8d4", text: "#be185d" },
                { color: "#cffafe", border: "#67e8f9", text: "#0e7490" },
                { color: "#d1fae5", border: "#6ee7b7", text: "#065f46" },
                { color: "#ffedd5", border: "#fdba74", text: "#ea580c" },
                { color: "#f0fdf4", border: "#86efac", text: "#16a34a" },
                { color: "#f5f3ff", border: "#c4b5fd", text: "#7c3aed" },
                { color: "#ecfdf5", border: "#6ee7b7", text: "#059669" },
              ];
              const col = colors[i % colors.length];
              const count = products.filter(
                (p) => p.Category_Name === c.Category_Name,
              ).length;
              return (
                <Link
                  to={`/shop?cat=${encodeURIComponent(c.Category_Name)}`}
                  key={c.Category_ID}
                  className="hm-cat-card"
                  style={{ background: col.color, borderColor: col.border }}
                >
                  <div style={{ fontSize: 38, marginBottom: 10 }}>
                    {EMOJIS[c.Category_Name] || "📦"}
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: col.text,
                      marginBottom: 3,
                    }}
                  >
                    {c.Category_Name}
                  </p>
                  <small style={{ fontSize: 11, color: col.text + "99" }}>
                    {count} items
                  </small>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── POPULAR PRODUCTS — real from DB ── */}
      <section style={{ padding: "64px 0", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 36,
            }}
          >
            <div>
              <p
                style={{
                  color: "#16a34a",
                  fontWeight: 700,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                Best sellers
              </p>
              <h2 className="hm-section-title">
                Popular <span>Products</span>
              </h2>
            </div>
            <Link to="/shop" className="hm-view-all">
              View All →
            </Link>
          </div>
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5,1fr)",
                gap: 20,
              }}
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f0f0f0",
                    borderRadius: 16,
                    height: 280,
                    animation: "pulse 1.5s infinite",
                  }}
                />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <p>
                No products in stock yet.{" "}
                <Link
                  to="/admin/inventory"
                  style={{ color: "#16a34a", fontWeight: 700 }}
                >
                  Add products →
                </Link>
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5,1fr)",
                gap: 20,
              }}
            >
              {featuredProducts.map((p) => (
                <ProductCard key={p.Product_ID} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section
        style={{
          padding: "64px 0",
          background:
            "linear-gradient(135deg,#0f172a 0%,#1e3a2f 50%,#14532d 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(21,128,61,.15)",
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
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(239,68,68,.15)",
                  border: "1px solid rgba(239,68,68,.3)",
                  borderRadius: 99,
                  padding: "5px 14px",
                  color: "#f87171",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  marginBottom: 18,
                  textTransform: "uppercase",
                }}
              >
                ⚡ Limited Time Offer
              </div>
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.2,
                  marginBottom: 14,
                }}
              >
                Sale of the{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg,#22c55e,#86efac)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Month
                </span>
              </h2>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: 16,
                  lineHeight: 1.7,
                  marginBottom: 28,
                }}
              >
                Fresh deals on your favourite organic groceries!
              </p>
              <Link to="/shop" className="hm-hero-btn primary">
                Shop Deals Now
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 14,
              }}
            >
              {dealProducts.map((p) => (
                <Link
                  to={`/shop/${p.Product_ID}`}
                  key={p.Product_ID}
                  style={{
                    background: "rgba(255,255,255,.07)",
                    borderRadius: 16,
                    padding: "20px 14px",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,.08)",
                    transition: "all .2s",
                    display: "block",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(21,128,61,.2)";
                    e.currentTarget.style.borderColor = "#22c55e";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,.07)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,.08)";
                  }}
                >
                  {p.Product_Image ? (
                    <img
                      src={p.Product_Image}
                      alt={p.Name}
                      style={{
                        width: 52,
                        height: 52,
                        objectFit: "cover",
                        borderRadius: 8,
                        margin: "0 auto 10px",
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: 44, marginBottom: 10 }}>
                      {EMOJIS[p.Category_Name] || "📦"}
                    </div>
                  )}
                  <p
                    style={{
                      fontSize: 13,
                      color: "#e2e8f0",
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    {p.Name}
                  </p>
                  <strong style={{ color: "#22c55e", fontSize: 16 }}>
                    ${Number(p.Unit_Price).toFixed(2)}
                  </strong>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "64px 0", background: "#fafafa" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#16a34a",
              fontWeight: 700,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Customer love
          </p>
          <h2 className="hm-section-title" style={{ marginBottom: 8 }}>
            What Our <span>Customers Say</span>
          </h2>
          <p style={{ color: "#6b7280", fontSize: 15, marginBottom: 40 }}>
            Real feedback from happy shoppers across Phnom Penh
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 20,
            }}
          >
            {[
              {
                name: "Sarakseyha NY",
                role: "Student",
                text: "The UI is so clean that even my sleepy 2AM brain could use it without getting lost. That says a lot honestly.",
                stars: 5,
                color: "#dcfce7",
                border: "#86efac",
              },
              {
                name: "Putdararith KIM",
                role: "Student",
                text: "I opened the website just to test it, then spent 20 minutes pretending I was actually grocery shopping. Lowkey better than some real supermarket apps.",
                stars: 5,
                color: "#dbeafe",
                border: "#93c5fd",
              },
              {
                name: "Chhaythean LY",
                role: "Senior",
                text: "Your project shows strong frontend and system design skills. The UI is clean, responsive, and the supermarket workflow is implemented very well for a student project.",
                stars: 4,
                color: "#fce7f3",
                border: "#f9a8d4",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="hm-review-card"
                style={{
                  textAlign: "left",
                  borderColor: t.border,
                  background: t.color + "40",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{ color: "#f59e0b", fontSize: 16, letterSpacing: 2 }}
                  >
                    {"★".repeat(t.stars)}
                    {"☆".repeat(5 - t.stars)}
                  </div>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#15803d,#22c55e)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 14,
                    }}
                  >
                    {t.name[0]}
                  </div>
                </div>
                <p
                  style={{
                    color: "#374151",
                    fontSize: 14,
                    lineHeight: 1.75,
                    marginBottom: 16,
                    fontStyle: "italic",
                  }}
                >
                  "{t.text}"
                </p>
                <div>
                  <strong
                    style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: 14,
                      color: "#111827",
                    }}
                  >
                    {t.name}
                  </strong>
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section
        style={{
          padding: "56px 0",
          background: "linear-gradient(135deg,#ecfdf5,#f0fdf4)",
        }}
      >
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 14 }}>📧</div>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 28,
              fontWeight: 800,
              color: "#111827",
              marginBottom: 10,
            }}
          >
            Stay in the Loop
          </h2>
          <p style={{ color: "#6b7280", fontSize: 15, marginBottom: 28 }}>
            Get weekly deals, new arrivals, and organic tips straight to your
            inbox.
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              maxWidth: 440,
              margin: "0 auto",
            }}
          >
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                flex: 1,
                padding: "12px 18px",
                border: "2px solid #bbf7d0",
                borderRadius: 12,
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 14,
                outline: "none",
                background: "#fff",
              }}
            />
            <button
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg,#15803d,#22c55e)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
