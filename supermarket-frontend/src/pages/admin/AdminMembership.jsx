import { useState, useEffect } from "react";
import API from "../../services/api";

const tierColor = {
  Bronze: "#CD7F32",
  Silver: "#A8A9AD",
  Gold: "#FFD700",
  Platinum: "#3b82f6",
};
const tierMin = { Bronze: 0, Silver: 500, Gold: 2000, Platinum: 5000 };

export default function AdminMembership() {
  const [memberships, setMemberships] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'register' | 'redeem' | { type, customer_id }
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [memRes, custRes] = await Promise.all([
        API.get("/api/membership/"),
        API.get("/api/users/customers"),
      ]);
      setMemberships(memRes.data);
      setCustomers(custRes.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      await API.post("/api/membership/register", {
        customer_id: parseInt(form.customer_id),
      });
      setModal(null);
      setForm({});
      fetchAll();
    } catch (e) {
      alert(e.response?.data?.detail || "Error registering");
    }
  };

  const handleRedeem = async () => {
    try {
      const res = await API.post("/api/membership/redeem", {
        customer_id: parseInt(modal.customer_id),
        points: parseInt(form.points),
      });
      alert(
        `✅ Redeemed! Discount: $${res.data.discount} | Remaining: ${res.data.remaining_points} pts`,
      );
      setModal(null);
      setForm({});
      fetchAll();
    } catch (e) {
      alert(e.response?.data?.detail || "Error redeeming");
    }
  };

  const filtered = memberships.filter((m) =>
    m.Customer_Name?.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: memberships.length,
    bronze: memberships.filter((m) => m.Tier === "Bronze").length,
    silver: memberships.filter((m) => m.Tier === "Silver").length,
    gold: memberships.filter((m) => m.Tier === "Gold").length,
    platinum: memberships.filter((m) => m.Tier === "Platinum").length,
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
          ⭐ Customer Membership
        </h2>
        <button
          onClick={() => setModal("register")}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: "#00B207",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          + Register Member
        </button>
      </div>

      {/* Tier Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          ["Total", stats.total, "#3b82f6"],
          ["🥉 Bronze", stats.bronze, "#CD7F32"],
          ["🥈 Silver", stats.silver, "#A8A9AD"],
          ["🥇 Gold", stats.gold, "#FFD700"],
          ["💎 Platinum", stats.platinum, "#3b82f6"],
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
            <div style={{ fontSize: 24, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search member..."
        style={{
          width: "100%",
          padding: "9px 14px",
          borderRadius: 8,
          border: "1px solid #ddd",
          fontSize: 13,
          marginBottom: 16,
          boxSizing: "border-box",
        }}
      />

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
                "Customer",
                "Tier",
                "Points",
                "Total Spent",
                "Progress to Next",
                "Joined",
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
                  No members found
                </td>
              </tr>
            ) : (
              filtered.map((m) => {
                const tiers = ["Bronze", "Silver", "Gold", "Platinum"];
                const currentIdx = tiers.indexOf(m.Tier);
                const nextTier = tiers[currentIdx + 1];
                const nextMin = nextTier ? tierMin[nextTier] : null;
                const progress = nextMin
                  ? Math.min(100, (m.Points / nextMin) * 100)
                  : 100;
                return (
                  <tr
                    key={m.Membership_ID}
                    style={{ borderBottom: "1px solid #f5f5f5" }}
                  >
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                      {m.Customer_Name}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          background: tierColor[m.Tier] + "20",
                          color: tierColor[m.Tier],
                        }}
                      >
                        {m.Tier}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontWeight: 700,
                        color: "#3b82f6",
                      }}
                    >
                      {m.Points} pts
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#00B207",
                        fontWeight: 600,
                      }}
                    >
                      ${m.Total_Spent?.toFixed(2)}
                    </td>
                    <td style={{ padding: "12px 16px", minWidth: 130 }}>
                      {nextTier ? (
                        <div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#888",
                              marginBottom: 4,
                            }}
                          >
                            {m.Points}/{nextMin} → {nextTier}
                          </div>
                          <div
                            style={{
                              height: 6,
                              background: "#f0f0f0",
                              borderRadius: 3,
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${progress}%`,
                                background: tierColor[m.Tier],
                                borderRadius: 3,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "#3b82f6", fontWeight: 700 }}>
                          Max Tier 💎
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#888",
                        fontSize: 12,
                      }}
                    >
                      {new Date(m.Joined_At).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        onClick={() =>
                          setModal({
                            type: "redeem",
                            customer_id: m.Customer_ID,
                          })
                        }
                        style={{
                          padding: "5px 12px",
                          borderRadius: 6,
                          border: "none",
                          background: "#3b82f6",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Redeem
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Register Modal */}
      {modal === "register" && (
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
                marginBottom: 20,
              }}
            >
              + Register Membership
            </h3>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Select Customer
              </label>
              <select
                value={form.customer_id || ""}
                onChange={(e) => setForm({ customer_id: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  fontSize: 13,
                }}
              >
                <option value="">Choose customer...</option>
                {customers.map((c) => (
                  <option key={c.Customer_ID} value={c.Customer_ID}>
                    {c.First_Name} {c.Last_Name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleRegister}
                style={{
                  flex: 1,
                  padding: 11,
                  borderRadius: 8,
                  border: "none",
                  background: "#00B207",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Register
              </button>
              <button
                onClick={() => setModal(null)}
                style={{
                  flex: 1,
                  padding: 11,
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

      {/* Redeem Modal */}
      {modal?.type === "redeem" && (
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
                marginBottom: 20,
              }}
            >
              🎁 Redeem Points
            </h3>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
              1 point = $0.01 discount
            </p>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Points to Redeem
              </label>
              <input
                type="number"
                value={form.points || ""}
                onChange={(e) => setForm({ points: e.target.value })}
                min="1"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
              />
              {form.points && (
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    color: "#00B207",
                    fontWeight: 600,
                  }}
                >
                  Discount value: $
                  {(parseInt(form.points || 0) * 0.01).toFixed(2)}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleRedeem}
                style={{
                  flex: 1,
                  padding: 11,
                  borderRadius: 8,
                  border: "none",
                  background: "#3b82f6",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Redeem
              </button>
              <button
                onClick={() => setModal(null)}
                style={{
                  flex: 1,
                  padding: 11,
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
