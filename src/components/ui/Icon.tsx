/**
 * Shared Icon component — supports both Material Symbols (text-based)
 * and a small set of inline SVG icons used in dashboards.
 */

// ── Material Symbols Icon (used in landing page) ──────────────────────
export function MaterialIcon({
    name,
    className = "",
    size,
}: {
    name: string;
    className?: string;
    size?: number;
}) {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={size ? { fontSize: size } : undefined}
        >
            {name}
        </span>
    );
}

// ── Inline SVG Icon (used in dashboard pages) ─────────────────────────
const SVG_PATHS: Record<string, string> = {
    dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    activity: "M22 12h-4l-3 9L9 3l-3 9H2",
    users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
    lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4",
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
    menu: "M3 12h18 M3 6h18 M3 18h18",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
};

export function SvgIcon({
    name,
    size = 14,
    color = "currentColor",
    className = "",
}: {
    name: string;
    size?: number;
    color?: string;
    className?: string;
}) {
    const paths = SVG_PATHS[name];
    if (!paths) return null;
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {paths.split(" M").map((seg, i) => (
                <path key={i} d={i === 0 ? seg : "M" + seg} />
            ))}
        </svg>
    );
}
