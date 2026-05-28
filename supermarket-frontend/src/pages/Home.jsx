import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api";
import ProductCard from "../components/product/ProductCard";

const MOCK = [
  {
    Product_ID: 1,
    Name: "Organic Tomatoes",
    Category_Name: "Produce",
    Unit_Price: 2.49,
    Unit: "1kg",
    Brand: "Green Valley",
    Current_Stock: 85,
  },
  {
    Product_ID: 2,
    Name: "Fresh Whole Milk",
    Category_Name: "Dairy",
    Unit_Price: 1.89,
    Unit: "1L",
    Brand: "Sunrise Dairy",
    Current_Stock: 12,
  },
  {
    Product_ID: 3,
    Name: "Sourdough Loaf",
    Category_Name: "Bakery",
    Unit_Price: 4.5,
    old_price: 5.0,
    Unit: "500g",
    Brand: "Artisan Bakers",
    Current_Stock: 28,
  },
  {
    Product_ID: 4,
    Name: "Free Range Chicken",
    Category_Name: "Meat",
    Unit_Price: 8.99,
    old_price: 10.5,
    Unit: "1kg",
    Brand: "Premium Meats",
    Current_Stock: 5,
  },
  {
    Product_ID: 5,
    Name: "Orange Juice",
    Category_Name: "Beverages",
    Unit_Price: 3.29,
    Unit: "1.5L",
    Brand: "Citrus Grove",
    Current_Stock: 60,
  },
  {
    Product_ID: 6,
    Name: "Frozen Pizza",
    Category_Name: "Frozen",
    Unit_Price: 5.99,
    old_price: 7.5,
    Unit: "350g",
    Brand: "FrozenBest",
    Current_Stock: 44,
  },
  {
    Product_ID: 7,
    Name: "Potato Chips",
    Category_Name: "Snacks",
    Unit_Price: 2.19,
    Unit: "200g",
    Brand: "CrunchCo",
    Current_Stock: 110,
  },
  {
    Product_ID: 8,
    Name: "Free Range Eggs",
    Category_Name: "Dairy",
    Unit_Price: 3.99,
    old_price: 4.5,
    Unit: "x12",
    Brand: "Happy Hen",
    Current_Stock: 8,
  },
  {
    Product_ID: 9,
    Name: "Broccoli Florets",
    Category_Name: "Produce",
    Unit_Price: 1.79,
    Unit: "500g",
    Brand: "Green Valley",
    Current_Stock: 55,
  },
  {
    Product_ID: 10,
    Name: "Greek Yoghurt",
    Category_Name: "Dairy",
    Unit_Price: 2.79,
    old_price: 3.5,
    Unit: "400g",
    Brand: "Sunrise",
    Current_Stock: 40,
  },
];

const CATS = [
  {
    name: "Produce",
    emoji: "🥬",
    count: 24,
    color: "#dcfce7",
    border: "#86efac",
    text: "#15803d",
  },
  {
    name: "Dairy",
    emoji: "🥛",
    count: 12,
    color: "#dbeafe",
    border: "#93c5fd",
    text: "#1d4ed8",
  },
  {
    name: "Meat",
    emoji: "🥩",
    count: 8,
    color: "#fee2e2",
    border: "#fca5a5",
    text: "#dc2626",
  },
  {
    name: "Bakery",
    emoji: "🍞",
    count: 10,
    color: "#fef3c7",
    border: "#fcd34d",
    text: "#d97706",
  },
  {
    name: "Beverages",
    emoji: "🧃",
    count: 15,
    color: "#e0e7ff",
    border: "#a5b4fc",
    text: "#4338ca",
  },
  {
    name: "Snacks",
    emoji: "🍿",
    count: 20,
    color: "#fce7f3",
    border: "#f9a8d4",
    text: "#be185d",
  },
  {
    name: "Frozen",
    emoji: "🧊",
    count: 9,
    color: "#cffafe",
    border: "#67e8f9",
    text: "#0e7490",
  },
  {
    name: "Seafood",
    emoji: "🐟",
    count: 7,
    color: "#d1fae5",
    border: "#6ee7b7",
    text: "#065f46",
  },
  {
    name: "Fruits",
    emoji: "🍎",
    count: 18,
    color: "#ffedd5",
    border: "#fdba74",
    text: "#ea580c",
  },
  {
    name: "Organic",
    emoji: "🌿",
    count: 30,
    color: "#f0fdf4",
    border: "#86efac",
    text: "#16a34a",
  },
  {
    name: "Cleaning",
    emoji: "🧹",
    count: 6,
    color: "#f5f3ff",
    border: "#c4b5fd",
    text: "#7c3aed",
  },
  {
    name: "Herbs",
    emoji: "🌱",
    count: 11,
    color: "#ecfdf5",
    border: "#6ee7b7",
    text: "#059669",
  },
];

const FEATURES = [
  {
    icon: "🚚",
    title: "Free Delivery",
    sub: "On orders over $50",
    color: "#dcfce7",
    ic: "#16a34a",
  },
  {
    icon: "🔒",
    title: "Secure Payment",
    sub: "100% safe & secure",
    color: "#dbeafe",
    ic: "#2563eb",
  },
  {
    icon: "🌿",
    title: "100% Organic",
    sub: "Certified products",
    color: "#fef9c3",
    ic: "#ca8a04",
  },
  {
    icon: "↩️",
    title: "Easy Returns",
    sub: "30-day policy",
    color: "#fce7f3",
    ic: "#db2777",
  },
];

export default function Home() {
  const [products, setProducts] = useState(MOCK);

  useEffect(() => {
    getProducts({ limit: 10 })
      .then((res) => {
        if (res.data?.length) setProducts(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .hm-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#fff7ed,#fef3c7);color:#d97706;border:1.5px solid #fcd34d;border-radius:99px;padding:5px 14px;font-size:12px;font-weight:700;letter-spacing:.3px;margin-bottom:20px}
        .hm-h1{font-family:'Plus Jakarta Sans',sans-serif;font-size:52px;font-weight:800;line-height:1.15;color:#111827;margin-bottom:16px}
        .hm-hero-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border-radius:13px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;text-decoration:none;transition:all .25s}
        .hm-hero-btn.primary{background:linear-gradient(135deg,#15803d,#22c55e);color:#fff;box-shadow:0 4px 16px rgba(21,128,61,.3)}
        .hm-hero-btn.primary:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(21,128,61,.4)}
        .hm-hero-btn.outline{background:#fff;color:#15803d;border:2px solid #86efac}
        .hm-hero-btn.outline:hover{background:#f0fdf4;transform:translateY(-3px)}
        .hm-fruit-card{background:#fff;border-radius:16px;padding:20px 14px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.06);border:1.5px solid #f3f4f6;transition:all .25s;cursor:default}
        .hm-fruit-card:hover{transform:translateY(-6px);box-shadow:0 12px 32px rgba(21,128,61,.15);border-color:#86efac}
        .hm-feat{background:#fff;border-radius:16px;padding:20px;display:flex;align-items:center;gap:14px;box-shadow:0 2px 10px rgba(0,0,0,.05);border:1.5px solid #f3f4f6;transition:all .25s}
        .hm-feat:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.08)}
        .hm-section-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:32px;font-weight:800;color:#111827;margin-bottom:4px}
        .hm-section-title span{background:linear-gradient(135deg,#15803d,#16a34a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hm-cat-card{border-radius:16px;padding:22px 14px;text-align:center;display:flex;flex-direction:column;align-items:center;border:2px solid transparent;text-decoration:none;transition:all .25s;cursor:pointer}
        .hm-cat-card:hover{transform:translateY(-4px);box-shadow:0 10px 28px rgba(0,0,0,.1)}
        .hm-view-all{display:inline-flex;align-items:center;gap:6px;padding:9px 20px;border-radius:10px;background:#f0fdf4;color:#15803d;border:1.5px solid #bbf7d0;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;text-decoration:none;transition:all .2s}
        .hm-view-all:hover{background:#dcfce7;transform:translateY(-2px)}
        .hm-deal-tag{background:linear-gradient(135deg,#ef4444,#f97316);color:#fff;font-size:10px;font-weight:800;padding:3px 10px;border-radius:99px;display:inline-block;margin-bottom:8px;letter-spacing:.5px;text-transform:uppercase}
        .hm-review-card{background:#fff;border-radius:18px;padding:24px;border:1.5px solid #f3f4f6;box-shadow:0 2px 10px rgba(0,0,0,.04);transition:all .25s}
        .hm-review-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.08)}
        .hm-stat{text-align:center;padding:0 20px}
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
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg,rgba(99,102,241,.06),rgba(168,85,247,.05))",
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
                directly from local Cambodian farms, delivered to your door.
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
                  <div key={l} className="hm-stat" style={{ padding: 0 }}>
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 14,
              }}
            >
              {[
                { e: "🍅", n: "Tomatoes", p: "$2.49/kg" },
                { e: "🥦", n: "Broccoli", p: "$1.79/kg" },
                { e: "🍎", n: "Apples", p: "$3.99/kg" },
                { e: "🥕", n: "Carrots", p: "$1.29/kg" },
                { e: "🍊", n: "Oranges", p: "$2.99/kg" },
                { e: "🥑", n: "Avocado", p: "$4.49/ea" },
              ].map((f) => (
                <div key={f.n} className="hm-fruit-card">
                  <div style={{ fontSize: 48, marginBottom: 10 }}>{f.e}</div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {f.n}
                  </p>
                  <strong style={{ fontSize: 14, color: "#16a34a" }}>
                    {f.p}
                  </strong>
                </div>
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

      {/* ── CATEGORIES ── */}
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
            {CATS.map((c) => (
              <Link
                to={`/shop?cat=${c.name}`}
                key={c.name}
                className="hm-cat-card"
                style={{ background: c.color, borderColor: c.border }}
              >
                <div style={{ fontSize: 38, marginBottom: 10 }}>{c.emoji}</div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: c.text,
                    marginBottom: 3,
                  }}
                >
                  {c.name}
                </p>
                <small style={{ fontSize: 11, color: c.text + "99" }}>
                  {c.count} items
                </small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 20,
            }}
          >
            {products.slice(0, 10).map((p) => (
              <ProductCard key={p.Product_ID} product={p} />
            ))}
          </div>
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
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(99,102,241,.1)",
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
                Fresh deals on your favourite organic groceries. Save big this
                month!
              </p>
              <div style={{ display: "flex", gap: 20, marginBottom: 32 }}>
                {[
                  ["24", "Hours"],
                  ["18", "Minutes"],
                  ["45", "Seconds"],
                ].map(([n, l]) => (
                  <div
                    key={l}
                    style={{
                      textAlign: "center",
                      background: "rgba(255,255,255,.08)",
                      borderRadius: 12,
                      padding: "14px 18px",
                      border: "1px solid rgba(255,255,255,.12)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        fontSize: 28,
                        fontWeight: 800,
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {n}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#64748b",
                        marginTop: 4,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {l}
                    </div>
                  </div>
                ))}
              </div>
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
              {products
                .filter((p) => p.old_price)
                .slice(0, 3)
                .map((p, i) => (
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
                      e.currentTarget.style.background =
                        "rgba(255,255,255,.07)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,.08)";
                    }}
                  >
                    <div className="hm-deal-tag">
                      -{Math.round((1 - p.Unit_Price / p.old_price) * 100)}% OFF
                    </div>
                    <div style={{ fontSize: 44, marginBottom: 10 }}>🥬</div>
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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <strong style={{ color: "#22c55e", fontSize: 16 }}>
                        ${Number(p.Unit_Price).toFixed(2)}
                      </strong>
                      <s style={{ color: "#64748b", fontSize: 12 }}>
                        ${Number(p.old_price).toFixed(2)}
                      </s>
                    </div>
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
                name: "Lyveng C.",
                role: "Student, AITC",
                text: "FreshMart has the freshest produce in Phnom Penh. The loyalty points are a great bonus and the delivery is super fast!",
                stars: 5,
                color: "#dcfce7",
                border: "#86efac",
              },
              {
                name: "Limchheang K.",
                role: "Software Engineer",
                text: "Orders tracked perfectly and delivery always on time. The admin system is also very impressive!",
                stars: 5,
                color: "#dbeafe",
                border: "#93c5fd",
              },
              {
                name: "Hengveasna H.",
                role: "Data Analyst",
                text: "Love the category filters and real stock availability. The UX is clean and modern — great tech!",
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
