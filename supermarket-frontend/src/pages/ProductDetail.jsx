import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct } from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";

const EMOJIS = {
  Produce: "🥬",
  Dairy: "🥛",
  Meat: "🥩",
  Bakery: "🍞",
  Beverages: "🧴",
  Snacks: "🍿",
  Frozen: "🧊",
  "Fruits & Vegetables": "🍎",
  "Meat & Seafood": "🥩",
  "Canned Goods": "🥫",
  "Personal Care": "💊",
  Household: "🧹",
  "Frozen Foods": "🧊",
  Seafood: "🐟",
  Organic: "🌿",
};

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");

  useEffect(() => {
    setLoading(true);
    setQty(1);
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
          <p style={{ color: "#6b7280" }}>Loading product…</p>
        </div>
      </div>
    );

  if (!product)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 20px",
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
        <h2>Product not found</h2>
        <Link
          to="/shop"
          className="btn btn-primary"
          style={{ marginTop: 20, display: "inline-flex" }}
        >
          ← Back to Shop
        </Link>
      </div>
    );

  const inWish = isInWishlist(product.Product_ID);
  const isOutOfStock =
    product.Current_Stock !== null &&
    product.Current_Stock !== undefined &&
    Number(product.Current_Stock) === 0;
  const emoji = EMOJIS[product.Category_Name] || "📦";

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, qty);
    toast.success(`${qty}× ${product.Name} added to cart!`, {
      id: `detail_${product.Product_ID}`,
    });
  };

  return (
    <div
      className="page-enter"
      style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}
    >
      <style>{`
        .qty-btn { width:38px; height:38px; border-radius:9px; border:1.5px solid #e5e7eb; background:#fff; cursor:pointer; font-size:20px; font-weight:700; display:flex; align-items:center; justify-content:center; transition:all .2s; color:#374151; }
        .qty-btn:hover { background:#f0fdf4; border-color:#86efac; color:#16a34a; }
        .tab-btn { padding:12px 22px; border:none; background:transparent; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:600; color:#6b7280; border-bottom:2px solid transparent; transition:all .2s; }
        .tab-btn.active { color:#16a34a; border-bottom-color:#16a34a; }
      `}</style>

      {/* Breadcrumb */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "12px 0",
        }}
      >
        <div className="container">
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            🏠{" "}
            <Link to="/" style={{ color: "#6b7280", textDecoration: "none" }}>
              Home
            </Link>{" "}
            ›{" "}
            <Link
              to="/shop"
              style={{ color: "#6b7280", textDecoration: "none" }}
            >
              Shop
            </Link>{" "}
            ›{" "}
            <Link
              to={`/shop?cat=${encodeURIComponent(product.Category_Name)}`}
              style={{ color: "#6b7280", textDecoration: "none" }}
            >
              {product.Category_Name}
            </Link>{" "}
            › <strong style={{ color: "#111827" }}>{product.Name}</strong>
          </span>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "start",
          }}
        >
          {/* LEFT — Image */}
          <div>
            <div
              style={{
                borderRadius: 24,
                overflow: "hidden",
                border: "1.5px solid #e5e7eb",
                background: product.Product_Image
                  ? "#fff"
                  : "linear-gradient(135deg,#f0fdf4,#ecfdf5)",
                aspectRatio: "1/1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 32px rgba(0,0,0,.08)",
              }}
            >
              {product.Product_Image ? (
                <img
                  src={product.Product_Image}
                  alt={product.Name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 120,
                      lineHeight: 1,
                      marginBottom: 12,
                      filter: "drop-shadow(0 4px 12px rgba(0,0,0,.1))",
                    }}
                  >
                    {emoji}
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}
                  >
                    No image uploaded
                  </div>
                </div>
              )}
            </div>

            {/* ✅ Only show upload hint when NO image uploaded */}
            {!product.Product_Image && (
              <div
                style={{
                  marginTop: 12,
                  padding: "10px 16px",
                  background: "#f0fdf4",
                  borderRadius: 10,
                  border: "1px solid #bbf7d0",
                  fontSize: 12,
                  color: "#15803d",
                  textAlign: "center",
                }}
              >
                📷 Upload a product image via{" "}
                <Link
                  to="/admin/inventory"
                  style={{ color: "#15803d", fontWeight: 700 }}
                >
                  Admin → Inventory
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT — Info */}
          <div>
            {/* Badges */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: "#f0fdf4",
                  color: "#16a34a",
                  border: "1px solid #86efac",
                  padding: "4px 12px",
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {emoji} {product.Category_Name}
              </span>
              {product.Is_Perishable ? (
                <span
                  style={{
                    background: "#fff7ed",
                    color: "#ea580c",
                    border: "1px solid #fed7aa",
                    padding: "4px 12px",
                    borderRadius: 99,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  🌡️ Perishable
                </span>
              ) : (
                <span
                  style={{
                    background: "#f0f9ff",
                    color: "#0369a1",
                    border: "1px solid #bae6fd",
                    padding: "4px 12px",
                    borderRadius: 99,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  ✅ Non-perishable
                </span>
              )}
              {!isOutOfStock && (
                <span
                  style={{
                    background: "#dcfce7",
                    color: "#15803d",
                    border: "1px solid #86efac",
                    padding: "4px 12px",
                    borderRadius: 99,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  ✅ In Stock
                </span>
              )}
            </div>

            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1.15,
                marginBottom: 8,
              }}
            >
              {product.Name}
            </h1>

            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
              by{" "}
              <strong style={{ color: "#374151" }}>
                {product.Brand || "FreshMart"}
              </strong>
              {product.Unit && (
                <>
                  {" "}
                  · <span>{product.Unit}</span>
                </>
              )}
              {product.Unit_Mass_Kg && (
                <>
                  {" "}
                  · <span>{product.Unit_Mass_Kg} kg</span>
                </>
              )}
            </div>

            {/* Price */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginBottom: 24,
                padding: "16px 20px",
                background: "linear-gradient(135deg,#f0fdf4,#ecfdf5)",
                borderRadius: 14,
                border: "1px solid #86efac",
              }}
            >
              <span style={{ fontSize: 40, fontWeight: 800, color: "#16a34a" }}>
                ${Number(product.Unit_Price).toFixed(2)}
              </span>
              <span style={{ fontSize: 14, color: "#6b7280" }}>
                per {product.Unit || "unit"}
              </span>
            </div>

            {/* Quantity selector */}
            {!isOutOfStock && (
              <div style={{ marginBottom: 22 }}>
                <label
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#374151",
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  Quantity
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <button
                    className="qty-btn"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span
                    style={{
                      minWidth: 36,
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#111827",
                    }}
                  >
                    {qty}
                  </span>
                  <button
                    className="qty-btn"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    +
                  </button>
                  <span
                    style={{ fontSize: 13, color: "#6b7280", marginLeft: 4 }}
                  >
                    Total:{" "}
                    <strong style={{ color: "#16a34a", fontSize: 15 }}>
                      ${(Number(product.Unit_Price) * qty).toFixed(2)}
                    </strong>
                  </span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              {isOutOfStock ? (
                <div
                  style={{
                    flex: 1,
                    padding: "14px",
                    textAlign: "center",
                    background: "#f5f5f5",
                    borderRadius: 12,
                    color: "#9ca3af",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  Out of Stock
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    padding: "14px 24px",
                    background: "linear-gradient(135deg,#15803d,#22c55e)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: "pointer",
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    boxShadow: "0 4px 14px rgba(21,128,61,.3)",
                    transition: "all .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(21,128,61,.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow =
                      "0 4px 14px rgba(21,128,61,.3)";
                  }}
                >
                  🛒 Add {qty > 1 ? `${qty}× ` : ""}to Cart
                </button>
              )}
              <button
                onClick={() =>
                  inWish
                    ? removeFromWishlist(product.Product_ID)
                    : addToWishlist(product)
                }
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  border: `1.5px solid ${inWish ? "#fca5a5" : "#e5e7eb"}`,
                  background: inWish ? "#fee2e2" : "#fff",
                  cursor: "pointer",
                  fontSize: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all .2s",
                }}
              >
                {inWish ? "❤️" : "🤍"}
              </button>
            </div>

            {/* Product meta */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 12,
                padding: "4px 16px",
                border: "1px solid #e5e7eb",
                marginBottom: 20,
              }}
            >
              {[
                ["🏷️", "Brand", product.Brand || "FreshMart"],
                ["📦", "Barcode", product.Barcode],
                [
                  "⚖️",
                  "Weight",
                  product.Unit_Mass_Kg ? `${product.Unit_Mass_Kg} kg` : "—",
                ],
                ["📊", "Stock", product.Current_Stock ?? 99],
                ["🔄", "Reorder Level", product.Reorder_Level],
              ].map(([icon, label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "9px 0",
                    borderBottom: "1px solid #f3f4f6",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "#6b7280" }}>
                    {icon} {label}
                  </span>
                  <strong style={{ color: "#374151" }}>{value}</strong>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 10,
              }}
            >
              {[
                ["🚚", "Free delivery", "over $50"],
                ["🔒", "Secure", "payment"],
                ["↩️", "Easy", "returns"],
              ].map(([icon, t, s]) => (
                <div
                  key={t}
                  style={{
                    textAlign: "center",
                    padding: "12px 8px",
                    background: "#f8fafc",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                  <div
                    style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}
                  >
                    {t}
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            marginTop: 48,
            background: "#fff",
            borderRadius: 18,
            border: "1.5px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              borderBottom: "2px solid #f3f4f6",
              padding: "0 24px",
            }}
          >
            {[
              ["description", "📝 Description"],
              ["details", "📋 Details"],
              ["reviews", "⭐ Reviews"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`tab-btn${tab === key ? " active" : ""}`}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ padding: 28 }}>
            {tab === "description" && (
              <div>
                <p
                  style={{
                    fontSize: 15,
                    color: "#4b5563",
                    lineHeight: 1.8,
                    marginBottom: 20,
                  }}
                >
                  {product.Description ||
                    `${product.Name} is a premium quality product carefully sourced for FreshMart customers in Phnom Penh. Each item is inspected for freshness and quality before reaching your doorstep.`}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 16,
                  }}
                >
                  {[
                    ["🌿", "100% Fresh", "Sourced daily"],
                    ["✅", "Quality Checked", "Every item inspected"],
                    ["📦", "Packed Fresh", "Sealed for freshness"],
                  ].map(([icon, t, s]) => (
                    <div
                      key={t}
                      style={{
                        padding: 16,
                        background: "#f8fafc",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 8 }}>
                        {icon}
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#111827",
                          marginBottom: 4,
                          fontSize: 14,
                        }}
                      >
                        {t}
                      </div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>{s}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === "details" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  ["Product Name", product.Name],
                  ["Brand", product.Brand || "FreshMart"],
                  ["Category", product.Category_Name],
                  ["Unit", product.Unit],
                  [
                    "Weight",
                    product.Unit_Mass_Kg ? `${product.Unit_Mass_Kg} kg` : "—",
                  ],
                  ["Barcode", product.Barcode],
                  ["Perishable", product.Is_Perishable ? "Yes" : "No"],
                  ["Reorder Level", product.Reorder_Level],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "#f8fafc",
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>{k}</span>
                    <strong style={{ color: "#374151" }}>{v}</strong>
                  </div>
                ))}
              </div>
            )}
            {tab === "reviews" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 16,
                }}
              >
                {[
                  {
                    name: "Narin PHET",
                    stars: 5,
                    text: "The website is smoother than my semester plans, and those never go smoothly.",
                    color: "#dcfce7",
                  },
                  {
                    name: "Phourany PHEA",
                    stars: 5,
                    text: "The product details were clear and the ordering process was smooth. My wallet wasn't happy, but I was.",
                    color: "#dbeafe",
                  },
                  {
                    name: "Chanvathana NOUN",
                    stars: 5,
                    text: "Finding products on this website was easier than finding my lecture notes before an exam.",
                    color: "#dbf2fe",
                  },
                ].map((r) => (
                  <div
                    key={r.name}
                    style={{
                      padding: 18,
                      borderRadius: 14,
                      background: r.color + "66",
                      border: `1.5px solid ${r.color}`,
                    }}
                  >
                    <div
                      style={{
                        color: "#f59e0b",
                        marginBottom: 8,
                        fontSize: 16,
                      }}
                    >
                      {"★".repeat(r.stars)}
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#374151",
                        lineHeight: 1.7,
                        marginBottom: 10,
                        fontStyle: "italic",
                      }}
                    >
                      "{r.text}"
                    </p>
                    <strong style={{ fontSize: 13, color: "#111827" }}>
                      {r.name}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
