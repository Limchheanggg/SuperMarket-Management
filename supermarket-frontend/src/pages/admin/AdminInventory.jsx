import { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

const statusColor = {
  "In Stock": "#00B207",
  "Low Stock": "#FF8C00",
  "Out of Stock": "#EA4B48",
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
};

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setProductForm((f) => ({ ...f, Product_Image: ev.target.result }));
    };
    reader.readAsDataURL(file);
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
              fontFamily: "'Josefin Sans',sans-serif",
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
              (e.currentTarget.style.borderColor = "#00B207")
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
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              fontSize: 12,
              color: "#00B207",
              fontWeight: 700,
              background: "none",
              border: "1px solid #00B207",
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
                color: "#EA4B48",
                fontWeight: 700,
                background: "none",
                border: "none",
                cursor: "pointer",
                marginLeft: 8,
              }}
            >
              Remove
            </button>
          )}
        </div>

        {/* Form — ALL fields are type="text" to prevent browser locking */}
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
                    style={{ color: "#EA4B48", fontSize: 11, marginLeft: 6 }}
                  >
                    ⚠ must be a number
                  </span>
                )}
            </label>
            {/* type="text" so browser never rejects/locks input */}
            <input
              className="form-input"
              placeholder="e.g. 1.99"
              value={productForm.Unit_Price}
              onChange={set("Unit_Price")}
              style={{
                borderColor:
                  productForm.Unit_Price &&
                  isNaN(Number(productForm.Unit_Price))
                    ? "#EA4B48"
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
              Unit *
            </label>
            <input
              className="form-input"
              placeholder="e.g. Bottle, kg, Pack"
              value={productForm.Unit}
              onChange={set("Unit")}
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
              Weight (kg)
              {productForm.Unit_Mass_Kg &&
                isNaN(Number(productForm.Unit_Mass_Kg)) && (
                  <span
                    style={{ color: "#EA4B48", fontSize: 11, marginLeft: 6 }}
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
                    ? "#EA4B48"
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
              background: "#00B207",
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

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
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
    if (!productForm.Unit.trim()) {
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

  const handleDeleteProduct = async (item) => {
    if (!window.confirm(`Delete "${item.Name}"? This cannot be undone.`))
      return;
    try {
      await API.delete(`/api/products/${item.Product_ID}`);
      toast.success("Product deleted");
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

  // Search filters directly on every keystroke — no debounce needed for local data
  const filtered = inventory.filter((i) => {
    const s = search.toLowerCase().trim();
    const matchSearch =
      !s ||
      i.Name.toLowerCase().includes(s) ||
      (i.Barcode || "").toLowerCase().includes(s) ||
      (i.Category_Name || "").toLowerCase().includes(s) ||
      (i.Brand || "").toLowerCase().includes(s);
    const matchFilter = filter === "All" || i.Status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: inventory.length,
    inStock: inventory.filter((i) => i.Status === "In Stock").length,
    low: inventory.filter((i) => i.Status === "Low Stock").length,
    out: inventory.filter((i) => i.Status === "Out of Stock").length,
  };

  return (
    <div style={{ padding: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            fontFamily: "'Josefin Sans',sans-serif",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          📦 Inventory Management
        </h2>
        <button
          onClick={() => {
            setProductForm(EMPTY_PRODUCT);
            setImagePreview(null);
            setModal("add");
          }}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: "#00B207",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
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
          ["Total Products", stats.total, "#3b82f6"],
          ["In Stock", stats.inStock, "#00B207"],
          ["Low Stock", stats.low, "#FF8C00"],
          ["Out of Stock", stats.out, "#EA4B48"],
        ].map(([l, v, c]) => (
          <div
            key={l}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "16px 20px",
              borderLeft: `4px solid ${c}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              {l}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div
        style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}
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
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 13,
              boxSizing: "border-box",
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
                color: "#888",
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
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: filter === f ? "#00B207" : "#f0f0f0",
              color: filter === f ? "#fff" : "#555",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Results count */}
      {search && (
        <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>
          Found <strong style={{ color: "#1a1a1a" }}>{filtered.length}</strong>{" "}
          result{filtered.length !== 1 ? "s" : ""} for "
          <strong style={{ color: "#00B207" }}>{search}</strong>"
        </div>
      )}

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr
              style={{ background: "#f8f8f8", borderBottom: "2px solid #eee" }}
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
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "#555",
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
                  style={{ padding: 40, textAlign: "center", color: "#888" }}
                >
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{ padding: 40, textAlign: "center", color: "#888" }}
                >
                  <div style={{ fontSize: 40 }}>🔍</div>
                  <p style={{ marginTop: 10 }}>
                    {search
                      ? `No results for "${search}"`
                      : "No products found"}
                  </p>
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      style={{
                        marginTop: 10,
                        color: "#00B207",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      Clear search
                    </button>
                  )}
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
                          background: "#F2FCF3",
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
                        <div style={{ fontWeight: 600 }}>{item.Name}</div>
                        <div style={{ fontSize: 11, color: "#aaa" }}>
                          {item.Barcode}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#666" }}>
                    {item.Category_Name}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#00B207",
                      fontWeight: 700,
                    }}
                  >
                    ${Number(item.Unit_Price).toFixed(2)}
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 700 }}>
                    {item.Quantity}{" "}
                    <span
                      style={{ color: "#888", fontWeight: 400, fontSize: 12 }}
                    >
                      {item.Unit}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#888" }}>
                    {item.Reorder_Level}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 20,
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
                          borderRadius: 6,
                          border: "none",
                          background: "#00B207",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 11,
                          fontWeight: 600,
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
                          borderRadius: 6,
                          border: "1px solid #ddd",
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        Adjust
                      </button>
                      <button
                        onClick={() => openEdit(item)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 6,
                          border: "1px solid #3b82f6",
                          background: "#eff6ff",
                          color: "#3b82f6",
                          cursor: "pointer",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(item)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 6,
                          border: "1px solid #EA4B48",
                          background: "#fee2e2",
                          color: "#EA4B48",
                          cursor: "pointer",
                          fontSize: 11,
                          fontWeight: 600,
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
                fontFamily: "'Josefin Sans',sans-serif",
                marginBottom: 16,
              }}
            >
              {modal === "restock" ? "➕ Restock" : "⚙️ Adjust Stock"} —{" "}
              {selectedItem.Name}
            </h3>
            <div
              style={{
                background: "#F2FCF3",
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
                  background: "#00B207",
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
    </div>
  );
}
