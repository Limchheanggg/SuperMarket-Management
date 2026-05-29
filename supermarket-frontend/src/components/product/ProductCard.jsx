import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

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

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWish = isInWishlist(product.Product_ID);

  const emoji = EMOJIS[product.Category_Name] || "🛒";
  const hasDiscount =
    product.old_price && product.old_price > product.Unit_Price;
  const discount = hasDiscount
    ? Math.round((1 - product.Unit_Price / product.old_price) * 100)
    : 0;

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e5e7eb",
        borderRadius: 16,
        overflow: "hidden",
        transition: "all .25s",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,.10)";
        e.currentTarget.style.borderColor = "#16a34a";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.transform = "none";
      }}
    >
      {discount > 0 && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "linear-gradient(135deg,#ef4444,#f97316)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 99,
            zIndex: 2,
          }}
        >
          -{discount}%
        </div>
      )}

      {/* Wishlist heart button — toggles on click */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 2,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "none",
          background: inWish ? "#fee2e2" : "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,.1)",
          transition: "all .2s",
        }}
      >
        {inWish ? "❤️" : "🤍"}
      </button>

      <Link
        to={`/shop/${product.Product_ID}`}
        style={{
          display: "flex",
          height: 170,
          background: "#f0fdf4",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 72,
          textDecoration: "none",
          overflow: "hidden",
        }}
      >
        {product.Product_Image ? (
          <img
            src={product.Product_Image}
            alt={product.Name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform .3s",
            }}
          />
        ) : (
          <span style={{ transition: "transform .3s" }}>{emoji}</span>
        )}
      </Link>

      <div
        style={{
          padding: "14px 15px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#16a34a",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 4,
          }}
        >
          {product.Category_Name}
        </div>
        <Link
          to={`/shop/${product.Product_ID}`}
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#111827",
            marginBottom: 4,
            lineHeight: 1.3,
            textDecoration: "none",
          }}
        >
          {product.Name}
        </Link>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
          {product.Unit} · {product.Brand}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <strong style={{ color: "#16a34a", fontSize: 17, fontWeight: 700 }}>
            ${Number(product.Unit_Price).toFixed(2)}
          </strong>
          {hasDiscount && (
            <del style={{ color: "#9ca3af", fontSize: 13 }}>
              ${Number(product.old_price).toFixed(2)}
            </del>
          )}
        </div>
        {product.Current_Stock === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 9,
              fontSize: 13,
              color: "#9ca3af",
              background: "#f5f5f5",
              borderRadius: 8,
              marginTop: "auto",
              fontWeight: 600,
            }}
          >
            Out of Stock
          </div>
        ) : (
          <button
            onClick={() => addItem(product)}
            style={{
              background: "linear-gradient(135deg,#15803d,#22c55e)",
              color: "#fff",
              padding: 9,
              fontWeight: 700,
              fontSize: 13,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              marginTop: "auto",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              transition: "all .2s",
            }}
          >
            + Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
