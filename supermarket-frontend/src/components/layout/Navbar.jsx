import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { getCategories } from "../../services/api";

export default function Navbar() {
  const { totalItems, totalQty } = useCart();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [focused, setFocused] = useState(false);
  const [categories, setCategories] = useState([]);

  // Emoji map for known category names
  const EMOJI_MAP = {
    Produce: "🥬",
    Dairy: "🥛",
    Meat: "🥩",
    Bakery: "🍞",
    Beverages: "🧃",
    Snacks: "🍿",
    Frozen: "🧊",
    "Frozen Foods": "🧊",
    FrozenFoods: "🧊",
    Seafood: "🐟",
    Organic: "🌿",
    Cleaning: "🧹",
    Household: "🏠",
    "Personal Care": "💊",
    "Canned Goods": "🥫",
    "Fruits & Vegetables": "🍎",
    "Meat & Seafood": "🥩",
    Fruits: "🍎",
    Vegetables: "🥦",
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    // Fetch real categories from DB
    getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim())
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .nb-link{font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;color:#374151;text-decoration:none;padding:7px 13px;border-radius:8px;transition:all .2s}
        .nb-link:hover,.nb-link.active{color:#15803d;background:#f0fdf4}
        .nb-search{display:flex;align-items:center;flex:1;max-width:500px;background:#f3f4f6;border:2px solid #e5e7eb;border-radius:14px;overflow:hidden;transition:all .25s}
        .nb-search.on{border-color:#16a34a;background:#fff;box-shadow:0 0 0 4px rgba(22,163,74,.1)}
        .nb-search input{flex:1;border:none;background:transparent;padding:11px 14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:#111;outline:none}
        .nb-search input::placeholder{color:#9ca3af}
        .nb-search button{background:linear-gradient(135deg,#15803d,#22c55e);color:#fff;border:none;padding:11px 22px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap}
        .nb-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:18px;transition:transform .2s;position:relative;border:1.5px solid transparent}
        .nb-icon:hover{transform:translateY(-2px)}
        .nb-badge{position:absolute;top:-7px;right:-7px;min-width:18px;height:18px;padding:0 4px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-size:10px;font-weight:800;border-radius:99px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;font-family:'Plus Jakarta Sans',sans-serif}
        .nb-loginbtn{padding:9px 22px;border-radius:12px;background:linear-gradient(135deg,#15803d,#22c55e);color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;text-decoration:none;transition:all .2s;box-shadow:0 2px 8px rgba(21,128,61,.25)}
        .nb-loginbtn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(21,128,61,.35)}
        .nb-acct{display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:12px;background:#f0fdf4;border:1.5px solid #bbf7d0;text-decoration:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;color:#15803d;transition:all .2s}
        .nb-acct:hover{background:#dcfce7;transform:translateY(-1px)}
        .nb-admin{padding:8px 14px;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#8b5cf6);color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;text-decoration:none;transition:all .2s}
        .nb-admin:hover{opacity:.9;transform:translateY(-1px)}
        .nb-cat{font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,.85);text-decoration:none;padding:10px 14px;border-radius:7px;transition:background .2s;white-space:nowrap;display:flex;align-items:center;gap:5px}
        .nb-cat:hover{background:rgba(255,255,255,.15);color:#fff}
        .nb-catbar{overflow-x:auto;scrollbar-width:none}
        .nb-catbar::-webkit-scrollbar{display:none}
      `}</style>

      {/* TOP BAR */}
      <div
        style={{
          background: "linear-gradient(90deg,#14532d,#15803d,#14532d)",
          padding: "7px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,.75)",
            }}
          >
            📍 Phnom Penh, Cambodia &nbsp;|&nbsp; +855 12 345 678
          </span>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {user ? (
              <>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: 12,
                    color: "#86efac",
                  }}
                >
                  👋 {user.name?.split(" ")[0] || user.email}
                </span>
                <button
                  onClick={logoutUser}
                  style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: 12,
                    color: "rgba(255,255,255,.65)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: 12,
                    color: "rgba(255,255,255,.8)",
                    textDecoration: "none",
                  }}
                >
                  Sign In
                </Link>
                <span style={{ color: "rgba(255,255,255,.3)" }}>|</span>
                <Link
                  to="/register"
                  style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: 12,
                    color: "rgba(255,255,255,.8)",
                    textDecoration: "none",
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(255,255,255,.97)" : "#fff",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,.07)" : "none",
          transition: "all .3s",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: 70,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 13,
                background: "linear-gradient(135deg,#15803d,#22c55e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                boxShadow: "0 4px 12px rgba(21,128,61,.3)",
              }}
            >
              🌿
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  color: "#111",
                  lineHeight: 1.1,
                }}
              >
                Fresh<span style={{ color: "#16a34a" }}>Mart</span>
              </div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 9,
                  color: "#6b7280",
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                Organic Store
              </div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 480 }}>
            <div className={`nb-search${focused ? " on" : ""}`}>
              <span
                style={{
                  padding: "0 4px 0 14px",
                  fontSize: 16,
                  color: "#9ca3af",
                }}
              >
                🔍
              </span>
              <input
                placeholder="Search organic products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
              <button type="submit">Search</button>
            </div>
          </form>

          {/* Nav Links */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexShrink: 0,
            }}
          >
            {[
              ["/", "Home"],
              ["/shop", "Shop"],
              ["/about", "About"],
              ["/contact", "Contact"],
              ["/faq", "FAQ"],
            ].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className={`nb-link${location.pathname === to ? " active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <Link
              to="/wishlist"
              className="nb-icon"
              style={{
                background: "linear-gradient(135deg,#fce7f3,#fbcfe8)",
                borderColor: "#f9a8d4",
              }}
            >
              ❤️
            </Link>
            <Link
              to="/cart"
              className="nb-icon"
              style={{
                background: "linear-gradient(135deg,#fef9c3,#fef08a)",
                borderColor: "#fde047",
              }}
            >
              🛒
              {totalItems > 0 && <span className="nb-badge">{totalItems}</span>}
            </Link>
            {user ? (
              <div style={{ display: "flex", gap: 7 }}>
                <Link to="/dashboard" className="nb-acct">
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      background: "linear-gradient(135deg,#16a34a,#22c55e)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                  {user.name?.split(" ")[0] || "Account"}
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="nb-admin">
                    ⚙️ Admin
                  </Link>
                )}
              </div>
            ) : (
              <Link to="/login" className="nb-loginbtn">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* CATEGORY BAR — dynamically loaded from DB */}
        <div
          style={{
            background: "linear-gradient(90deg,#14532d,#166534,#15803d)",
          }}
        >
          <div
            className="nb-catbar"
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {categories.length > 0
              ? categories.map((cat) => (
                  <Link
                    key={cat.Category_ID}
                    to={`/shop?cat=${encodeURIComponent(cat.Category_Name)}`}
                    className="nb-cat"
                  >
                    {EMOJI_MAP[cat.Category_Name] || "📦"} {cat.Category_Name}
                  </Link>
                ))
              : /* fallback while loading */ [
                  "Produce",
                  "Dairy",
                  "Meat",
                  "Bakery",
                  "Beverages",
                  "Snacks",
                ].map((c) => (
                  <Link key={c} to={`/shop?cat=${c}`} className="nb-cat">
                    {EMOJI_MAP[c] || "📦"} {c}
                  </Link>
                ))}
            <div
              style={{
                marginLeft: "auto",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 12,
                color: "rgba(255,255,255,.7)",
                padding: "10px 0",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              🚚 Free shipping over $50
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
