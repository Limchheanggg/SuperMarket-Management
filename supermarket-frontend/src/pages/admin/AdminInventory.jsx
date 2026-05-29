import { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

const statusColor = {
  "In Stock": "#16a34a",
  "Low Stock": "#d97706",
  "Out of Stock": "#dc2626",
};

const EMOJIS = {
  Beverages: "💧",
  Dairy: "🥛",
  Snacks: "🍿",
  Bakery: "🍞",
  "Meat & Seafood": "🥩",
  "Fruits & Vegetables": "🍎",
  "Frozen Foods": "🧊",
  "Personal Care": "💊",
  Household: "🧹",
  "Canned Goods": "🥫",
  Produce: "🥬",
  Meat: "🥩",
  Frozen: "🧊",
  Seafood: "🐟",
  Organic: "🌿",
};

// Unit enum options — select instead of free-type
const UNIT_OPTIONS = [
  "Bottle",
  "Can",
  "Pack",
  "Bag",
  "Box",
  "Carton",
  "Loaf",
  "Piece",
  "kg",
  "g",
  "L",
  "ml",
  "Dozen",
  "Bundle",
  "Tray",
  "Jar",
  "Tube",
  "Sachet",
  "Roll",
  "Bar",
];

const EMPTY_PRODUCT = {
  Barcode: "",
  Name: "",
  Description: "",
  Category_ID: "",
  Brand: "",
  Unit: "",
  Unit_Price: "",
  Unit_Mass_Kg: "",
  Reorder_Level: "10",
  Is_Perishable: "0",
  Product_Image: "",
};

function resizeImage(file, maxSize = 400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width,
          h = img.height;
        if (w > h) {
          if (w > maxSize) {
            h = Math.round((h * maxSize) / w);
            w = maxSize;
          }
        } else {
          if (h > maxSize) {
            w = Math.round((w * maxSize) / h);
            h = maxSize;
          }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.onerror = reject;
      img.src = ev.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Product Form Modal — defined OUTSIDE so React never remounts it ──
function ProductFormModal({
  title,
  productForm,
  setProductForm,
  imagePreview,
  setImagePreview,
  onConfirm,
  onClose,
  saving,
  categories,
}) {
  const fileRef = useRef();
  const set = (field) => (e) =>
    setProductForm((f) => ({ ...f, [field]: e.target.value }));

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    try {
      const resized = await resizeImage(file, 400);
      setImagePreview(resized);
      setProductForm((f) => ({ ...f, Product_Image: resized }));
    } catch {
      toast.error("Failed to process image");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 28,
          width: "100%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: "#888",
            }}
          >
            ✕
          </button>
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: 120,
              height: 120,
              borderRadius: 12,
              border: "2px dashed #ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              margin: "0 auto 10px",
              overflow: "hidden",
              background: "#f9f9f9",
              fontSize: 48,
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#16a34a")
            }
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ddd")}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              EMOJIS[
                categories.find((c) => c.Category_ID == productForm.Category_ID)
                  ?.Category_Name
              ] || "📷"
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                fontSize: 12,
                color: "#16a34a",
                fontWeight: 700,
                background: "none",
                border: "1px solid #16a34a",
                borderRadius: 6,
                padding: "4px 12px",
                cursor: "pointer",
              }}
            >
              {imagePreview ? "Change Photo" : "Upload Photo"}
            </button>
            {imagePreview && (
              <button
                onClick={() => {
                  setImagePreview(null);
                  setProductForm((f) => ({ ...f, Product_Image: "" }));
                }}
                style={{
                  fontSize: 12,
                  color: "#dc2626",
                  fontWeight: 700,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            )}
          </div>
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
            Auto-resized to 400×400px
          </p>
        </div>

        {/* Form Fields */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 700,
                display: "block",
                marginBottom: 5,
              }}
            >
              Barcode *
            </label>
            <input
              className="form-input"
              placeholder="e.g. 8991000000001"
              value={productForm.Barcode}
              onChange={set("Barcode")}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 700,
                display: "block",
                marginBottom: 5,
              }}
            >
              Product Name *
            </label>
            <input
              className="form-input"
              placeholder="e.g. Fresh Milk 1L"
              value={productForm.Name}
              onChange={set("Name")}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 700,
                display: "block",
                marginBottom: 5,
              }}
            >
              Category *
            </label>
            <select
              className="form-input"
              value={productForm.Category_ID}
              onChange={set("Category_ID")}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.Category_ID} value={c.Category_ID}>
                  {c.Category_Name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 700,
                display: "block",
                marginBottom: 5,
              }}
            >
              Brand
            </label>
            <input
              className="form-input"
              placeholder="e.g. DairyBest"
              value={productForm.Brand}
              onChange={set("Brand")}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 700,
                display: "block",
                marginBottom: 5,
              }}
            >
              Unit Price ($) *
              {productForm.Unit_Price &&
                isNaN(Number(productForm.Unit_Price)) && (
                  <span
                    style={{ color: "#dc2626", fontSize: 11, marginLeft: 6 }}
                  >
                    ⚠ must be a number
                  </span>
                )}
            </label>
            <input
              className="form-input"
              placeholder="e.g. 1.99"
              value={productForm.Unit_Price}
              onChange={set("Unit_Price")}
              style={{
                borderColor:
                  productForm.Unit_Price &&
                  isNaN(Number(productForm.Unit_Price))
                    ? "#dc2626"
                    : undefined,
              }}
            />
          </div>
          <div>
            {/* Unit is now a SELECT dropdown — no more free typing */}
            <label
              style={{
                fontSize: 13,
                fontWeight: 700,
                display: "block",
                marginBottom: 5,
              }}
            >
              Unit *
            </label>
            <select
              className="form-input"
              value={productForm.Unit}
              onChange={set("Unit")}
            >
              <option value="">Select unit...</option>
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 700,
                display: "block",
                marginBottom: 5,
              }}
            >
              Weight (kg)
              {productForm.Unit_Mass_Kg &&
                isNaN(Number(productForm.Unit_Mass_Kg)) && (
                  <span
                    style={{ color: "#dc2626", fontSize: 11, marginLeft: 6 }}
                  >
                    ⚠ must be a number
                  </span>
                )}
            </label>
            <input
              className="form-input"
              placeholder="e.g. 0.600"
              value={productForm.Unit_Mass_Kg}
              onChange={set("Unit_Mass_Kg")}
              style={{
                borderColor:
                  productForm.Unit_Mass_Kg &&
                  isNaN(Number(productForm.Unit_Mass_Kg))
                    ? "#dc2626"
                    : undefined,
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 700,
                display: "block",
                marginBottom: 5,
              }}
            >
              Reorder Level
            </label>
            <input
              className="form-input"
              placeholder="e.g. 10"
              value={productForm.Reorder_Level}
              onChange={set("Reorder_Level")}
            />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 700,
                display: "block",
                marginBottom: 5,
              }}
            >
              Description
            </label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Product description…"
              value={productForm.Description}
              onChange={set("Description")}
              style={{ resize: "vertical" }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 700,
                display: "block",
                marginBottom: 5,
              }}
            >
              Perishable?
            </label>
            <select
              className="form-input"
              value={productForm.Is_Perishable}
              onChange={set("Is_Perishable")}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={onConfirm}
            disabled={saving}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(135deg,#15803d,#22c55e)",
              color: "#fff",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: 14,
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "⏳ Saving…" : "✅ Confirm"}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal — replaces window.confirm ──
function DeleteModal({ item, onConfirm, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 28,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 12 }}>🗑️</div>
        <h3
          style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: 18,
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 8,
          }}
        >
          Delete Product?
        </h3>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 6 }}>
          You are about to delete:
        </p>
        <p
          style={{
            fontWeight: 700,
            color: "#0f172a",
            fontSize: 15,
            marginBottom: 6,
          }}
        >
          "{item.Name}"
        </p>
        <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 24 }}>
          ⚠️ This action cannot be undone. The product and all its inventory
          records will be permanently removed.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              background: "#f8fafc",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg,#dc2626,#ef4444)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // item to delete
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInventory();
    API.get("/api/products/categories")
      .then((r) => setCategories(r.data || []))
      .catch(() => {});
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get("/api/inventory/");
      setInventory(res.data);
    } catch {
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const validateProductForm = () => {
    if (!productForm.Barcode.trim()) {
      toast.error("Barcode is required");
      return false;
    }
    if (!productForm.Name.trim()) {
      toast.error("Product Name is required");
      return false;
    }
    if (!productForm.Category_ID) {
      toast.error("Category is required");
      return false;
    }
    if (!productForm.Unit) {
      toast.error("Unit is required");
      return false;
    }
    if (
      !productForm.Unit_Price ||
      isNaN(Number(productForm.Unit_Price)) ||
      Number(productForm.Unit_Price) <= 0
    ) {
      toast.error("Unit Price must be a valid number greater than 0");
      return false;
    }
    if (productForm.Unit_Mass_Kg && isNaN(Number(productForm.Unit_Mass_Kg))) {
      toast.error("Weight must be a valid number");
      return false;
    }
    return true;
  };

  const handleAddProduct = async () => {
    if (!validateProductForm()) return;
    setSaving(true);
    try {
      await API.post("/api/products/", {
        ...productForm,
        Category_ID: parseInt(productForm.Category_ID),
        Unit_Price: parseFloat(productForm.Unit_Price),
        Unit_Mass_Kg: productForm.Unit_Mass_Kg
          ? parseFloat(productForm.Unit_Mass_Kg)
          : null,
        Reorder_Level: parseInt(productForm.Reorder_Level) || 10,
        Is_Perishable: parseInt(productForm.Is_Perishable) || 0,
      });
      toast.success("✅ Product added!");
      setModal(null);
      setProductForm(EMPTY_PRODUCT);
      setImagePreview(null);
      fetchInventory();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  const handleEditProduct = async () => {
    if (!validateProductForm()) return;
    setSaving(true);
    try {
      await API.put(`/api/products/${selectedItem.Product_ID}`, {
        ...productForm,
        Category_ID: parseInt(productForm.Category_ID),
        Unit_Price: parseFloat(productForm.Unit_Price),
        Unit_Mass_Kg: productForm.Unit_Mass_Kg
          ? parseFloat(productForm.Unit_Mass_Kg)
          : null,
        Reorder_Level: parseInt(productForm.Reorder_Level) || 10,
        Is_Perishable: parseInt(productForm.Is_Perishable) || 0,
      });
      toast.success("✅ Product updated!");
      setModal(null);
      fetchInventory();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  // Replaces window.confirm — opens a proper modal instead
  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/api/products/${deleteTarget.Product_ID}`);
      toast.success(`"${deleteTarget.Name}" deleted`);
      setDeleteTarget(null);
      fetchInventory();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete");
    }
  };

  const handleRestock = async () => {
    if (!qty || isNaN(Number(qty)) || Number(qty) <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }
    try {
      await API.post("/api/inventory/restock", {
        product_id: selectedItem.Product_ID,
        quantity: parseInt(qty),
        note,
      });
      toast.success(`Restocked ${qty} units!`);
      setModal(null);
      setQty("");
      setNote("");
      fetchInventory();
    } catch {
      toast.error("Restock failed");
    }
  };

  const handleAdjust = async () => {
    if (qty === "" || isNaN(Number(qty)) || Number(qty) < 0) {
      toast.error("Enter a valid quantity");
      return;
    }
    try {
      await API.put(`/api/inventory/${selectedItem.Product_ID}`, {
        quantity: parseInt(qty),
        note,
      });
      toast.success("Stock adjusted!");
      setModal(null);
      setQty("");
      setNote("");
      fetchInventory();
    } catch {
      toast.error("Adjustment failed");
    }
  };

  const openEdit = (item) => {
    setSelectedItem(item);
    setProductForm({
      Barcode: item.Barcode || "",
      Name: item.Name || "",
      Description: item.Description || "",
      Category_ID: item.Category_ID || "",
      Brand: item.Brand || "",
      Unit: item.Unit || "",
      Unit_Price: String(item.Unit_Price || ""),
      Unit_Mass_Kg: String(item.Unit_Mass_Kg || ""),
      Reorder_Level: String(item.Reorder_Level || "10"),
      Is_Perishable: String(item.Is_Perishable || "0"),
      Product_Image: item.Product_Image || "",
    });
    setImagePreview(item.Product_Image || null);
    setModal("edit");
  };

  const filtered = inventory.filter((i) => {
    const s = search.toLowerCase().trim();
    const matchSearch =
      !s ||
      i.Name.toLowerCase().includes(s) ||
      (i.Barcode || "").toLowerCase().includes(s) ||
      (i.Category_Name || "").toLowerCase().includes(s) ||
      (i.Brand || "").toLowerCase().includes(s);
    return matchSearch && (filter === "All" || i.Status === filter);
  });

  const stats = {
    total: inventory.length,
    inStock: inventory.filter((i) => i.Status === "In Stock").length,
    low: inventory.filter((i) => i.Status === "Low Stock").length,
    out: inventory.filter((i) => i.Status === "Out of Stock").length,
  };

  return (
    <div style={{ padding: 28, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 4,
            }}
          >
            📦 Inventory Management
          </h2>
          <p style={{ color: "#64748b", fontSize: 13 }}>
            {stats.total} products total
          </p>
        </div>
        <button
          onClick={() => {
            setProductForm(EMPTY_PRODUCT);
            setImagePreview(null);
            setModal("add");
          }}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg,#15803d,#22c55e)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            boxShadow: "0 4px 12px rgba(21,128,61,.3)",
          }}
        >
          + Add Product
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          [
            "Total Products",
            stats.total,
            "#6366f1",
            "linear-gradient(135deg,#eef2ff,#e0e7ff)",
          ],
          [
            "In Stock",
            stats.inStock,
            "#16a34a",
            "linear-gradient(135deg,#f0fdf4,#dcfce7)",
          ],
          [
            "Low Stock",
            stats.low,
            "#d97706",
            "linear-gradient(135deg,#fffbeb,#fef3c7)",
          ],
          [
            "Out of Stock",
            stats.out,
            "#dc2626",
            "linear-gradient(135deg,#fef2f2,#fee2e2)",
          ],
        ].map(([l, v, c, bg]) => (
          <div
            key={l}
            style={{
              background: bg,
              borderRadius: 14,
              padding: "16px 20px",
              border: `1.5px solid ${c}22`,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#64748b",
                marginBottom: 4,
                fontWeight: 600,
              }}
            >
              {l}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div
        style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search name, barcode, category, brand..."
            style={{
              width: "100%",
              padding: "9px 14px",
              paddingRight: search ? 36 : 14,
              borderRadius: 10,
              border: "1.5px solid #e5e7eb",
              fontSize: 13,
              boxSizing: "border-box",
              outline: "none",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                fontSize: 18,
                lineHeight: 1,
                padding: 0,
              }}
            >
              ✕
            </button>
          )}
        </div>
        {["All", "In Stock", "Low Stock", "Out of Stock"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "9px 16px",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              background: filter === f ? "#15803d" : "#f1f5f9",
              color: filter === f ? "#fff" : "#374151",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {search && (
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>
          Found <strong style={{ color: "#111827" }}>{filtered.length}</strong>{" "}
          result{filtered.length !== 1 ? "s" : ""} for "
          <strong style={{ color: "#16a34a" }}>{search}</strong>"
        </div>
      )}

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          overflow: "hidden",
          border: "1.5px solid #e5e7eb",
          boxShadow: "0 2px 10px rgba(0,0,0,.04)",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr
              style={{
                background: "#f8fafc",
                borderBottom: "2px solid #e5e7eb",
              }}
            >
              {[
                "Product",
                "Category",
                "Price",
                "Stock",
                "Reorder",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "13px 16px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "#374151",
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}
                >
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}
                >
                  <div style={{ fontSize: 40 }}>🔍</div>
                  <p style={{ marginTop: 10 }}>
                    {search
                      ? `No results for "${search}"`
                      : "No products found"}
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.Product_ID}
                  style={{ borderBottom: "1px solid #f5f5f5" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fafafa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: "#f0fdf4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          flexShrink: 0,
                          overflow: "hidden",
                        }}
                      >
                        {item.Product_Image ? (
                          <img
                            src={item.Product_Image}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          EMOJIS[item.Category_Name] || "📦"
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>
                          {item.Name}
                        </div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>
                          {item.Barcode}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#64748b" }}>
                    {item.Category_Name}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#16a34a",
                      fontWeight: 700,
                    }}
                  >
                    ${Number(item.Unit_Price).toFixed(2)}
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 700 }}>
                    {item.Quantity}{" "}
                    <span
                      style={{
                        color: "#9ca3af",
                        fontWeight: 400,
                        fontSize: 12,
                      }}
                    >
                      {item.Unit}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#9ca3af" }}>
                    {item.Reorder_Level}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 700,
                        background: statusColor[item.Status] + "20",
                        color: statusColor[item.Status],
                      }}
                    >
                      {item.Status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setQty("");
                          setNote("");
                          setModal("restock");
                        }}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 7,
                          border: "none",
                          background: "#16a34a",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        + Stock
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setQty(String(item.Quantity));
                          setNote("");
                          setModal("adjust");
                        }}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 7,
                          border: "1.5px solid #e5e7eb",
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        Adjust
                      </button>
                      <button
                        onClick={() => openEdit(item)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 7,
                          border: "1.5px solid #93c5fd",
                          background: "#dbeafe",
                          color: "#1d4ed8",
                          cursor: "pointer",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        Edit
                      </button>
                      {/* Del button now opens a proper modal instead of window.confirm */}
                      <button
                        onClick={() => setDeleteTarget(item)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 7,
                          border: "1.5px solid #fca5a5",
                          background: "#fee2e2",
                          color: "#dc2626",
                          cursor: "pointer",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Restock / Adjust Modal */}
      {(modal === "restock" || modal === "adjust") && selectedItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 28,
              width: 400,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                marginBottom: 16,
              }}
            >
              {modal === "restock" ? "➕ Restock" : "⚙️ Adjust Stock"} —{" "}
              {selectedItem.Name}
            </h3>
            <div
              style={{
                background: "#f0fdf4",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 13,
              }}
            >
              Current stock:{" "}
              <strong>
                {selectedItem.Quantity} {selectedItem.Unit}
              </strong>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                {modal === "restock" ? "Add Quantity" : "Set New Quantity"}
              </label>
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="Enter number"
                autoFocus
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  fontSize: 14,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Note (optional)
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Delivery from supplier"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  fontSize: 14,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={modal === "restock" ? handleRestock : handleAdjust}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(135deg,#15803d,#22c55e)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => setModal(null)}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <ProductFormModal
          title={
            modal === "add"
              ? "➕ Add New Product"
              : `✏️ Edit — ${selectedItem?.Name}`
          }
          productForm={productForm}
          setProductForm={setProductForm}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          onConfirm={modal === "add" ? handleAddProduct : handleEditProduct}
          onClose={() => setModal(null)}
          saving={saving}
          categories={categories}
        />
      )}

      {/* Delete Confirmation Modal — replaces window.confirm */}
      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          onConfirm={handleDeleteProduct}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
