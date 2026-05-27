import { useState, useEffect } from "react";
import API from "../../services/api";

const ROLES = ["admin", "manager", "cashier", "employee"];
const roleColor = {
  admin: "#EA4B48",
  manager: "#3b82f6",
  cashier: "#00B207",
  employee: "#FF8C00",
};

export default function AdminUsers() {
  const [tab, setTab] = useState("employees");
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [modal, setModal] = useState(null); // { type: 'add'|'edit', data }
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [empRes, custRes] = await Promise.all([
        API.get("/api/users/employees"),
        API.get("/api/users/customers"),
      ]);
      setEmployees(empRes.data);
      setCustomers(custRes.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => setModal({ type: "add", data: {} });
  const openEdit = (item) => {
    setForm(item);
    setModal({ type: "edit", data: item });
  };

  const handleSave = async () => {
    try {
      if (tab === "employees") {
        if (modal.type === "add") await API.post("/api/users/employees", form);
        else await API.put(`/api/users/employees/${form.id}`, form);
      } else {
        if (modal.type === "add") await API.post("/api/users/customers", form);
        else await API.put(`/api/users/customers/${form.Customer_ID}`, form);
      }
      setModal(null);
      setForm({});
      fetchAll();
    } catch (e) {
      alert(e.response?.data?.detail || "Error saving");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;
    try {
      if (tab === "employees") await API.delete(`/api/users/employees/${id}`);
      else await API.delete(`/api/users/customers/${id}`);
      fetchAll();
    } catch {}
  };

  const filteredEmployees = employees.filter(
    (e) =>
      e.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredCustomers = customers.filter((c) =>
    `${c.First_Name} ${c.Last_Name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

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
          👥 User Management
        </h2>
        <button
          onClick={openAdd}
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
          + Add {tab === "employees" ? "Employee" : "Customer"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["employees", "customers"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setSearch("");
            }}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              textTransform: "capitalize",
              background: tab === t ? "#00B207" : "#f0f0f0",
              color: tab === t ? "#fff" : "#555",
            }}
          >
            {t} ({t === "employees" ? employees.length : customers.length})
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search by name or email..."
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

      {/* Employees Table */}
      {tab === "employees" && (
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
                style={{
                  background: "#f8f8f8",
                  borderBottom: "2px solid #eee",
                }}
              >
                {["Name", "Email", "Phone", "Role", "Actions"].map((h) => (
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
                    colSpan={5}
                    style={{ padding: 40, textAlign: "center", color: "#888" }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ padding: 40, textAlign: "center", color: "#888" }}
                  >
                    No employees found
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    style={{ borderBottom: "1px solid #f5f5f5" }}
                  >
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                      {emp.full_name}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#666" }}>
                      {emp.email}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#666" }}>
                      {emp.phone || "-"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                          background: (roleColor[emp.role] || "#888") + "20",
                          color: roleColor[emp.role] || "#888",
                        }}
                      >
                        {emp.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        onClick={() => {
                          setForm(emp);
                          openEdit(emp);
                        }}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 6,
                          border: "1px solid #ddd",
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: 12,
                          marginRight: 6,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 6,
                          border: "none",
                          background: "#EA4B48",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Customers Table */}
      {tab === "customers" && (
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
                style={{
                  background: "#f8f8f8",
                  borderBottom: "2px solid #eee",
                }}
              >
                {[
                  "ID",
                  "First Name",
                  "Last Name",
                  "Loyalty Points",
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
                    colSpan={6}
                    style={{ padding: 40, textAlign: "center", color: "#888" }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ padding: 40, textAlign: "center", color: "#888" }}
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr
                    key={c.Customer_ID}
                    style={{ borderBottom: "1px solid #f5f5f5" }}
                  >
                    <td style={{ padding: "12px 16px", color: "#888" }}>
                      #{c.Customer_ID}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                      {c.First_Name}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                      {c.Last_Name}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ color: "#3b82f6", fontWeight: 700 }}>
                        ⭐ {c.Loyalty_Points || 0}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#888" }}>
                      {c.Join_Day}/{c.Join_Month}/{c.Join_Year}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        onClick={() => {
                          setForm(c);
                          openEdit(c);
                        }}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 6,
                          border: "1px solid #ddd",
                          background: "#fff",
                          cursor: "pointer",
                          fontSize: 12,
                          marginRight: 6,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.Customer_ID)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 6,
                          border: "none",
                          background: "#EA4B48",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

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
              width: 420,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3
              style={{
                fontFamily: "'Josefin Sans',sans-serif",
                marginBottom: 20,
              }}
            >
              {modal.type === "add" ? "+ Add" : "✏️ Edit"}{" "}
              {tab === "employees" ? "Employee" : "Customer"}
            </h3>
            {tab === "employees" ? (
              <>
                {[
                  ["full_name", "Full Name"],
                  ["email", "Email"],
                  ["phone", "Phone"],
                ].map(([key, label]) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      {label}
                    </label>
                    <input
                      value={form[key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "1px solid #ddd",
                        fontSize: 13,
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      display: "block",
                      marginBottom: 6,
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
                      borderRadius: 8,
                      border: "1px solid #ddd",
                      fontSize: 13,
                    }}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
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
                    Password{" "}
                    {modal.type === "edit" && (
                      <span style={{ color: "#888", fontWeight: 400 }}>
                        (leave blank to keep)
                      </span>
                    )}
                  </label>
                  <input
                    type="password"
                    value={form.password || ""}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                      fontSize: 13,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                {[
                  ["First_Name", "First Name"],
                  ["Last_Name", "Last Name"],
                ].map(([key, label]) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      {label}
                    </label>
                    <input
                      value={form[key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "1px solid #ddd",
                        fontSize: 13,
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  {[
                    ["Join_Day", "Day"],
                    ["Join_Month", "Month"],
                    ["Join_Year", "Year"],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        {label}
                      </label>
                      <input
                        type="number"
                        value={form[key] || ""}
                        onChange={(e) =>
                          setForm({ ...form, [key]: parseInt(e.target.value) })
                        }
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: 8,
                          border: "1px solid #ddd",
                          fontSize: 13,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleSave}
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
                Save
              </button>
              <button
                onClick={() => {
                  setModal(null);
                  setForm({});
                }}
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
