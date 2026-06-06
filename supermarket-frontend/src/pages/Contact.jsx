import { useState, useEffect, useRef } from 'react'

const info = [
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    title: 'Our Store', value: 'Russian Blvd, Phnom Penh', sub: 'Cambodia' },
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    title: 'Call Us', value: '+855 12 345 678', sub: 'Mon–Sun, 7AM–9PM' },
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    title: 'Email Us', value: 'limchheang@amsmart.kh', sub: 'We reply within 24h' },
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0272d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    title: 'Store Hours', value: 'Mon–Sun', sub: '7:00 AM – 9:00 PM' },
]

function useInView(threshold = 0.15) {
  const ref = useRef()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

export default function Contact() {
  const [heroRef, heroVisible]   = useInView(0.1)
  const [cardsRef, cardsVisible] = useInView(0.1)
  const [mapRef, mapVisible]     = useInView(0.1)

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8faf8', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet"/>

      <style>{`
        @keyframes fadeUp   { from { opacity:0; transform:translateY(40px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
        @keyframes slideLeft{ from { opacity:0; transform:translateX(-60px) } to { opacity:1; transform:translateX(0) } }
        @keyframes slideRight{from { opacity:0; transform:translateX(60px)  } to { opacity:1; transform:translateX(0) } }
        @keyframes scaleIn  { from { opacity:0; transform:scale(0.85) } to { opacity:1; transform:scale(1) } }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse    { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.8;transform:scale(1.08)} }
        @keyframes shimmer  { from{background-position:200% center} to{background-position:-200% center} }

        .contact-card {
          background: #fff;
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          border: 1px solid #e8f0e8;
          cursor: default;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease, border-color .3s;
          position: relative;
          overflow: hidden;
        }
        .contact-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #f0fdf4, #fff);
          opacity: 0;
          transition: opacity .3s;
        }
        .contact-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(22,163,74,.15);
          border-color: #86efac;
        }
        .contact-card:hover::before { opacity: 1; }
        .contact-card:hover .card-icon { animation: float 2s ease-in-out infinite; }

        .map-wrapper {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,.12);
          position: relative;
        }
        .map-wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          border: 2px solid rgba(22,163,74,.2);
          pointer-events: none;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #dcfce7;
          color: #15803d;
          border-radius: 999px;
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .3px;
        }

        .deco-ring {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(22,163,74,.15);
          animation: pulse 4s ease-in-out infinite;
        }

        .gradient-text {
          background: linear-gradient(135deg, #15803d 0%, #22c55e 50%, #16a34a 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .info-strip {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8f0e8;
          transition: transform .25s, box-shadow .25s;
        }
        .info-strip:hover {
          transform: translateX(6px);
          box-shadow: -4px 0 0 #22c55e, 0 4px 20px rgba(0,0,0,.06);
        }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background:'#F2FCF3', padding:'14px 0', borderBottom:'1px solid #e8e8e8' }}>
        <div className="container">
          <span style={{ fontSize:13, color:'#6b7280' }}>Home › <strong style={{ color:'#15803d' }}>Contact</strong></span>
        </div>
      </div>

      {/* Hero Section */}
      <div ref={heroRef} style={{ position:'relative', padding:'80px 20px 60px', textAlign:'center', overflow:'hidden' }}>
        {/* Decorative rings */}
        <div className="deco-ring" style={{ width:300, height:300, top:-80, right:-60, animationDelay:'.5s' }}/>
        <div className="deco-ring" style={{ width:200, height:200, bottom:-40, left:-40, animationDelay:'1.5s' }}/>
        <div className="deco-ring" style={{ width:150, height:150, top:'20%', left:'10%', animationDelay:'1s' }}/>

        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{
            opacity: heroVisible ? 1 : 0,
            animation: heroVisible ? 'fadeUp .7s ease forwards' : 'none',
            marginBottom: 16
          }}>
            <span className="badge-pill">
              <span style={{ width:7, height:7, background:'#22c55e', borderRadius:'50%', animation:'pulse 1.5s infinite' }}/>
              We're open today
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 16,
            opacity: heroVisible ? 1 : 0,
            animation: heroVisible ? 'fadeUp .7s ease .15s forwards' : 'none',
          }}>
            Visit
            <span className="gradient-text"> AMS Mart</span>
            <br/>Supermarket
          </h1>

          <p style={{
            fontSize: 17,
            color: '#6b7280',
            maxWidth: 480,
            margin: '0 auto',
            lineHeight: 1.7,
            opacity: heroVisible ? 1 : 0,
            animation: heroVisible ? 'fadeUp .7s ease .3s forwards' : 'none',
          }}>
            Your trusted supermarket in Phnom Penh. Quality groceries, everyday essentials, and a dedicated team serving you daily.
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div ref={cardsRef} className="container" style={{ padding:'0 20px 60px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:20 }}>
          {info.map(({ icon, title, value, sub }, i) => (
            <div key={title} className="contact-card" style={{
              opacity: cardsVisible ? 1 : 0,
              animation: cardsVisible ? `scaleIn .6s ease ${i * .1 + .1}s forwards` : 'none',
            }}>
              <div className="card-icon" style={{ fontSize:36, marginBottom:14, display:'block' }}>{icon}</div>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:1.5, color:'#9ca3af', textTransform:'uppercase', marginBottom:6 }}>{title}</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#111827', marginBottom:4, position:'relative', zIndex:1 }}>{value}</div>
              <div style={{ fontSize:13, color:'#9ca3af', position:'relative', zIndex:1 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Map + Info side by side */}
      <div className="container" style={{ padding:'0 20px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 420px', gap:32, alignItems:'start' }}>

          {/* Map */}
          <div ref={mapRef} className="map-wrapper" style={{
            opacity: mapVisible ? 1 : 0,
            animation: mapVisible ? 'slideLeft .8s ease forwards' : 'none',
          }}>
            <div style={{ position:'relative', width:'100%', height:420 }}>
            <iframe
              title="AMS Mart Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.3!2d104.8955108!3d11.5703975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109517388680e15%3A0x63057e6682968f5!2sInstitute%20of%20Technology%20of%20Cambodia!5e0!3m2!1sen!2skh!4v1717000000000!5m2!1sen!2skh"
              width="100%" height="420" style={{ border:0, display:'block' }}
              allowFullScreen="" loading="lazy"
            />
            <div style={{
              position:'absolute', top:'50%', left:'50%',
              transform:'translate(-50%, -100%)',
              pointerEvents:'none', zIndex:10,
              display:'flex', flexDirection:'column', alignItems:'center'
            }}>
              <div style={{
                width:28, height:28, background:'#dc2626', borderRadius:'50% 50% 50% 0',
                transform:'rotate(-45deg)', boxShadow:'0 4px 20px rgba(220,38,38,.6)',
                border:'3px solid #fff', animation:'pulse 1.5s ease-in-out infinite'
              }}/>
              <div style={{
                width:8, height:8, background:'#dc2626', borderRadius:'50%',
                marginTop:4, boxShadow:'0 2px 8px rgba(220,38,38,.4)'
              }}/>
              <div style={{
                background:'#dc2626', color:'#fff', fontSize:11, fontWeight:700,
                padding:'4px 10px', borderRadius:6, marginTop:6, whiteSpace:'nowrap',
                boxShadow:'0 2px 12px rgba(220,38,38,.4)',
                letterSpacing:.5
              }}>📍 AMS Mart — ITC</div>
            </div>
          </div>
          </div>

          {/* Side info */}
          <div style={{
            opacity: mapVisible ? 1 : 0,
            animation: mapVisible ? 'slideRight .8s ease .2s forwards' : 'none',
          }}>
            <div style={{ marginBottom:28 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, marginBottom:8, color:'#111827' }}>
                Find Us Here
              </h2>
              <p style={{ color:'#6b7280', fontSize:14, lineHeight:1.7 }}>
                Located in the heart of Phnom Penh. Easy parking available and close to public transport.
              </p>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:32 }}>
              {[
                { label:'Address',  val:'Russian Blvd, Phnom Penh' },
                { label:'Phone',    val:'+855 12 345 678' },
                { label:'Email',    val:'limchheang@amsmart.kh' },
                { label:'Hours',    val:'Mon–Sun: 7:00 AM – 9:00 PM' },
              ].map(({ label, val }) => (
                <div key={label} className="info-strip">
                  <div style={{ fontSize:12, fontWeight:700, color:'#9ca3af', textTransform:'uppercase',
                    letterSpacing:1, minWidth:56 }}>{label}</div>
                  <div style={{ width:1, height:28, background:'#e5e7eb' }}/>
                  <div style={{ fontSize:14, fontWeight:500, color:'#111827' }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Department contacts */}
            <div style={{ background:'#f0fdf4', borderRadius:16, padding:20, border:'1px solid #bbf7d0' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#15803d', marginBottom:14,
                textTransform:'uppercase', letterSpacing:1 }}>Department Contacts</div>
              {[
                { dept:'Customer Service', phone:'+855 12 345 679' },
                { dept:'Wholesale Orders', phone:'+855 12 345 680' },
                { dept:'HR & Careers',     phone:'+855 12 345 681' },
              ].map(({ dept, phone }) => (
                <div key={dept} style={{ display:'flex', justifyContent:'space-between',
                  alignItems:'center', padding:'8px 0', borderBottom:'1px solid #dcfce7' }}>
                  <span style={{ fontSize:13, color:'#374151' }}>{dept}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:'#16a34a' }}>{phone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom banner */}
      <div style={{ background:'linear-gradient(135deg, #0f172a, #1e293b)', padding:'48px 20px', textAlign:'center' }}>
        <div className="container">
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:'#fff',
            fontWeight:700, marginBottom:10 }}>AMS Mart — Quality You Can Trust</h3>
          <p style={{ color:'rgba(255,255,255,.8)', fontSize:15, marginBottom:0 }}>
            Institute of Technology of Cambodia area, Phnom Penh. Open every day 7:00 AM – 9:00 PM.
          </p>
        </div>
      </div>
    </div>
  )
}
