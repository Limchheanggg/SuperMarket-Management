import { useState, useEffect } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

const ROLE_COLORS = {
  admin: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  manager: { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" },
  cashier: { bg: "#dcfce7", color: "#15803d", border: "#86efac" },
  employee: { bg: "#fef3c7", color: "#d97706", border: "#fcd34d" },
  customer: { bg: "#f5f3ff", color: "#7c3aed", border: "#c4b5fd" },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "employee",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch ALL users — employees endpoint returns non-customer roles
      // We also try a general /api/users endpoint as fallback
      let allUsers = [];
      try {
        const res = await API.get("/api/users/employees");
        allUsers = res.data || [];
      } catch {
        // fallback: try general users list
        try {
          const res = await API.get("/api/users/");
          allUsers = res.data || [];
        } catch {
          allUsers = [];
        }
      }
      setUsers(allUsers);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.full_name || !form.email) {
      toast.error("Name and email are required");
      return;
    }
    if (modal === "add" && !form.password) {
      toast.error("Password is required");
      return;
    }
    setSaving(true);
    try {
      if (modal === "add") {
        await API.post("/api/users/employees", form);
        toast.success("User added!");
      } else {
        await API.put(`/api/users/employees/${form.id}`, form);
        toast.success("User updated!");
      }
      setModal(null);
      setForm({
        full_name: "",
        email: "",
        phone: "",
        role: "employee",
        password: "",
      });
      fetchUsers();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error saving user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/api/users/employees/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const roles = ["All", "admin", "manager", "cashier", "employee", "customer"];

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    staff: users.filter((u) =>
      ["manager", "cashier", "employee"].includes(u.role),
    ).length,
    customers: users.filter((u) => u.role === "customer").length,
  };

  return (
    <div style={{ padding: 28, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 4,
            }}
          >
            👥 User Management
          </h2>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Manage all registered users and staff
          </p>
        </div>
        <button
          onClick={() => {
            setForm({
              full_name: "",
              email: "",
              phone: "",
              role: "employee",
              password: "",
            });
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
          + Add User
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
            "Total Users",
            stats.total,
            "#6366f1",
            "linear-gradient(135deg,#eef2ff,#e0e7ff)",
          ],
          [
            "Admins",
            stats.admins,
            "#dc2626",
            "linear-gradient(135deg,#fef2f2,#fee2e2)",
          ],
          [
            "Staff",
            stats.staff,
            "#16a34a",
            "linear-gradient(135deg,#f0fdf4,#dcfce7)",
          ],
          [
            "Customers",
            stats.customers,
            "#7c3aed",
            "linear-gradient(135deg,#f5f3ff,#ede9fe)",
          ],
        ].map(([l, v, c, bg]) => (
          <div
            key={l}
            style={{
              background: bg,
              borderRadius: 14,
              padding: "18px 20px",
              border: `1.5px solid ${c}22`,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#64748b",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              {l}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Search + Role filter */}
      <div
        style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search by name, email or role..."
          style={{
            flex: 1,
            minWidth: 200,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1.5px solid #e5e7eb",
            fontSize: 13,
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            style={{
              padding: "9px 16px",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              background:
                roleFilter === r
                  ? ROLE_COLORS[r]?.color || "#0f172a"
                  : "#f1f5f9",
              color: roleFilter === r ? "#fff" : "#374151",
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Debug info — remove after fixing */}
      {!loading && users.length === 0 && (
        <div
          style={{
            background: "#fef3c7",
            border: "1.5px solid #fcd34d",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 16,
            fontSize: 13,
            color: "#92400e",
          }}
        >
          ⚠️ No users returned from API. Check that{" "}
          <code>/api/users/employees</code> returns all users including those
          with role = 'customer'. You may need to update the backend to return
          all users.
        </div>
      )}

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
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
              {["User", "Email", "Phone", "Role", "Actions"].map((h) => (
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
                  colSpan={5}
                  style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}
                >
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}
                >
                  <div style={{ fontSize: 40, marginBottom: 10 }}>👤</div>
                  <p>
                    {users.length === 0
                      ? "No users in database yet"
                      : "No users match your search"}
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const rc = ROLE_COLORS[u.role] || ROLE_COLORS.employee;
                return (
                  <tr
                    key={u.id}
                    style={{ borderBottom: "1px solid #f8fafc" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#fafafa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 12,
                            background: `linear-gradient(135deg,${rc.color}22,${rc.color}11)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 14,
                            color: rc.color,
                            flexShrink: 0,
                          }}
                        >
                          {(u.full_name || u.email || "U")[0].toUpperCase()}
                        </div>
                        <strong style={{ color: "#0f172a" }}>
                          {u.full_name || "—"}
                        </strong>
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px", color: "#64748b" }}>
                      {u.email}
                    </td>
                    <td style={{ padding: "13px 16px", color: "#64748b" }}>
                      {u.phone || "—"}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: 99,
                          fontSize: 12,
                          fontWeight: 700,
                          background: rc.bg,
                          color: rc.color,
                          border: `1px solid ${rc.border}`,
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => {
                            setForm({ ...u, password: "" });
                            setModal("edit");
                          }}
                          style={{
                            padding: "5px 12px",
                            borderRadius: 7,
                            border: "1.5px solid #93c5fd",
                            background: "#dbeafe",
                            color: "#1d4ed8",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          style={{
                            padding: "5px 12px",
                            borderRadius: 7,
                            border: "1.5px solid #fca5a5",
                            background: "#fee2e2",
                            color: "#dc2626",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 32,
              width: "100%",
              maxWidth: 460,
              boxShadow: "0 8px 40px rgba(0,0,0,.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 22,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                {modal === "add" ? "+ Add New User" : "✏️ Edit User"}
              </h3>
              <button
                onClick={() => setModal(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                ✕
              </button>
            </div>
            {[
              ["full_name", "Full Name", "e.g. John Smith"],
              ["email", "Email", "user@email.com"],
              ["phone", "Phone", "+855 12 345 678"],
            ].map(([key, label, ph]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    display: "block",
                    marginBottom: 6,
                    color: "#374151",
                  }}
                >
                  {label}
                </label>
                <input
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={ph}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 9,
                    border: "1.5px solid #e5e7eb",
                    fontSize: 14,
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 6,
                  color: "#374151",
                }}
              >
                Role
              </label>
              <select
                value={form.role || "employee"}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 9,
                  border: "1.5px solid #e5e7eb",
                  fontSize: 14,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  outline: "none",
                }}
              >
                {["admin", "manager", "cashier", "employee", "customer"].map(
                  (r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 6,
                  color: "#374151",
                }}
              >
                Password{" "}
                {modal === "edit" && (
                  <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                    (leave blank to keep)
                  </span>
                )}
              </label>
              <input
                type="password"
                value={form.password || ""}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 9,
                  border: "1.5px solid #e5e7eb",
                  fontSize: 14,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg,#15803d,#22c55e)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: 14,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "⏳ Saving…" : "✅ Save"}
              </button>
              <button
                onClick={() => setModal(null)}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
