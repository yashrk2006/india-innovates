import { useState, useEffect, useRef } from "react";

/* ── FONTS ─────────────────────────────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=DM+Mono:wght@300;400;500&family=Literata:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    :root{
      --bg:#08090f; --bg2:#0d0f1a; --bg3:#111520; --bg4:#161b28;
      --gold:#c9a84c; --gold2:#e8c56a; --goldd:rgba(201,168,76,0.12);
      --cream:#f0ece3; --cream2:rgba(240,236,227,0.65); --cream3:rgba(240,236,227,0.25); --cream4:rgba(240,236,227,0.07);
      --red:#9f1239; --red2:#be123c; --redb:rgba(159,18,57,0.15);
      --saf:#e8761a; --safb:rgba(232,118,26,0.12);
      --grn:#15803d; --grnb:rgba(21,128,61,0.12);
      --amb:#d97706; --ambb:rgba(217,119,6,0.12);
      --border:rgba(201,168,76,0.14); --border2:rgba(255,255,255,0.05);
      --danger:#ef4444;
    }
    body{background:var(--bg);color:var(--cream);font-family:'Literata',serif;}
    ::-webkit-scrollbar{width:4px;height:4px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px;}
    .mono{font-family:'DM Mono',monospace;}
    .serif{font-family:'Playfair Display',serif;}
    .fade-up{animation:fu .45s cubic-bezier(.22,1,.36,1) both;}
    @keyframes fu{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
    .s1{animation-delay:.05s} .s2{animation-delay:.1s} .s3{animation-delay:.15s}
    .s4{animation-delay:.2s}  .s5{animation-delay:.25s} .s6{animation-delay:.3s}
    .s7{animation-delay:.35s} .s8{animation-delay:.4s}
    .pulse-dot{animation:pdot 2s infinite;}
    @keyframes pdot{0%,100%{opacity:1;box-shadow:0 0 0 0 currentColor;}50%{opacity:.5;box-shadow:0 0 0 4px transparent;}}
    .shimmer{background:linear-gradient(90deg,var(--bg3) 25%,var(--bg4) 50%,var(--bg3) 75%);background-size:200% 100%;animation:shim 1.6s infinite;}
    @keyframes shim{0%{background-position:200% 0;}100%{background-position:-200% 0;}}
    .bar-grow{animation:bg 1.1s cubic-bezier(.22,.68,0,1.2) both;}
    @keyframes bg{from{transform:scaleX(0);}to{transform:scaleX(1);}}
    .count-up{animation:cu 1.4s cubic-bezier(.22,1,.36,1) both;}
    .nav-item{display:flex;align-items:center;gap:10px;padding:8px 14px;border-radius:3px;cursor:pointer;transition:all .18s;color:var(--cream3);font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.5px;border-left:2px solid transparent;user-select:none;}
    .nav-item:hover{color:var(--cream2);background:var(--cream4);border-left-color:var(--border);}
    .nav-item.active{color:var(--gold);background:var(--goldd);border-left-color:var(--gold);}
    .nav-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--cream3);padding:12px 14px 5px;}
    .card{background:var(--bg3);border:1px solid var(--border);border-radius:3px;padding:18px;}
    .card-sm{background:var(--bg3);border:1px solid var(--border2);border-radius:3px;padding:13px 15px;}
    .kpi-card{background:var(--bg3);border:1px solid var(--border);border-radius:3px;padding:16px 18px;position:relative;overflow:hidden;}
    .kpi-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),transparent);}
    .btn{font-family:'DM Mono',monospace;letter-spacing:1px;text-transform:uppercase;border-radius:2px;cursor:pointer;transition:all .18s;font-size:10px;}
    .btn-gold{background:var(--goldd);border:1px solid var(--gold);color:var(--gold);padding:7px 16px;}
    .btn-gold:hover{background:var(--gold);color:var(--bg);}
    .btn-red{background:var(--redb);border:1px solid var(--red2);color:#fb7185;padding:7px 16px;}
    .btn-red:hover{background:var(--red2);color:#fff;}
    .btn-ghost{background:transparent;border:1px solid var(--border);color:var(--cream3);padding:7px 16px;}
    .btn-ghost:hover{border-color:var(--gold);color:var(--gold);}
    .btn-grn{background:var(--grnb);border:1px solid var(--grn);color:#4ade80;padding:7px 16px;}
    .btn-grn:hover{background:var(--grn);color:#fff;}
    .badge{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:2px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;font-weight:500;}
    .tag-red{background:var(--redb);color:#fb7185;border:1px solid rgba(159,18,57,.3);}
    .tag-grn{background:var(--grnb);color:#4ade80;border:1px solid rgba(21,128,61,.3);}
    .tag-amb{background:var(--ambb);color:#fbbf24;border:1px solid rgba(217,119,6,.3);}
    .tag-gold{background:var(--goldd);color:var(--gold);border:1px solid var(--border);}
    .tag-saf{background:var(--safb);color:#fb923c;border:1px solid rgba(232,118,26,.3);}
    .divider{height:1px;background:var(--border2);margin:14px 0;}
    .row{display:flex;gap:12px;flex-wrap:wrap;}
    .table-row{display:grid;padding:11px 14px;border-bottom:1px solid var(--border2);transition:all .15s;cursor:pointer;}
    .table-row:hover{background:var(--cream4);}
    .section-title{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);margin-bottom:14px;display:flex;align-items:center;gap:8px;}
    .input{background:var(--bg2);border:1px solid var(--border2);border-radius:2px;padding:9px 13px;color:var(--cream);font-family:'DM Mono',monospace;font-size:11px;width:100%;outline:none;transition:border-color .2s;}
    .input:focus{border-color:var(--gold);}
    .toggle{width:36px;height:20px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;position:relative;cursor:pointer;transition:background .2s;}
    .toggle.on{background:var(--grn);border-color:var(--grn);}
    .toggle-thumb{width:14px;height:14px;background:#fff;border-radius:50%;position:absolute;top:2px;left:2px;transition:transform .2s;}
    .toggle.on .toggle-thumb{transform:translateX(16px);}
    .progress-bar{height:4px;background:var(--border2);border-radius:2px;overflow:hidden;}
    .progress-fill{height:100%;border-radius:2px;transform-origin:left;transition:transform 1s cubic-bezier(.22,.68,0,1.2);}
    .drawer{position:fixed;top:0;right:0;height:100%;width:420px;background:var(--bg2);border-left:1px solid var(--border);z-index:100;overflow-y:auto;transform:translateX(100%);transition:transform .32s cubic-bezier(.34,1.56,.64,1);}
    .drawer.open{transform:translateX(0);}
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:99;opacity:0;pointer-events:none;transition:opacity .3s;}
    .overlay.show{opacity:1;pointer-events:all;}
    .modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:200;}
    .modal-card{background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:32px;max-width:460px;width:90%;animation:fu .3s both;}
    .tab{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;border-radius:2px;cursor:pointer;background:transparent;border:1px solid var(--border2);color:var(--cream3);transition:all .18s;}
    .tab.active{background:var(--goldd);border-color:var(--gold);color:var(--gold);}
    .mini-chart{display:flex;align-items:flex-end;gap:2px;height:28px;}
    .mini-bar{width:5px;border-radius:1px;background:var(--gold);opacity:.5;transition:opacity .2s;}
    .mini-bar:hover{opacity:1;}
  `}</style>
);

/* ── SVG ICONS ─────────────────────────────────────────────── */
const I = ({ n, s = 14, c = "currentColor" }) => {
  const d = {
    dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    activity: "M22 12h-4l-3 9L9 3l-3 9H2",
    users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
    lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
    search: "M11 17a6 6 0 100-12 6 6 0 000 12z M21 21l-4.35-4.35",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 100-6 3 3 0 000 6",
    power: "M18.36 6.64a9 9 0 11-12.73 0 M12 2v10",
    download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
    list: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
    flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
    cpu: "M18 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z M9 9h6v6H9z",
    database: "M12 2a9 3 0 110 6A9 3 0 0112 2z M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12 M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5",
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    map: "M1 6l7-3 8 3 7-3v15l-7 3-8-3-7 3V6z M8 3v15 M16 6v15",
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18 M6 6l12 12",
    chevron_right: "M9 18l6-6-6-6",
    chevron_down: "M6 9l6 6 6-6",
    filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    plus: "M12 5v14 M5 12h14",
    more: "M12 13a1 1 0 100-2 1 1 0 000 2z M19 13a1 1 0 100-2 1 1 0 000 2z M5 13a1 1 0 100-2 1 1 0 000 2z",
    logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
    trending_up: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
    file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    send: "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z",
    refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15",
    globe: "M12 2a10 10 0 110 20A10 10 0 0112 2z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
    key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
    info: "M12 22a10 10 0 110-20 10 10 0 010 20z M12 8h.01 M12 12v4",
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {d[n]?.split(" M").map((seg, i) => <path key={i} d={i === 0 ? seg : "M" + seg} />)}
    </svg>
  );
};

/* ── MINI SPARKLINE ─────────────────────────────────────────── */
const Spark = ({ data, color = "var(--gold)", h = 32 }) => {
  const w = 80, max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={pts.split(" ").at(-1)?.split(",")[0]} cy={pts.split(" ").at(-1)?.split(",")[1]} r="2.5" fill={color} />
    </svg>
  );
};

/* ── LINE CHART ─────────────────────────────────────────────── */
const LineChart = ({ data, color = "var(--gold)", h = 80, labels }) => {
  const w = 100, max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w}%,${h - ((v - min) / (max - min || 1)) * (h - 10) - 5}`);
  const area = `0,${h} ${pts.join(" ")} 100%,${h}`;
  return (
    <div style={{ position: "relative" }}>
      <svg width="100%" height={h} viewBox={`0 0 100 ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`g${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity=".25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill={`url(#g${color})`} />
        <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      {labels && (
        <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--cream3)", marginTop: 4 }}>
          {labels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      )}
    </div>
  );
};

/* ── PROGRESS BAR ───────────────────────────────────────────── */
const Bar = ({ pct, color = "var(--gold)", h = 4 }) => (
  <div className="progress-bar" style={{ height: h }}>
    <div className="progress-fill bar-grow" style={{ width: `${pct}%`, background: color, height: h }} />
  </div>
);

/* ── KPI CARD ───────────────────────────────────────────────── */
const KPI = ({ icon, label, value, sub, trend, spark, color = "var(--gold)" }) => {
  const [v, setV] = useState(0);
  useEffect(() => { const t = setTimeout(() => setV(1), 100); return () => clearTimeout(t); }, []);
  return (
    <div className="kpi-card fade-up" style={{ flex: 1, minWidth: 140 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="mono" style={{ fontSize: 9, letterSpacing: 2, color: "var(--cream3)", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
          <div className="serif" style={{ fontSize: 28, fontWeight: 700, color: "var(--cream)", lineHeight: 1 }}>{value}</div>
          {sub && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
              {trend && <I n={trend === "up" ? "trending_up" : "chevron_down"} s={10} c={trend === "up" ? "#4ade80" : "#f87171"} />}
              <span className="mono" style={{ fontSize: 9, color: trend === "up" ? "#4ade80" : trend === "down" ? "#f87171" : "var(--cream3)" }}>{sub}</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 3, background: color + "18", border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I n={icon} s={14} c={color} />
          </div>
          {spark && <Spark data={spark} color={color} />}
        </div>
      </div>
    </div>
  );
};

/* ── SECTION WRAPPER ────────────────────────────────────────── */
const Section = ({ title, children, action, icon }) => (
  <div className="fade-up">
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon && <I n={icon} s={13} c="var(--gold)" />}
        <span className="mono" style={{ fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--gold)" }}>{title}</span>
      </div>
      {action && <button className="btn btn-ghost" style={{ fontSize: 9 }}>{action}</button>}
    </div>
    {children}
  </div>
);

/* ══════════════════════════════════════════════════════════════
   PAGE: SYSTEM OVERVIEW
══════════════════════════════════════════════════════════════ */
const PageOverview = () => {
  const events = [
    { time: "14:32:01", user: "CONST_UP14", action: "Campaign approved and dispatched", risk: "low" },
    { time: "14:28:44", user: "BTH_DL04",   action: "ANOMALY — 50 change requests in 60 min", risk: "high" },
    { time: "14:21:19", user: "ST_MH",      action: "New state admin account activated", risk: "low" },
    { time: "14:15:03", user: "CONST_RJ7",  action: "Content moderation flag raised", risk: "med" },
    { time: "14:09:55", user: "GOV_TN02",   action: "Scheme dataset sync completed", risk: "low" },
    { time: "14:01:12", user: "BTH_UP22",   action: "Photo GPS metadata mismatch", risk: "med" },
    { time: "13:58:44", user: "PARTY_A",    action: "National campaign theme updated", risk: "low" },
    { time: "13:44:02", user: "ECI_01",     action: "Oversight session started", risk: "low" },
  ];
  const services = [
    { name: "API Gateway",        latency: "28ms",  status: "ok" },
    { name: "Notification Queue", latency: "11ms",  status: "ok" },
    { name: "AI Inference",       latency: "420ms", status: "warn" },
    { name: "Graph Database",     latency: "45ms",  status: "ok" },
    { name: "Auth Service",       latency: "18ms",  status: "ok" },
    { name: "CDN / Storage",      latency: "9ms",   status: "ok" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* KPIs */}
      <div className="row">
        <KPI icon="users"      label="Active Users"    value="1,284" sub="+43 today"        trend="up"   spark={[900,950,1000,980,1100,1200,1284]} color="var(--gold)" />
        <KPI icon="zap"        label="Live Campaigns"  value="47"    sub="8 states"                      spark={[30,38,42,40,45,44,47]}           color="var(--saf)" />
        <KPI icon="activity"   label="Uptime"          value="99.8%" sub="30-day avg"       trend="up"   spark={[99,100,99.5,100,99.8,100,99.8]}  color="#4ade80" />
        <KPI icon="alert"      label="Critical Alerts" value="3"     sub="Action required"  trend="down"                                          color="var(--red2)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14 }}>
        {/* India Map */}
        <div className="card fade-up s2">
          <Section title="National Activity Map" icon="map">
            <svg viewBox="0 0 500 400" style={{ width: "100%", height: 200, opacity: 0.9 }}>
              <rect width="500" height="400" fill="var(--bg2)" />
              {/* Simplified India shape */}
              <path d="M180 60 L220 50 L270 55 L310 70 L340 90 L360 120 L370 150 L365 180 L350 210 L340 240 L320 270 L300 290 L280 310 L260 330 L245 350 L230 360 L215 345 L200 320 L185 295 L170 265 L160 240 L155 210 L150 180 L145 150 L150 120 L160 95 Z" fill="var(--bg3)" stroke="var(--border)" strokeWidth="1" />
              {/* State highlights */}
              {[
                { x: 230, y: 130, r: 18, label: "UP", active: true },
                { x: 280, y: 200, r: 14, label: "MH", active: true },
                { x: 195, y: 160, r: 12, label: "RJ", active: false },
                { x: 260, y: 155, r: 10, label: "MP", active: true },
                { x: 270, y: 270, r: 12, label: "TN", active: false },
                { x: 240, y: 250, r: 11, label: "KA", active: true },
              ].map((s, i) => (
                <g key={i}>
                  {s.active && <circle cx={s.x} cy={s.y} r={s.r + 8} fill="var(--gold)" opacity="0.06" style={{ animation: `pdot ${2 + i * .3}s infinite` }} />}
                  <circle cx={s.x} cy={s.y} r={s.r} fill={s.active ? "rgba(201,168,76,0.2)" : "var(--bg4)"} stroke={s.active ? "var(--gold)" : "var(--border)"} strokeWidth="1" />
                  <text x={s.x} y={s.y + 1} textAnchor="middle" dominantBaseline="middle" fill={s.active ? "var(--gold)" : "var(--cream3)"} fontSize="7" fontFamily="DM Mono">{s.label}</text>
                </g>
              ))}
              {/* Legend */}
              <g transform="translate(20,360)">
                <circle cx="6" cy="6" r="5" fill="rgba(201,168,76,0.2)" stroke="var(--gold)" strokeWidth="1" />
                <text x="16" y="10" fill="var(--cream3)" fontSize="8" fontFamily="DM Mono">Active</text>
                <circle cx="70" cy="6" r="5" fill="var(--bg4)" stroke="var(--border)" strokeWidth="1" />
                <text x="80" y="10" fill="var(--cream3)" fontSize="8" fontFamily="DM Mono">Inactive</text>
              </g>
            </svg>
          </Section>
        </div>

        {/* Live Event Stream */}
        <div className="card fade-up s3">
          <Section title="Live System Events" icon="activity">
            <div style={{ display: "flex", flexDirection: "column", gap: 0, maxHeight: 200, overflowY: "auto" }}>
              {events.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: "1px solid var(--border2)", alignItems: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", marginTop: 4, flexShrink: 0, background: e.risk === "high" ? "#ef4444" : e.risk === "med" ? "var(--amb)" : "#4ade80", boxShadow: e.risk === "high" ? "0 0 6px #ef4444" : "none" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="mono" style={{ fontSize: 9, color: "var(--gold)", marginBottom: 1 }}>{e.user}</div>
                    <div style={{ fontSize: 11, color: "var(--cream2)", lineHeight: 1.3 }}>{e.action}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 9, color: "var(--cream3)", flexShrink: 0 }}>{e.time}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {/* Anomalies */}
        <div className="card fade-up s4">
          <Section title="Active Anomalies" icon="alert">
            {[
              { msg: "BTH_DL04 — Bulk change requests", conf: 94, level: "high" },
              { msg: "Duplicate phone — Booth 12, UP", conf: 81, level: "med" },
              { msg: "GPS mismatch — Photo RJ7",         conf: 76, level: "med" },
            ].map((a, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid var(--border2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--cream2)" }}>{a.msg}</span>
                  <span className={`badge tag-${a.level === "high" ? "red" : "amb"}`}>{a.conf}% AI</span>
                </div>
                <Bar pct={a.conf} color={a.level === "high" ? "#ef4444" : "var(--amb)"} />
              </div>
            ))}
          </Section>
        </div>

        {/* Service Health */}
        <div className="card fade-up s5">
          <Section title="Service Health" icon="cpu">
            {services.map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border2)" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.status === "ok" ? "#4ade80" : "var(--amb)", boxShadow: `0 0 6px ${s.status === "ok" ? "#4ade80" : "var(--amb)"}` }} />
                  <span className="mono" style={{ fontSize: 10, color: "var(--cream2)" }}>{s.name}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: 10, color: s.status === "warn" ? "var(--amb)" : "#4ade80" }}>{s.latency}</span>
                  <span className={`badge ${s.status === "ok" ? "tag-grn" : "tag-amb"}`}>{s.status === "ok" ? "OK" : "SLOW"}</span>
                </div>
              </div>
            ))}
          </Section>
        </div>

        {/* Quick Actions */}
        <div className="card fade-up s6">
          <Section title="Command Actions" icon="zap">
            {[
              { label: "Suspend User",     cls: "btn-ghost" },
              { label: "Export Audit Log", cls: "btn-ghost" },
              { label: "Broadcast Alert",  cls: "btn-gold"  },
              { label: "Onboard Party",    cls: "btn-grn"   },
              { label: "Sync ECI Data",    cls: "btn-ghost" },
              { label: "Force Logout All", cls: "btn-red"   },
            ].map((b, i) => (
              <button key={i} className={`btn ${b.cls}`} style={{ width: "100%", marginBottom: 6, textAlign: "left", display: "flex", alignItems: "center", gap: 8 }}>
                <I n={b.cls === "btn-red" ? "logout" : b.cls === "btn-grn" ? "plus" : b.cls === "btn-gold" ? "send" : "chevron_right"} s={11} />
                {b.label}
              </button>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PAGE: USER MANAGEMENT
══════════════════════════════════════════════════════════════ */
const PageUsers = () => {
  const [filter, setFilter] = useState("ALL");
  const [drawer, setDrawer] = useState(null);
  const [search, setSearch] = useState("");
  const roles = ["ALL", "PARTY", "STATE", "DISTRICT", "MLA/MP", "BOOTH", "GOVT", "ECI"];
  const roleColors = { PARTY: "var(--gold)", STATE: "#4ade80", DISTRICT: "#22d3ee", "MLA/MP": "var(--saf)", BOOTH: "var(--amb)", GOVT: "#86efac", ECI: "#f87171", SUPER: "var(--red2)" };
  const users = [
    { id: "USR001", name: "Arvind Sharma",    role: "MLA/MP",    jurisdiction: "Varanasi North, UP",    active: "2m ago",  score: 92, risk: "low",  status: true },
    { id: "USR002", name: "Priya Nair",       role: "STATE",     jurisdiction: "Uttar Pradesh",         active: "15m ago", score: 78, risk: "low",  status: true },
    { id: "USR003", name: "Rahul Mehta",      role: "BOOTH",     jurisdiction: "Booth 42, Varanasi",    active: "1h ago",  score: 45, risk: "high", status: true },
    { id: "USR004", name: "Sunita Patel",     role: "DISTRICT",  jurisdiction: "Varanasi District",     active: "3h ago",  score: 88, risk: "low",  status: true },
    { id: "USR005", name: "IAS K. Krishnan",  role: "GOVT",      jurisdiction: "Tamil Nadu — Welfare",  active: "1d ago",  score: 71, risk: "low",  status: false },
    { id: "USR006", name: "Mohan Das",        role: "PARTY",     jurisdiction: "National HQ",           active: "5m ago",  score: 95, risk: "low",  status: true },
    { id: "USR007", name: "Anjali Singh",     role: "ECI",       jurisdiction: "Election Commission",   active: "Just now",score: 99, risk: "low",  status: true },
    { id: "USR008", name: "Vikram Reddy",     role: "MLA/MP",    jurisdiction: "Chennai Central, TN",   active: "30m ago", score: 67, risk: "med",  status: true },
  ];
  const filtered = users.filter(u => (filter === "ALL" || u.role === filter) && u.name.toLowerCase().includes(search.toLowerCase()));
  const [toggles, setToggles] = useState(users.map(u => u.status));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Toolbar */}
      <div className="card fade-up" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, position: "relative", minWidth: 200 }}>
          <I n="search" s={13} c="var(--cream3)" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input className="input" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34 }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {roles.map(r => (
            <button key={r} className={`tab ${filter === r ? "active" : ""}`} onClick={() => setFilter(r)}>{r}</button>
          ))}
        </div>
        <button className="btn btn-gold" style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <I n="plus" s={11} c="var(--gold)" /> Onboard User
        </button>
      </div>

      {/* Table */}
      <div className="card fade-up s2" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr 1fr 80px 80px 80px 60px", padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
          {["Name", "Role", "Jurisdiction", "Last Active", "Score", "Risk", "Status", ""].map((h, i) => (
            <span key={i} className="mono" style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--cream3)" }}>{h}</span>
          ))}
        </div>
        {filtered.map((u, i) => (
          <div key={i} className="table-row" style={{ gridTemplateColumns: "2fr 1fr 2fr 1fr 80px 80px 80px 60px", cursor: "pointer" }} onClick={() => setDrawer(u)}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: (roleColors[u.role] || "var(--gold)") + "20", border: `1px solid ${roleColors[u.role] || "var(--gold)"}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span className="mono" style={{ fontSize: 9, color: roleColors[u.role] || "var(--gold)" }}>{u.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <span style={{ fontSize: 12 }}>{u.name}</span>
            </div>
            <span className={`badge tag-${u.role === "ECI" ? "red" : u.role === "GOVT" ? "grn" : "gold"}`} style={{ height: "fit-content" }}>{u.role}</span>
            <span style={{ fontSize: 11, color: "var(--cream2)" }}>{u.jurisdiction}</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--cream3)" }}>{u.active}</span>
            <div>
              <div className="mono" style={{ fontSize: 12, color: u.score > 80 ? "#4ade80" : u.score > 60 ? "var(--amb)" : "#f87171", marginBottom: 3 }}>{u.score}</div>
              <Bar pct={u.score} color={u.score > 80 ? "#4ade80" : u.score > 60 ? "var(--amb)" : "#f87171"} />
            </div>
            <span className={`badge tag-${u.risk === "low" ? "grn" : u.risk === "med" ? "amb" : "red"}`} style={{ height: "fit-content" }}>{u.risk}</span>
            <div onClick={e => e.stopPropagation()}>
              <div className={`toggle ${toggles[i] ? "on" : ""}`} onClick={() => setToggles(t => { const n = [...t]; n[i] = !n[i]; return n; })}>
                <div className="toggle-thumb" />
              </div>
            </div>
            <button className="btn btn-ghost" style={{ padding: "4px 8px", fontSize: 9 }} onClick={e => { e.stopPropagation(); setDrawer(u); }}>
              <I n="eye" s={11} />
            </button>
          </div>
        ))}
      </div>

      {/* Drawer */}
      <div className={`overlay ${drawer ? "show" : ""}`} onClick={() => setDrawer(null)} />
      <div className={`drawer ${drawer ? "open" : ""}`} style={{ padding: 24 }}>
        {drawer && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div className="serif" style={{ fontSize: 18, fontWeight: 700 }}>User Profile</div>
              <button className="btn btn-ghost" style={{ padding: "4px 10px" }} onClick={() => setDrawer(null)}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20, padding: 16, background: "var(--bg3)", borderRadius: 3, border: "1px solid var(--border)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: (roleColors[drawer.role] || "var(--gold)") + "20", border: `2px solid ${roleColors[drawer.role] || "var(--gold)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: roleColors[drawer.role] }}>
                {drawer.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="serif" style={{ fontSize: 16, fontWeight: 700 }}>{drawer.name}</div>
                <span className={`badge tag-gold`}>{drawer.role}</span>
              </div>
            </div>
            {[["User ID", drawer.id], ["Jurisdiction", drawer.jurisdiction], ["Last Active", drawer.active], ["Activity Score", drawer.score + "/100"], ["Risk Level", drawer.risk.toUpperCase()]].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border2)" }}>
                <span className="mono" style={{ fontSize: 10, color: "var(--cream3)", textTransform: "uppercase", letterSpacing: 1 }}>{k}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--cream)" }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 14 }}>
              <div className="mono" style={{ fontSize: 9, color: "var(--cream3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>30-Day Activity</div>
              <LineChart data={[12, 18, 14, 22, 28, 20, 30, 25, 34, 28, 40, 35, 44, 38]} color={roleColors[drawer.role] || "var(--gold)"} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
              <button className="btn btn-ghost" style={{ flex: 1 }}>View Audit Trail</button>
              <button className="btn btn-gold"  style={{ flex: 1 }}>Edit Permissions</button>
              <button className="btn btn-red"   style={{ flex: 1 }}>Suspend User</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PAGE: ANOMALY DETECTION
══════════════════════════════════════════════════════════════ */
const PageAnomalies = () => {
  const [sel, setSel] = useState(0);
  const anomalies = [
    { id: "ANO-001", type: "Bulk Edit",       user: "BTH_DL04",   desc: "50 change requests submitted in 60 minutes — far above the 5/hr threshold.", conf: 94, level: "high", time: "14:28", expected: "≤ 5/hr", detected: "50/hr" },
    { id: "ANO-002", type: "Data Duplicate",  user: "CONST_UP12", desc: "Same phone number assigned to 3 separate voter profiles in Booth 12.", conf: 88, level: "high", time: "13:55", expected: "Unique", detected: "3 duplicates" },
    { id: "ANO-003", type: "GPS Mismatch",    user: "BTH_RJ07",   desc: "Before/After photo GPS coordinates 2.4km from declared street location.", conf: 76, level: "med", time: "13:30", expected: "< 100m", detected: "2,400m" },
    { id: "ANO-004", type: "Pattern Flag",    user: "CONST_MH9",  desc: "Notification targeting detected for identified opposition voter segment.", conf: 71, level: "med", time: "12:44", expected: "No targeting", detected: "Segment match" },
    { id: "ANO-005", type: "Login Anomaly",   user: "ST_GJ03",    desc: "Login from unrecognised IP — country: UAE. Expected: India only.", conf: 89, level: "high", time: "11:20", expected: "India IP", detected: "UAE — 185.x.x.x" },
  ];
  const a = anomalies[sel];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 14, height: "calc(100vh - 180px)" }}>
      {/* List */}
      <div className="card fade-up" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <Section title="Detected Anomalies" icon="alert" />
          <div style={{ display: "flex", gap: 6 }}>
            {["ALL", "HIGH", "MED", "LOW"].map(f => <button key={f} className="tab" style={{ fontSize: 9, padding: "4px 10px" }}>{f}</button>)}
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {anomalies.map((a, i) => (
            <div key={i} onClick={() => setSel(i)} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border2)", cursor: "pointer", background: sel === i ? "var(--goldd)" : "transparent", borderLeft: sel === i ? "2px solid var(--gold)" : "2px solid transparent", transition: "all .18s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span className="mono" style={{ fontSize: 9, color: a.level === "high" ? "#f87171" : "var(--amb)" }}>{a.type}</span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: 9, color: "var(--cream3)" }}>{a.time}</span>
                  <span className={`badge tag-${a.level === "high" ? "red" : "amb"}`}>{a.conf}%</span>
                </div>
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--gold)", marginBottom: 3 }}>{a.user}</div>
              <div style={{ fontSize: 11, color: "var(--cream2)", lineHeight: 1.4 }}>{a.desc.substring(0, 70)}...</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="card fade-up s2">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div className={`badge tag-${a.level === "high" ? "red" : "amb"}`} style={{ marginBottom: 8 }}>{a.level.toUpperCase()} SEVERITY</div>
              <div className="serif" style={{ fontSize: 20, fontWeight: 700 }}>{a.type} — {a.id}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--gold)", marginTop: 4 }}>{a.user} · {a.time}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <svg width={80} height={80} viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="30" fill="none" stroke="var(--border2)" strokeWidth="8" />
                <circle cx="40" cy="40" r="30" fill="none" stroke={a.level === "high" ? "#ef4444" : "var(--amb)"} strokeWidth="8"
                  strokeDasharray={`${(a.conf / 100) * 188.4} 188.4`} strokeLinecap="round" transform="rotate(-90 40 40)" />
                <text x="40" y="40" textAnchor="middle" dominantBaseline="middle" fill="var(--cream)" fontSize="16" fontFamily="'Playfair Display', serif" fontWeight="700">{a.conf}%</text>
                <text x="40" y="55" textAnchor="middle" fill="var(--cream3)" fontSize="7" fontFamily="DM Mono">AI CONF.</text>
              </svg>
            </div>
          </div>
          <div className="divider" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "var(--bg2)", borderRadius: 2, padding: 12 }}>
              <div className="mono" style={{ fontSize: 9, color: "var(--cream3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 2 }}>What Was Detected</div>
              <div style={{ fontSize: 12, lineHeight: 1.6 }}>{a.desc}</div>
            </div>
            <div style={{ background: "var(--bg2)", borderRadius: 2, padding: 12 }}>
              <div className="mono" style={{ fontSize: 9, color: "var(--cream3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 2 }}>Evidence Comparison</div>
              {[["Expected", a.expected, "#4ade80"], ["Detected", a.detected, "#f87171"]].map(([k, v, c], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span className="mono" style={{ fontSize: 10, color: "var(--cream3)" }}>{k}</span>
                  <span className="mono" style={{ fontSize: 10, color: c, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card fade-up s3">
          <Section title="AI Recommendation" icon="cpu">
            <div style={{ background: "var(--redb)", border: "1px solid rgba(159,18,57,.3)", borderRadius: 2, padding: 12, marginBottom: 12 }}>
              <div className="mono" style={{ fontSize: 10, color: "#fb7185" }}>Recommended Action: Immediately suspend user session and escalate to constituency admin for review. Flag all recent changes for manual audit.</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-red"   style={{ flex: 1 }}>Suspend User</button>
              <button className="btn btn-gold"  style={{ flex: 1 }}>Escalate to ECI</button>
              <button className="btn btn-ghost" style={{ flex: 1 }}>Add to Watchlist</button>
              <button className="btn btn-ghost" style={{ flex: 1 }}>Dismiss</button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PAGE: AUDIT LOG
══════════════════════════════════════════════════════════════ */
const PageAudit = () => {
  const [expanded, setExpanded] = useState(null);
  const logs = Array.from({ length: 20 }, (_, i) => ({
    id: `LOG-${String(9999 - i).padStart(5, "0")}`,
    ts: `2026-02-19 ${String(14 - Math.floor(i / 3)).padStart(2, "0")}:${String(59 - (i * 7) % 60).padStart(2, "0")}:${String((i * 13) % 60).padStart(2, "0")}`,
    user: ["CONST_UP14", "BTH_DL04", "ST_MH", "CONST_RJ7", "GOV_TN02", "PARTY_A"][i % 6],
    role: ["MLA/MP", "BOOTH", "STATE", "MLA/MP", "GOVT", "PARTY"][i % 6],
    action: ["Campaign Approved", "Change Request Submitted", "Admin Activated", "Content Flag Raised", "Scheme Sync", "Theme Updated"][i % 6],
    resource: ["Campaign #" + (100 + i), "Voter #" + (2000 + i), "User #USR00" + (i + 1), "Notif #" + (500 + i), "Scheme DS-" + i, "Theme v" + i][i % 6],
    risk: [12, 87, 15, 44, 8, 21, 65, 33, 7, 55][i % 10],
    hash: Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join("") + "...",
  }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div className="card fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="serif" style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Immutable Audit Log</div>
          <div className="mono" style={{ fontSize: 9, color: "var(--cream3)", letterSpacing: 1.5 }}>Append-only · Cryptographically signed · Tamper-evident · ECI accessible</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="input" placeholder="Search logs..." style={{ width: 180 }} />
          <button className="btn btn-gold" style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <I n="download" s={11} c="var(--gold)" /> Export PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card fade-up s2" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "110px 80px 100px 80px 160px 160px 60px", padding: "10px 14px", borderBottom: "1px solid var(--border)", gap: 8 }}>
          {["Timestamp", "Log ID", "User", "Role", "Action", "Resource", "Risk"].map((h, i) => (
            <span key={i} className="mono" style={{ fontSize: 9, color: "var(--cream3)", textTransform: "uppercase", letterSpacing: 1.5 }}>{h}</span>
          ))}
        </div>
        <div style={{ maxHeight: "calc(100vh - 320px)", overflowY: "auto" }}>
          {logs.map((l, i) => (
            <div key={i}>
              <div className="table-row" style={{ gridTemplateColumns: "110px 80px 100px 80px 160px 160px 60px", gap: 8 }} onClick={() => setExpanded(expanded === i ? null : i)}>
                <span className="mono" style={{ fontSize: 9, color: "var(--cream3)" }}>{l.ts.split(" ")[1]}</span>
                <span className="mono" style={{ fontSize: 9, color: "var(--gold)" }}>{l.id}</span>
                <span className="mono" style={{ fontSize: 10, color: "var(--cream)" }}>{l.user}</span>
                <span className={`badge tag-${l.role === "BOOTH" ? "amb" : l.role === "GOVT" ? "grn" : "gold"}`} style={{ fontSize: 8, padding: "2px 6px" }}>{l.role}</span>
                <span style={{ fontSize: 11, color: "var(--cream2)" }}>{l.action}</span>
                <span className="mono" style={{ fontSize: 9, color: "var(--cream3)" }}>{l.resource}</span>
                <div>
                  <div style={{ width: "100%", height: 4, background: "var(--border2)", borderRadius: 2 }}>
                    <div style={{ width: `${l.risk}%`, height: 4, background: l.risk > 70 ? "#ef4444" : l.risk > 40 ? "var(--amb)" : "#4ade80", borderRadius: 2 }} />
                  </div>
                </div>
              </div>
              {expanded === i && (
                <div style={{ padding: "12px 14px", background: "var(--bg2)", borderBottom: "1px solid var(--border2)" }}>
                  <div className="mono" style={{ fontSize: 9, color: "var(--cream3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Tamper Evidence Hash</div>
                  <div className="mono" style={{ fontSize: 10, color: "#4ade80", background: "var(--bg3)", padding: "8px 12px", borderRadius: 2, border: "1px solid var(--grnb)" }}>
                    sha256: {l.hash}8f4a2c1d9e7b3f6a8c5d2e4f1a3b6c9d2e5f8a1b4c7d0e3f6
                  </div>
                  <div className="mono" style={{ fontSize: 9, color: "var(--cream3)", marginTop: 6 }}>Full timestamp: {l.ts} IST · Session: {l.user}-{Date.now().toString(36)}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PAGE: PLATFORM FREEZE
══════════════════════════════════════════════════════════════ */
const PageFreeze = () => {
  const [step, setStep] = useState(0);
  const [scope, setScope] = useState("National");
  const [reason, setReason] = useState("");
  const [confirm, setConfirm] = useState("");
  const [frozen, setFrozen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [counting, setCounting] = useState(false);
  useEffect(() => {
    if (!counting) return;
    if (countdown <= 0) { setFrozen(true); setCounting(false); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [counting, countdown]);
  const expected = `FREEZE ${scope.toUpperCase()}`;
  if (frozen) return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 20 }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--redb)", border: "2px solid var(--red2)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pdot 1.5s infinite" }}>
        <I n="lock" s={32} c="#f87171" />
      </div>
      <div className="serif" style={{ fontSize: 28, fontWeight: 900, color: "#f87171", textAlign: "center" }}>Platform Frozen</div>
      <div className="mono" style={{ fontSize: 11, color: "var(--cream3)", textAlign: "center" }}>Scope: {scope} · Reported to ECI in real time<br />All political campaigns, notifications and data edits suspended.</div>
      <button className="btn btn-grn" style={{ marginTop: 10 }} onClick={() => { setFrozen(false); setStep(0); setCountdown(10); setConfirm(""); }}>Initiate Unfreeze</button>
    </div>
  );
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div className="card fade-up" style={{ borderTop: "3px solid var(--red2)" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--redb)", border: "1px solid var(--red2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I n="power" s={18} c="#f87171" />
          </div>
          <div>
            <div className="serif" style={{ fontSize: 18, fontWeight: 700, color: "#f87171" }}>Platform Freeze Control</div>
            <div className="mono" style={{ fontSize: 9, color: "var(--cream3)", letterSpacing: 1.5 }}>Two-step confirmation required · ECI notified in real time</div>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 24 }}>
          {["Select Scope", "Confirm Action", "Activate"].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= i ? "var(--red2)" : "var(--bg3)", border: `2px solid ${step >= i ? "var(--red2)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {step > i ? <I n="check" s={12} c="#fff" /> : <span className="mono" style={{ fontSize: 10, color: step === i ? "#fff" : "var(--cream3)" }}>{i + 1}</span>}
              </div>
              <span className="mono" style={{ fontSize: 9, color: step >= i ? "var(--cream2)" : "var(--cream3)", marginLeft: 6, marginRight: 12 }}>{s}</span>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > i ? "var(--red2)" : "var(--border2)", marginRight: 12 }} />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="fade-up">
            <div style={{ marginBottom: 16 }}>
              <div className="mono" style={{ fontSize: 9, color: "var(--cream3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Freeze Scope</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["National", "State", "Constituency"].map(s => (
                  <button key={s} onClick={() => setScope(s)} style={{ flex: 1, padding: "10px", background: scope === s ? "var(--redb)" : "var(--bg2)", border: `1px solid ${scope === s ? "var(--red2)" : "var(--border)"}`, color: scope === s ? "#f87171" : "var(--cream3)", borderRadius: 2, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11 }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div className="mono" style={{ fontSize: 9, color: "var(--cream3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Reason</div>
              <select className="input" value={reason} onChange={e => setReason(e.target.value)}>
                <option value="">Select reason...</option>
                {["Election Code Violation", "Security Incident", "Court Order", "Emergency Maintenance", "Other"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div className="mono" style={{ fontSize: 9, color: "var(--cream3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Description (min 50 chars)</div>
              <textarea className="input" rows={3} placeholder="Describe the reason for platform freeze..." value={confirm} onChange={e => setConfirm(e.target.value)} style={{ resize: "none" }} />
              <div className="mono" style={{ fontSize: 9, color: confirm.length >= 50 ? "#4ade80" : "var(--amb)", marginTop: 4 }}>{confirm.length}/50 characters</div>
            </div>
            <button className="btn btn-red" style={{ width: "100%", padding: "11px" }} disabled={!reason || confirm.length < 50} onClick={() => setStep(1)}>Proceed to Confirmation</button>
          </div>
        )}

        {step === 1 && (
          <div className="fade-up">
            <div style={{ background: "var(--redb)", border: "1px solid rgba(159,18,57,.4)", borderRadius: 2, padding: 14, marginBottom: 16 }}>
              <div className="mono" style={{ fontSize: 10, color: "#f87171", lineHeight: 1.6 }}>
                This will immediately suspend all political campaigns, notifications, and data modifications for <strong>{scope}</strong>. This action is irreversible without a second confirmation. ECI will be notified in real time.
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div className="mono" style={{ fontSize: 9, color: "var(--cream3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Type "{expected}" to confirm</div>
              <input className="input" placeholder={expected} value={confirm} onChange={e => setConfirm(e.target.value)} style={{ fontFamily: "'DM Mono', monospace" }} />
            </div>
            {counting ? (
              <button className="btn btn-red" style={{ width: "100%", padding: "11px" }} onClick={() => { setCounting(false); setCountdown(10); }}>
                Activating in {countdown}s — Click to Cancel
              </button>
            ) : (
              <button className="btn btn-red" style={{ width: "100%", padding: "11px" }} disabled={confirm !== expected} onClick={() => { setStep(2); setCounting(true); }}>
                Activate Platform Freeze
              </button>
            )}
            <button className="btn btn-ghost" style={{ width: "100%", marginTop: 8 }} onClick={() => { setStep(0); setConfirm(""); }}>Go Back</button>
          </div>
        )}

        {step === 2 && counting && (
          <div className="fade-up" style={{ textAlign: "center", padding: "20px 0" }}>
            <div className="serif" style={{ fontSize: 40, color: "#f87171", fontWeight: 900 }}>{countdown}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--cream3)", marginTop: 8 }}>Activating platform freeze in {countdown} seconds...</div>
            <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => { setCounting(false); setCountdown(10); setStep(0); setConfirm(""); }}>Cancel Freeze</button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PAGE: API HEALTH
══════════════════════════════════════════════════════════════ */
const PageAPI = () => {
  const services = [
    { name: "API Gateway",         latency: [28,30,25,32,28,27,29], uptime: 99.9, status: "ok",   requests: "2.4M/day"  },
    { name: "Notification Queue",  latency: [11,13,10,14,11,12,11], uptime: 99.8, status: "ok",   requests: "180K/day"  },
    { name: "AI Inference (Groq)", latency: [420,380,500,450,410,390,420], uptime: 98.2, status: "warn", requests: "12K/day" },
    { name: "Graph Database",      latency: [45,48,42,50,44,46,45], uptime: 99.9, status: "ok",   requests: "450K/day"  },
    { name: "Auth Service",        latency: [18,20,16,22,19,17,18], uptime: 100,  status: "ok",   requests: "95K/day"   },
    { name: "Bhashini API",        latency: [88,92,85,95,89,87,88], uptime: 99.1, status: "ok",   requests: "28K/day"   },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="row fade-up">
        <KPI icon="activity" label="Avg Response" value="92ms"  sub="All services" spark={[90,95,88,92,87,91,92]} />
        <KPI icon="zap"      label="Total Requests" value="3.2M" sub="Last 24hrs"  spark={[2.8,3.0,2.9,3.1,3.2,3.1,3.2]} trend="up" />
        <KPI icon="shield"   label="Error Rate"   value="0.02%" sub="Below threshold" trend="up" spark={[.05,.04,.03,.03,.02,.02,.02]} color="#4ade80" />
        <KPI icon="cpu"      label="Avg Uptime"   value="99.5%" sub="All services" spark={[99,100,99.5,100,99.8,100,99.5]} color="#4ade80" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {services.map((s, i) => (
          <div key={i} className={`card fade-up s${i + 1}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.status === "ok" ? "#4ade80" : "var(--amb)", boxShadow: `0 0 8px ${s.status === "ok" ? "#4ade80" : "var(--amb)"}` }} />
                  <span style={{ fontSize: 13 }}>{s.name}</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span className="mono" style={{ fontSize: 9, color: "var(--cream3)" }}>Uptime: <span style={{ color: s.uptime > 99 ? "#4ade80" : "var(--amb)" }}>{s.uptime}%</span></span>
                  <span className="mono" style={{ fontSize: 9, color: "var(--cream3)" }}>{s.requests}</span>
                </div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 20, fontWeight: 500, color: s.status === "warn" ? "var(--amb)" : "var(--cream)", textAlign: "right" }}>{s.latency[s.latency.length - 1]}ms</div>
                <div className="mono" style={{ fontSize: 8, color: "var(--cream3)", textAlign: "right" }}>current</div>
              </div>
            </div>
            <LineChart data={s.latency} color={s.status === "ok" ? "var(--gold)" : "var(--amb)"} h={50} />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PAGE: CAMPAIGN MONITOR
══════════════════════════════════════════════════════════════ */
const PageCampaigns = () => {
  const campaigns = [
    { id: "CMP-001", name: "Farmer Scheme Drive — UP",     party: "Party A", const: "UP — 12 Constituencies", segment: "Farmers",   sent: 84200,  open: 71,  status: "live",    risk: "low" },
    { id: "CMP-002", name: "Youth Startup Outreach — MH",  party: "Party B", const: "MH — 8 Constituencies",  segment: "Youth",     sent: 42100,  open: 58,  status: "live",    risk: "low" },
    { id: "CMP-003", name: "Women SHG Awareness — RJ",     party: "Party A", const: "RJ — 6 Constituencies",  segment: "Women",     sent: 31500,  open: 82,  status: "live",    risk: "low" },
    { id: "CMP-004", name: "Infrastructure Proof — DL",    party: "Party C", const: "DL — 4 Constituencies",  segment: "All",       sent: 12800,  open: 91,  status: "live",    risk: "low" },
    { id: "CMP-005", name: "Opposition Region Blast",       party: "Party B", const: "GJ — 3 Constituencies",  segment: "Custom",    sent: 0,      open: 0,   status: "flagged", risk: "high" },
    { id: "CMP-006", name: "Senior Citizen Health Drive",   party: "Party A", const: "KA — 5 Constituencies",  segment: "Seniors",   sent: 18900,  open: 65,  status: "paused",  risk: "med" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="row fade-up">
        <KPI icon="send"    label="Live Campaigns" value="47"    sub="Across 8 states"    spark={[30,35,40,38,44,45,47]} />
        <KPI icon="users"   label="Total Reach"    value="1.2Cr" sub="Unique voters"       spark={[.8,.9,1.0,1.0,1.1,1.15,1.2]} trend="up" />
        <KPI icon="eye"     label="Avg Open Rate"  value="73%"   sub="+8% vs last month"   spark={[60,65,62,68,70,71,73]} trend="up" color="#4ade80" />
        <KPI icon="alert"   label="Flagged"         value="2"     sub="Pending ECI review"  color="var(--red2)" />
      </div>
      <div className="card fade-up s2" style={{ padding: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "60px 2fr 1fr 1.5fr 1fr 80px 80px 80px 80px", padding: "10px 14px", borderBottom: "1px solid var(--border)", gap: 8 }}>
          {["ID", "Campaign", "Party", "Constituency", "Segment", "Sent", "Open%", "Status", "Risk"].map(h => (
            <span key={h} className="mono" style={{ fontSize: 9, color: "var(--cream3)", textTransform: "uppercase", letterSpacing: 1 }}>{h}</span>
          ))}
        </div>
        {campaigns.map((c, i) => (
          <div key={i} className="table-row" style={{ gridTemplateColumns: "60px 2fr 1fr 1.5fr 1fr 80px 80px 80px 80px", gap: 8, borderLeft: c.status === "flagged" ? "3px solid var(--red2)" : "3px solid transparent" }}>
            <span className="mono" style={{ fontSize: 9, color: "var(--gold)" }}>{c.id}</span>
            <span style={{ fontSize: 11 }}>{c.name}</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--cream2)" }}>{c.party}</span>
            <span style={{ fontSize: 10, color: "var(--cream3)" }}>{c.const}</span>
            <span className="badge tag-gold">{c.segment}</span>
            <span className="mono" style={{ fontSize: 10 }}>{c.sent > 0 ? c.sent.toLocaleString() : "—"}</span>
            <span className="mono" style={{ fontSize: 10, color: c.open > 80 ? "#4ade80" : "var(--cream)" }}>{c.open > 0 ? c.open + "%" : "—"}</span>
            <span className={`badge tag-${c.status === "live" ? "grn" : c.status === "flagged" ? "red" : "amb"}`}>{c.status}</span>
            <span className={`badge tag-${c.risk === "low" ? "grn" : c.risk === "med" ? "amb" : "red"}`}>{c.risk}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SIDEBAR NAV DATA
══════════════════════════════════════════════════════════════ */
const NAV = [
  { section: "OVERVIEW",    items: [{ id: "dashboard", icon: "dashboard", label: "System Dashboard" }, { id: "activity",   icon: "activity",  label: "Live Activity"      }] },
  { section: "MANAGEMENT",  items: [{ id: "users",     icon: "users",     label: "User Management" }, { id: "campaigns",  icon: "send",      label: "Campaign Monitor"   }] },
  { section: "MONITORING",  items: [{ id: "anomalies", icon: "alert",     label: "Anomaly Detection" }, { id: "audit",    icon: "file",      label: "Audit Log Archive"  }] },
  { section: "SECURITY",    items: [{ id: "freeze",    icon: "power",     label: "Platform Freeze" }, { id: "access",    icon: "lock",      label: "Access Control"     }] },
  { section: "SYSTEM",      items: [{ id: "api",       icon: "cpu",       label: "API Health" },       { id: "database",  icon: "database",  label: "Database Status"    }] },
  { section: "REPORTS",     items: [{ id: "reports",   icon: "download",  label: "Export Center" },    { id: "eci",       icon: "shield",    label: "ECI Submissions"    }] },
];

const PAGE_TITLES = {
  dashboard: "System Dashboard",   activity: "Live Activity Feed",
  users: "User Management",        campaigns: "Campaign Monitor",
  anomalies: "Anomaly Detection",  audit: "Audit Log Archive",
  freeze: "Platform Freeze",       access: "Access Control",
  api: "API Health",               database: "Database Status",
  reports: "Export Center",        eci: "ECI Submissions",
};

/* ══════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [notif, setNotif] = useState(false);
  const [clock, setClock] = useState(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  useEffect(() => {
    const t = setInterval(() => setClock(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })), 1000);
    return () => clearInterval(t);
  }, []);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <PageOverview />;
      case "users":     return <PageUsers />;
      case "anomalies": return <PageAnomalies />;
      case "audit":     return <PageAudit />;
      case "freeze":    return <PageFreeze />;
      case "api":       return <PageAPI />;
      case "campaigns": return <PageCampaigns />;
      default: return (
        <div className="card fade-up" style={{ textAlign: "center", padding: 40 }}>
          <div className="serif" style={{ fontSize: 20, color: "var(--cream3)", marginBottom: 8 }}>{PAGE_TITLES[page]}</div>
          <div className="mono" style={{ fontSize: 10, color: "var(--cream3)" }}>This page is ready to be built — architecture defined.</div>
        </div>
      );
    }
  };

  return (
    <>
      <G />
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)", position: "relative" }}>

        {/* ── SIDEBAR ── */}
        <div style={{ width: collapsed ? 56 : 220, background: "var(--bg2)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0, transition: "width .25s cubic-bezier(.4,0,.2,1)", overflow: "hidden" }}>
          {/* Logo */}
          <div style={{ padding: "18px 14px 14px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setCollapsed(c => !c)}>
              <div style={{ width: 28, height: 28, background: "var(--goldd)", border: "1px solid var(--gold)", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <I n="globe" s={14} c="var(--gold)" />
              </div>
              {!collapsed && (
                <div style={{ overflow: "hidden" }}>
                  <div className="serif" style={{ fontSize: 15, fontWeight: 700, color: "var(--gold)", whiteSpace: "nowrap" }}>BoothIQ</div>
                  <div className="badge tag-red" style={{ fontSize: 7, padding: "1px 6px" }}>SUPER ADMIN</div>
                </div>
              )}
            </div>
          </div>

          {/* Nav */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
            {NAV.map(({ section, items }) => (
              <div key={section}>
                {!collapsed && <div className="nav-label">{section}</div>}
                {items.map(item => (
                  <div key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)} title={collapsed ? item.label : ""}>
                    <I n={item.icon} s={14} c={page === item.id ? "var(--gold)" : "currentColor"} />
                    {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
                    {!collapsed && page === item.id && <I n="chevron_right" s={10} c="var(--gold)" style={{ marginLeft: "auto" }} />}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom */}
          {!collapsed && (
            <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
                <span className="mono" style={{ fontSize: 9, color: "#4ade80" }}>All systems nominal</span>
              </div>
              <div className="mono" style={{ fontSize: 8, color: "var(--cream3)", marginTop: 3 }}>Platform v2.1.0 · Build 2026.02.19</div>
            </div>
          )}
        </div>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ height: 52, background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 20px", gap: 16, flexShrink: 0 }}>
            <div className="serif" style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>{PAGE_TITLES[page]}</div>

            <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
              <I n="search" s={13} c="var(--cream3)" />
              <input className="input" placeholder="Search users, campaigns, anomalies..." style={{ paddingLeft: 32, height: 32, fontSize: 11, background: "var(--bg3)" }} />
            </div>

            <span className="mono" style={{ fontSize: 11, color: "var(--cream2)", letterSpacing: 1, flexShrink: 0 }}>IST {clock}</span>

            <div style={{ position: "relative" }}>
              <button style={{ background: "transparent", border: "none", color: "var(--cream2)", cursor: "pointer", padding: "4px", position: "relative" }} onClick={() => setNotif(n => !n)}>
                <I n="bell" s={17} c="var(--cream2)" />
                <div style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: "var(--red2)", border: "1px solid var(--bg2)" }} />
              </button>
              {notif && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 320, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 3, zIndex: 50, overflow: "hidden" }}>
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)" }}>
                    <span className="mono" style={{ fontSize: 9, color: "var(--gold)", letterSpacing: 2 }}>NOTIFICATIONS</span>
                  </div>
                  {[
                    { msg: "Critical anomaly detected — BTH_DL04", time: "2m ago", type: "red" },
                    { msg: "Campaign flagged by content filter", time: "14m ago", type: "amb" },
                    { msg: "New user onboarded — CONST_GJ5", time: "1hr ago", type: "grn" },
                  ].map((n, i) => (
                    <div key={i} style={{ padding: "10px 14px", borderBottom: "1px solid var(--border2)", display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }} onClick={() => setNotif(false)}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: n.type === "red" ? "#f87171" : n.type === "amb" ? "var(--amb)" : "#4ade80", marginTop: 4, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: "var(--cream2)", marginBottom: 2 }}>{n.msg}</div>
                        <span className="mono" style={{ fontSize: 9, color: "var(--cream3)" }}>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="btn btn-red" style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }} onClick={() => setPage("freeze")}>
              <I n="power" s={11} c="#f87171" /> Freeze
            </button>

            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--redb)", border: "1px solid var(--red2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <span className="mono" style={{ fontSize: 10, color: "var(--red2)", fontWeight: 600 }}>SA</span>
            </div>
          </div>

          {/* Page Content */}
          <div key={page} style={{ flex: 1, overflowY: "auto", padding: 20, background: "var(--bg)" }}
            style={{ flex: 1, overflowY: "auto", padding: 20, background: "var(--bg)", backgroundImage: "radial-gradient(circle, rgba(201,168,76,0.02) 1px, transparent 1px)", backgroundSize: "28px 28px" }}>
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}
