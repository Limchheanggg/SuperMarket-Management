import { useState, useEffect, useRef } from "react";
import API from "../services/api";

function useInView(threshold = 0.15) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Counter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const num = parseInt(target.replace(/\D/g, ""));
    const step = num / (duration / 16);
    let cur = 0;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= num) {
        setCount(num);
        clearInterval(timer);
      } else setCount(Math.floor(cur));
    }, 16);
    return () => clearInterval(timer);
  }, [started]);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const team = [
  {
    init: "CL",
    name: "CHHAY Lyveng",
    role: "Database Design",
    id: "e20230135",
    color: "#c0272d",
    photo: "https://supermarket-management-production-d071.up.railway.app/static/images/ChhayLyveng.jpg",
  },
  {
    init: "KL",
    name: "KHUN Limchheang",
    role: "Core System",
    id: "e20230393",
    color: "#1d4ed8",
    photo: "https://supermarket-management-production-d071.up.railway.app/static/images/KhunLimchheang.jpg",
  },
  {
    init: "HH",
    name: "HORN Hengveasna",
    role: "Testing & Documentation",
    id: "e20230754",
    color: "#15803d",
    photo: "https://supermarket-management-production-d071.up.railway.app/static/images/HornHengVesana.jpg",
  },
  {
    init: "KV",
    name: "KHEAN Visal",
    role: "Supervisor",
    id: "Professor",
    color: "#7c3aed",
    photo: "https://supermarket-management-production-d071.up.railway.app/static/images/KheanVisal.png",
  },
];

const [stats, setStats] = useState([
  { value: "...", suffix: "", label: "Products", icon: "📦" },
  { value: "12", suffix: "", label: "Categories", icon: "🗂️" },
  { value: "12", suffix: "", label: "Suppliers", icon: "🚚" },
  { value: "2026", suffix: "", label: "Founded", icon: "📅" },
]);
useEffect(() => {
  API.get('/api/products/').then(res => {
    const count = res.data?.length || 0;
    setStats(s => s.map(item => item.label === "Products" ? {...item, value: String(count)} : item));
  }).catch(() => {
    setStats(s => s.map(item => item.label === "Products" ? {...item, value: "148"} : item));
  });
}, []);

const values = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    title: "100% Fresh",
    desc: "Every product sourced directly from certified Cambodian farms daily.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#c0272d"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    color: "#c0272d",
    bg: "#fff0f0",
    border: "#fecaca",
    title: "Fair Pricing",
    desc: "We work directly with farmers to bring you the best prices possible.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6366f1"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    color: "#6366f1",
    bg: "#eef2ff",
    border: "#c7d2fe",
    title: "Fast Service",
    desc: "Efficient checkout and in-store experience powered by our smart system.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#d97706"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="1" fill="#d97706" />
      </svg>
    ),
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    title: "Trusted Quality",
    desc: "Rigorous quality checks on every product before it reaches our shelves.",
  },
];

const stats = [
  { value: "148", suffix: "", label: "Products", icon: "📦" },
  { value: "12", suffix: "", label: "Categories", icon: "🗂️" },
  { value: "12", suffix: "", label: "Suppliers", icon: "🚚" },
  { value: "2026", suffix: "", label: "Founded", icon: "📅" },
];
export default function About() {
  const [heroRef, heroVisible] = useInView(0.1);
  const [missionRef, missionVisible] = useInView(0.1);
  const [valuesRef, valuesVisible] = useInView(0.1);
  const [teamRef, teamVisible] = useInView(0.1);

  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        background: "#f8f8f8",
        minHeight: "100vh",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Playfair+Display:wght@700;900&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(50px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft  { from{opacity:0;transform:translateX(-60px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeRight { from{opacity:0;transform:translateX(60px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn   { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        @keyframes float     { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-16px) rotate(2deg)} }
        @keyframes pulse2    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes shimmer   { from{background-position:200% center} to{background-position:-200% center} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes heroGrad  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

        .team-card {
          background:#fff; border-radius:20px; padding:32px 20px; text-align:center;
          border:1px solid #e8e8e8; position:relative; overflow:hidden;
          transition:transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s;
        }
        .team-card:hover { transform:translateY(-12px) scale(1.02); box-shadow:0 24px 60px rgba(0,0,0,.12); }
        .team-card::before {
          content:''; position:absolute; top:-40px; right:-40px;
          width:100px; height:100px; border-radius:50%;
          background:var(--card-color); opacity:.08;
          transition:transform .4s;
        }
        .team-card:hover::before { transform:scale(2.5); }

        .value-card {
          background:#fff; border-radius:16px; padding:28px 24px;
          border:1px solid #eee; position:relative; overflow:hidden;
          transition:transform .3s, box-shadow .3s, border-color .3s;
        }
        .value-card:hover {
          transform:translateY(-6px);
          box-shadow:0 16px 40px rgba(192,39,45,.1);
          border-color:#fca5a5;
        }
        .value-icon {
          font-size:36px; margin-bottom:14px; display:block;
          transition:transform .3s;
        }
        .value-card:hover .value-icon { transform:scale(1.2) rotate(5deg); }

        .stat-box {
          background:rgba(255,255,255,.12); border-radius:16px; padding:24px 16px;
          text-align:center; border:1px solid rgba(255,255,255,.2);
          backdrop-filter:blur(10px);
          transition:transform .3s, background .3s;
        }
        .stat-box:hover { transform:translateY(-6px); background:rgba(255,255,255,.2); }
      `}</style>

      {/* Hero */}
      <div
        ref={heroRef}
        style={{
          background:
            "linear-gradient(135deg, #c0272d 0%, #9b1c1c 40%, #1e1b4b 100%)",
          backgroundSize: "200% 200%",
          animation: "heroGrad 8s ease infinite",
          padding: "100px 20px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -60,
            left: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,.1)",
            animation: "spin-slow 20s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -40,
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,.08)",
            animation: "spin-slow 30s linear infinite reverse",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "5%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,.05)",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,.15)",
              borderRadius: 999,
              padding: "6px 20px",
              fontSize: 13,
              color: "rgba(255,255,255,.9)",
              fontWeight: 600,
              letterSpacing: 1,
              marginBottom: 24,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,.2)",
              opacity: heroVisible ? 1 : 0,
              animation: heroVisible ? "fadeUp .6s ease forwards" : "none",
            }}
          >
            🛒 Cambodia's Trusted Supermarket
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(40px,7vw,72px)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: 16,
              opacity: heroVisible ? 1 : 0,
              animation: heroVisible ? "fadeUp .7s ease .15s forwards" : "none",
            }}
          >
            About{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#fca5a5,#fde68a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AMS Mart
            </span>
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,.75)",
              maxWidth: 520,
              margin: "0 auto 48px",
              lineHeight: 1.7,
              fontWeight: 300,
              opacity: heroVisible ? 1 : 0,
              animation: heroVisible ? "fadeUp .7s ease .3s forwards" : "none",
            }}
          >
            A supermarket management system built by students of the Institute
            of Technology of Cambodia, designed for real-world retail
            operations.
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 16,
              maxWidth: 700,
              margin: "0 auto",
              opacity: heroVisible ? 1 : 0,
              animation: heroVisible ? "fadeUp .7s ease .45s forwards" : "none",
            }}
          >
            {stats.map(({ value, suffix, label, icon }) => (
              <div key={label} className="stat-box">
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: 2,
                  }}
                >
                  <Counter target={value} suffix={suffix} />
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,.65)",
                    fontWeight: 500,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div
        ref={missionRef}
        className="container"
        style={{ padding: "80px 20px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
        >
          <div
            style={{
              opacity: missionVisible ? 1 : 0,
              animation: missionVisible ? "fadeLeft .8s ease forwards" : "none",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                color: "#c0272d",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Our Story
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: 20,
                color: "#111",
              }}
            >
              Built for Cambodia,
              <br />
              <span style={{ color: "#c0272d" }}>By Cambodians</span>
            </h2>
            <p
              style={{
                color: "#6b7280",
                lineHeight: 1.9,
                marginBottom: 16,
                fontSize: 15,
              }}
            >
              AMS Mart is a full-stack supermarket management system developed
              as a group project at the Institute of Technology of Cambodia. It
              combines a FastAPI backend, MySQL database, and React frontend to
              simulate a real-world retail operation.
            </p>
            <p style={{ color: "#6b7280", lineHeight: 1.9, fontSize: 15 }}>
              From inventory tracking and sales management to customer
              membership and supplier coordination — every feature reflects real
              supermarket workflows used across Cambodia.
            </p>

            <div style={{ display: "flex", gap: 16, marginTop: 28 }}>
              {[
                ["🎓", "ITC Project"],
                ["⚡", "FastAPI + React"],
                ["🗄️", "MySQL"],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: "8px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  <span>{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Visual card */}
          <div
            style={{
              opacity: missionVisible ? 1 : 0,
              animation: missionVisible
                ? "fadeRight .8s ease .2s forwards"
                : "none",
            }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #c0272d, #9b1c1c)",
                  borderRadius: 24,
                  padding: 48,
                  textAlign: "center",
                  color: "#fff",
                  boxShadow: "0 20px 60px rgba(192,39,45,.3)",
                }}
              >
                <div
                  style={{
                    fontSize: 80,
                    animation: "float 4s ease-in-out infinite",
                  }}
                >
                  🛒
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 22,
                    margin: "20px 0 10px",
                    fontWeight: 700,
                  }}
                >
                  Full-Stack Supermarket
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,.8)",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  End-to-end retail management from products and inventory to
                  sales, membership, and reporting.
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 12,
                    marginTop: 24,
                  }}
                >
                  {["FastAPI", "MySQL", "React"].map((t) => (
                    <span
                      key={t}
                      style={{
                        background: "rgba(255,255,255,.15)",
                        borderRadius: 999,
                        padding: "4px 14px",
                        fontSize: 12,
                        fontWeight: 600,
                        border: "1px solid rgba(255,255,255,.2)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {/* Floating badge */}
              <div
                style={{
                  position: "absolute",
                  top: -16,
                  right: -16,
                  background: "#fff",
                  borderRadius: 16,
                  padding: "12px 16px",
                  boxShadow: "0 8px 24px rgba(0,0,0,.12)",
                  animation: "pulse2 3s ease-in-out infinite",
                }}
              >
                <div
                  style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}
                >
                  BUILT AT
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
                  ITC Cambodia
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div ref={valuesRef} style={{ background: "#fff", padding: "80px 20px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                color: "#c0272d",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              What We Stand For
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 36,
                fontWeight: 700,
                color: "#111",
                margin: 0,
              }}
            >
              Our Core Values
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 20,
            }}
          >
            {values.map(({ icon, title, desc, color, bg, border }, i) => (
              <div
                key={title}
                className="value-card"
                style={{
                  opacity: valuesVisible ? 1 : 0,
                  animation: valuesVisible
                    ? `fadeUp .6s ease ${i * 0.1 + 0.1}s forwards`
                    : "none",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: bg,
                    border: `1.5px solid ${border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    transition: "transform .3s",
                  }}
                >
                  {icon}
                </div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    marginBottom: 10,
                    color: "#111",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div
        ref={teamRef}
        style={{ background: "#f8f8f8", padding: "80px 20px" }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                color: "#c0272d",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              The People Behind It
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 36,
                fontWeight: 700,
                color: "#111",
                margin: 0,
              }}
            >
              Meet the <span style={{ color: "#c0272d" }}>Team</span>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 24,
            }}
          >
            {team.map(({ init, name, role, id, color, photo }, i) => (
              <div
                key={name}
                className="team-card"
                style={{
                  "--card-color": color,
                  opacity: teamVisible ? 1 : 0,
                  animation: teamVisible
                    ? `scaleIn .6s ease ${i * 0.12 + 0.1}s forwards`
                    : "none",
                }}
              >
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    margin: "0 auto 16px",
                    overflow: "hidden",
                    boxShadow: `0 8px 24px ${color}55`,
                    border: `3px solid ${color}44`,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <img
                    src={photo}
                    alt={name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                    }}
                  />
                </div>
                <h4
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    marginBottom: 6,
                    color: "#111",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {name}
                </h4>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: color,
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {role}
                </p>
                <small
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {id}
                </small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom banner */}
      <div
        style={{
          background: "linear-gradient(135deg,#0f172a,#1e293b)",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h3
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 30,
              color: "#fff",
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Supermarket Management System
          </h3>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 15, margin: 0 }}>
            AMS Mart — Institute of Technology of Cambodia · Group 3 · 2025
          </p>
        </div>
      </div>
    </div>
  );
}
