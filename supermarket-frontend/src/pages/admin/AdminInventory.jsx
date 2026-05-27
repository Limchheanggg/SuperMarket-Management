import { useState, useEffect } from "react";
import API from "../../services/api";

const statusColor = {
  "In Stock": "#00B207",
  "Low Stock": "#FF8C00",
  "Out of Stock": "#EA4B48",
};

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null); // { type: 'restock'|'adjust', item }
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
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

  const handleRestock = async () => {
    if (!qty || isNaN(qty)) return;
    await API.post("/api/inventory/restock", {
      product_id: modal.item.Product_ID,
      quantity: parseInt(qty),
      note,
    });
    setModal(null);
    setQty("");
    setNote("");
    fetchInventory();
  };

  const handleAdjust = async () => {
    if (!qty || isNaN(qty)) return;
    await API.put(`/api/inventory/${modal.item.Product_ID}`, {
      quantity: parseInt(qty),
      note,
    });
    setModal(null);
    setQty("");
    setNote("");
    fetchInventory();
  };

  const filtered = inventory.filter((i) => {
    const matchSearch =
      i.Name.toLowerCase().includes(search.toLowerCase()) ||
      i.Barcode?.includes(search);
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
      <h2
        style={{
          fontFamily: "'Josefin Sans',sans-serif",
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        📦 Inventory Management
      </h2>

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

      {/* Filters */}
      <div
        style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search product or barcode..."
          style={{
            flex: 1,
            minWidth: 200,
            padding: "9px 14px",
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: 13,
          }}
        />
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
                "Reorder Level",
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
                  No products found
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.Product_ID}
                  style={{ borderBottom: "1px solid #f5f5f5" }}
                >
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                    {item.Name}
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
                    ${item.Unit_Price}
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 700 }}>
                    {item.Quantity} {item.Unit}
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
                    <button
                      onClick={() => {
                        setModal({ type: "restock", item });
                        setQty("");
                        setNote("");
                      }}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 6,
                        border: "none",
                        background: "#00B207",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                        marginRight: 6,
                      }}
                    >
                      + Restock
                    </button>
                    <button
                      onClick={() => {
                        setModal({ type: "adjust", item });
                        setQty(item.Quantity);
                        setNote("");
                      }}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
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
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 28,
              width: 380,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              style={{
                fontFamily: "'Josefin Sans',sans-serif",
                marginBottom: 16,
              }}
            >
              {modal.type === "restock" ? "+ Restock" : "⚙ Adjust Stock"} —{" "}
              {modal.item.Name}
            </h3>
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                {modal.type === "restock" ? "Add Quantity" : "Set New Quantity"}
              </label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                min="0"
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
                onClick={
                  modal.type === "restock" ? handleRestock : handleAdjust
                }
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
    </div>
  );
}
