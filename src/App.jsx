import { useState, useRef, useCallback, useEffect } from "react";
import {
  Home, Search, Heart, Bell, User, Users, Settings, Menu, X,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Plus, Minus, Pencil, Trash2, Copy, Download, Upload, Share2,
  ExternalLink, Link, Filter, SlidersHorizontal,
  Star, Bookmark, Flag, Tag, Hash,
  MessageCircle, MessageSquare, Mail, Phone, Video, Camera, Image,
  FileText, Folder, ShoppingCart, ShoppingBag, CreditCard,
  Wallet, MapPin, Navigation, Compass, Zap, Clock, Calendar,
  Award, Gift, Package, ThumbsUp, Eye, EyeOff,
  Lock, Unlock, Shield, Check, CheckCircle,
  AlertCircle, AlertTriangle, Info, HelpCircle, XCircle,
  Play, Pause, Volume2, VolumeX, Wifi, Battery, Globe,
  LogIn, LogOut, RefreshCw, Grid, List, Layers,
  Sun, Moon, Coffee, Briefcase, Building2, Flame, Sparkles,
  Map, Ticket, Percent, DollarSign,
} from "lucide-react";

const ICONS = {
  Home, Search, Heart, Bell, User, Users, Settings, Menu, X,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Plus, Minus, Pencil, Trash2, Copy, Download, Upload, Share2,
  ExternalLink, Link, Filter, SlidersHorizontal,
  Star, Bookmark, Flag, Tag, Hash,
  MessageCircle, MessageSquare, Mail, Phone, Video, Camera, Image,
  FileText, Folder, ShoppingCart, ShoppingBag, CreditCard,
  Wallet, MapPin, Navigation, Compass, Zap, Clock, Calendar,
  Award, Gift, Package, ThumbsUp, Eye, EyeOff,
  Lock, Unlock, Shield, Check, CheckCircle,
  AlertCircle, AlertTriangle, Info, HelpCircle, XCircle,
  Play, Pause, Volume2, VolumeX, Wifi, Battery, Globe,
  LogIn, LogOut, RefreshCw, Grid, List, Layers,
  Sun, Moon, Coffee, Briefcase, Building2, Flame, Sparkles,
  Map, Ticket, Percent, DollarSign,
};

const BROWSER_MIN = 280, BROWSER_MAX = 1400;
const ASPECTS_LANDSCAPE = ["1:1", "4:3", "3:2", "16:9"];
const ASPECTS_PORTRAIT  = ["3:4", "2:3", "9:16"];
const aspectToRatio = a => { const [w, h] = a.split(":").map(Number); return `${w}/${h}`; };
const aspectNums = a => a.split(":").map(Number);

const DEFAULT_CARD_CFG = {
  radius: 12, borderWidth: 1, borderColor: "#e5e7eb",
  shadow: "sm", padding: 16, gap: 8, bgColor: "#ffffff", bgTransparent: false,
  cardHeight: 160, cardMinWidth: 200, cardFixedWidth: 240, cardsPerRow: 1,
  showThumbnail: true, showLabel: true, showHeader: true,
  showSubtext: true, showStat: false, showCTA: true, showSocialProof: false,
  thumbGradFrom: "#6366f1", thumbGradTo: "#a78bfa", thumbAspect: "4:3",
  thumbInset: false, thumbInsetAmount: 16, thumbInsetRadius: 0,
  labelText: "New", labelBg: "#eef2ff", labelColor: "#4f46e5", labelRadius: 20,
  labelMode: "inline", labelOverlayX: "left", labelOverlayY: "top",
  headerText: "Card heading", headerSize: 16, headerColor: "#111827", headerLines: 2,
  subtextText: "A short description that gives more context about this card.",
  subtextSize: 13, subtextColor: "#6b7280", subtextLines: 3,
  statValue: "2,491", statLabel: "Users", statValueColor: "#111827", statLabelColor: "#9ca3af",
  socialProofText: "1,200+ people joined", socialProofColor: "#6b7280", socialProofAvatars: true,
  ctaText: "Learn more", ctaBg: "#111827", ctaColor: "#ffffff", ctaRadius: 8, ctaBorderColor: "#111827",
  ctaIcon: null, ctaIconPosition: "left", ctaIconOnly: false,
  ctaColumn: false,
  contentAlign: "top", pinnedBottom: [],
  contentOverlay: false, overlayScrim: true,
};

const DEFAULT_PAGE_CFG = { bgColor: "#f9fafb", pagePadding: 16, sectionGap: 32, titleSize: 18 };

const shadows = {
  none: "none", sm: "0 1px 3px rgba(0,0,0,0.07)",
  md: "0 4px 12px rgba(0,0,0,0.09)", lg: "0 8px 24px rgba(0,0,0,0.12)",
};

const HINTS = {
  padding: { bg: "rgba(100,197,138,0.35)", label: "padding", border: "rgba(100,197,138,0.8)" },
  gap:     { bg: "rgba(99,162,246,0.35)",  label: "element gap", border: "rgba(99,162,246,0.8)" },
};

const newSection = () => ({
  id: String(Date.now()), title: "Featured", showSeeMore: true, seeMoreLabel: "See all",
  presetId: null, displayMode: "grid", cardCount: 4, collapsed: false,
});

// ── localStorage helpers ─────────────────────────────────────────
const storage = {
  get: key => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
    catch { return null; }
  },
  set: (key, val) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  },
};

// ── Primitives ──────────────────────────────────────────────────
function Swatch({ value, onChange }) {
  const ref = useRef();
  return (
    <div onClick={() => ref.current.click()} title={value}
      style={{ width: 24, height: 24, borderRadius: 5, background: value, border: "1px solid #d1d5db", cursor: "pointer", flexShrink: 0, position: "relative" }}>
      <input ref={ref} type="color" value={value} onChange={e => onChange(e.target.value)} style={{ opacity: 0, width: 0, height: 0, position: "absolute" }} />
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, unit = "px", onChange, hintKey, onHint }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span onMouseEnter={() => hintKey && onHint(hintKey)} onMouseLeave={() => hintKey && onHint(null)}
          style={{ fontSize: 12, color: "#374151", borderBottom: hintKey ? `1.5px dashed ${HINTS[hintKey]?.border}` : "none", paddingBottom: hintKey ? 1 : 0 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: "#111827" }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: "#6366f1" }} />
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
      <span style={{ fontSize: 12, color: "#374151" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ fontSize: 10, color: "#9ca3af", fontFamily: "monospace" }}>{value}</span>
        <Swatch value={value} onChange={onChange} />
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, multiline = false }) {
  const shared = { fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", color: "#111827", width: "100%", fontFamily: "inherit", boxSizing: "border-box" };
  return (
    <div style={{ marginBottom: 9 }}>
      <label style={{ fontSize: 12, color: "#374151", display: "block", marginBottom: 3 }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
            style={{ ...shared, resize: "vertical", lineHeight: 1.4 }} />
        : <input value={value} onChange={e => onChange(e.target.value)} style={shared} />}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <span style={{ fontSize: 12, color: "#374151" }}>{label}</span>
      <div onClick={() => onChange(!value)} style={{ width: 34, height: 18, borderRadius: 9, background: value ? "#6366f1" : "#d1d5db", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 2, left: value ? 16 : 2, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
      </div>
    </div>
  );
}

function VisibilityRow({ label, show, onShow, pinKey, pinnedBottom = [], onTogglePin }) {
  const pinned = pinKey && pinnedBottom.includes(pinKey);
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
      <span style={{ flex: 1, fontSize: 12, color: "#374151" }}>{label}</span>
      {pinKey && show && (
        <button onClick={() => onTogglePin(pinKey)} title={pinned ? "Unpin from bottom" : "Pin to bottom"}
          style={{ fontSize: 11, padding: "1px 6px", borderRadius: 4, border: `1px solid ${pinned ? "#a5b4fc" : "#e5e7eb"}`, background: pinned ? "#eef2ff" : "transparent", color: pinned ? "#4f46e5" : "#9ca3af", cursor: "pointer", fontFamily: "inherit", marginRight: 6, lineHeight: 1.4 }}>↓</button>
      )}
      <div onClick={() => onShow(!show)} style={{ width: 34, height: 18, borderRadius: 9, background: show ? "#6366f1" : "#d1d5db", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 2, left: show ? 16 : 2, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
      </div>
    </div>
  );
}

function SectionBox({ title, children }) {
  return (
    <div style={{ borderBottom: "1px solid #e5e7eb", padding: "12px 16px" }}>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af", margin: "0 0 10px" }}>{title}</p>
      {children}
    </div>
  );
}

function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef();
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQuery(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const entries = Object.entries(ICONS).filter(([name]) => !query || name.toLowerCase().includes(query.toLowerCase()));
  const Current = value ? ICONS[value] : null;
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: 34, height: 28, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${open ? "#a5b4fc" : "#d1d5db"}`, borderRadius: 6, background: open ? "#eef2ff" : "#fff", cursor: "pointer", color: "#374151", flexShrink: 0 }}>
        {Current ? <Current size={15} /> : <span style={{ fontSize: 9, color: "#9ca3af" }}>none</span>}
      </button>
      {open && (
        <div style={{ position: "absolute", left: 0, top: "calc(100% + 4px)", zIndex: 200, width: 228, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, boxShadow: "0 6px 20px rgba(0,0,0,0.13)", overflow: "hidden" }}>
          <div style={{ padding: "6px 8px", borderBottom: "1px solid #f3f4f6" }}>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search icons…" autoFocus
              style={{ width: "100%", fontSize: 12, padding: "4px 8px", border: "1px solid #e5e7eb", borderRadius: 5, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 2, padding: 6, maxHeight: 192, overflowY: "auto" }}>
            <button onClick={() => { onChange(null); setOpen(false); setQuery(""); }} title="None"
              style={{ padding: 5, borderRadius: 4, border: `1px solid ${!value ? "#a5b4fc" : "transparent"}`, background: !value ? "#eef2ff" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 9 }}>—</button>
            {entries.map(([name, Icon]) => (
              <button key={name} onClick={() => { onChange(name); setOpen(false); setQuery(""); }} title={name}
                style={{ padding: 5, borderRadius: 4, border: `1px solid ${value === name ? "#a5b4fc" : "transparent"}`, background: value === name ? "#eef2ff" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}>
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AspectButtons({ value, onChange }) {
  const btn = a => (
    <button key={a} onClick={() => onChange(a)} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 5, border: `1px solid ${value === a ? "#a5b4fc" : "#e5e7eb"}`, background: value === a ? "#eef2ff" : "#fff", color: value === a ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: value === a ? 600 : 400 }}>{a}</button>
  );
  return (
    <div style={{ marginBottom: 10 }}>
      <p style={{ fontSize: 12, color: "#374151", margin: "0 0 6px" }}>Aspect ratio</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 10, color: "#9ca3af", width: 52, flexShrink: 0 }}>Landscape</span>
          <div style={{ display: "flex", gap: 4 }}>{ASPECTS_LANDSCAPE.map(btn)}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 10, color: "#9ca3af", width: 52, flexShrink: 0 }}>Portrait</span>
          <div style={{ display: "flex", gap: 4 }}>{ASPECTS_PORTRAIT.map(btn)}</div>
        </div>
      </div>
    </div>
  );
}

function SaveWidget({ items, onSaveNew, onOverwrite, label }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("new");
  const [name, setName] = useState("");
  const [overwriteId, setOverwriteId] = useState("");
  const close = () => { setOpen(false); setName(""); setOverwriteId(""); setMode("new"); };
  const doSave = () => {
    if (mode === "new" && name.trim()) { onSaveNew(name.trim()); close(); }
    else if (mode === "overwrite" && overwriteId) { onOverwrite(overwriteId); close(); }
  };
  return (
    <div>
      {open ? (
        <div style={{ marginTop: 6 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            {["new", "overwrite"].map(m => (
              <button key={m} onClick={() => { setMode(m); setName(""); setOverwriteId(""); }}
                style={{ flex: 1, fontSize: 11, padding: "4px 0", borderRadius: 6, border: `1px solid ${mode === m ? "#a5b4fc" : "#e5e7eb"}`, background: mode === m ? "#eef2ff" : "#fff", color: mode === m ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit" }}>
                {m === "new" ? "Save new" : "Overwrite"}
              </button>
            ))}
          </div>
          {mode === "new" ? (
            <div style={{ display: "flex", gap: 4 }}>
              <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && doSave()}
                placeholder={`${label} name...`} autoFocus
                style={{ flex: 1, fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid #d1d5db", fontFamily: "inherit" }} />
              <button onClick={doSave} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, background: "#111827", color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Save</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 4 }}>
              <select value={overwriteId} onChange={e => setOverwriteId(e.target.value)}
                style={{ flex: 1, fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", color: overwriteId ? "#111827" : "#9ca3af", fontFamily: "inherit" }}>
                <option value="">— Select {label.toLowerCase()} —</option>
                {items.map(it => <option key={it.id} value={it.id}>{it.name}{it.layout ? ` (${it.layout})` : ""}</option>)}
              </select>
              <button onClick={doSave} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, background: "#111827", color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Save</button>
            </div>
          )}
          <button onClick={close} style={{ width: "100%", marginTop: 6, fontSize: 11, padding: "4px 0", border: "none", background: "transparent", color: "#9ca3af", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} style={{ width: "100%", marginTop: 4, fontSize: 11, padding: "6px 0", borderRadius: 6, border: "1px dashed #d1d5db", background: "transparent", color: "#6b7280", cursor: "pointer", fontFamily: "inherit" }}>
          + Save current {label.toLowerCase()}
        </button>
      )}
    </div>
  );
}

// ── Overlay label ───────────────────────────────────────────────
function OverlayLabel({ cfg }) {
  if (!cfg.showLabel || cfg.labelMode !== "overlay") return null;
  return (
    <div style={{
      position: "absolute", zIndex: 5,
      top: cfg.labelOverlayY === "top" ? 0 : "auto",
      bottom: cfg.labelOverlayY === "bottom" ? 0 : "auto",
      left: cfg.labelOverlayX === "left" ? 0 : "auto",
      right: cfg.labelOverlayX === "right" ? 0 : "auto",
      fontSize: 11, fontWeight: 700, lineHeight: 1.3,
      padding: "6px 10px", textAlign: "center", whiteSpace: "pre-line",
      borderRadius: cfg.labelRadius, background: cfg.labelBg, color: cfg.labelColor,
    }}>
      {cfg.labelText}
    </div>
  );
}

// ── Card content builder ────────────────────────────────────────
const SOCIAL_PROOF_AVATAR_COLORS = ["#6366f1", "#a78bfa", "#f472b6"];

function buildContentCol(cfg, hint, { excludeCTA = false } = {}) {
  const g = cfg.gap;
  const pinned = new Set(cfg.pinnedBottom || []);

  const allItems = [
    cfg.showLabel && cfg.labelMode !== "overlay" && { pin: "label",       el: <div key="label" style={{ display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 9px", borderRadius: cfg.labelRadius, background: cfg.labelBg, color: cfg.labelColor, alignSelf: "flex-start", whiteSpace: "pre-line", textAlign: "center" }}>{cfg.labelText}</div> },
    cfg.showHeader  && { pin: "header",      el: <p key="header" style={{ fontSize: cfg.headerSize, fontWeight: 600, color: cfg.headerColor, margin: 0, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: cfg.headerLines, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{cfg.headerText}</p> },
    cfg.showSubtext && { pin: "subtext",     el: <p key="subtext" style={{ fontSize: cfg.subtextSize, color: cfg.subtextColor, margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: cfg.subtextLines, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{cfg.subtextText}</p> },
    cfg.showSocialProof && { pin: "socialProof", el: (
      <div key="social" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {cfg.socialProofAvatars && <div style={{ display: "flex" }}>{SOCIAL_PROOF_AVATAR_COLORS.map((c, i) => <div key={i} style={{ width: 18, height: 18, borderRadius: "50%", background: c, border: "2px solid #fff", marginLeft: i > 0 ? -6 : 0, flexShrink: 0 }} />)}</div>}
        <span style={{ fontSize: 11, color: cfg.socialProofColor }}>{cfg.socialProofText}</span>
      </div>
    )},
    cfg.showStat && { pin: "stat", el: <div key="stat"><p style={{ fontSize: 20, fontWeight: 700, color: cfg.statValueColor, margin: 0 }}>{cfg.statValue}</p><p style={{ fontSize: 11, color: cfg.statLabelColor, margin: "2px 0 0" }}>{cfg.statLabel}</p></div> },
    !excludeCTA && cfg.showCTA && { pin: "cta", el: (() => { const CtaIc = cfg.ctaIcon ? ICONS[cfg.ctaIcon] : null; return <button key="cta" style={{ fontSize: 12, fontWeight: 500, padding: "7px 14px", borderRadius: cfg.ctaRadius, background: cfg.ctaBg, color: cfg.ctaColor, border: `1px solid ${cfg.ctaBorderColor}`, cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}>{CtaIc && cfg.ctaIconPosition === "left" && <CtaIc size={13} />}{!cfg.ctaIconOnly && cfg.ctaText}{CtaIc && cfg.ctaIconPosition === "right" && <CtaIc size={13} />}</button>; })() },
  ].filter(Boolean);

  const withGaps = (items, prefix) => items.reduce((acc, { el }, i) => {
    acc.push(el);
    if (i < items.length - 1) acc.push(
      hint === "gap"
        ? <div key={`${prefix}g${i}`} style={{ height: g, background: HINTS.gap.bg, border: `1px dashed ${HINTS.gap.border}`, borderRadius: 2, flexShrink: 0 }} />
        : <div key={`${prefix}g${i}`} style={{ height: g, flexShrink: 0 }} />
    );
    return acc;
  }, []);

  const top    = allItems.filter(({ pin }) => !pinned.has(pin));
  const bottom = allItems.filter(({ pin }) =>  pinned.has(pin));
  if (!bottom.length) return withGaps(top, "t");
  return [...withGaps(top, "t"), <div key="spacer" style={{ flex: 1 }} />, ...withGaps(bottom, "b")];
}

// ── Vertical Card ───────────────────────────────────────────────
function VerticalCard({ cfg, hint, cardRef }) {
  const p = cfg.padding;
  const inset = cfg.thumbInset ? cfg.thumbInsetAmount : 0;
  const isOverlay = cfg.contentOverlay && cfg.showThumbnail;
  const cardStyle = {
    border: `${cfg.borderWidth}px solid ${cfg.borderColor}`,
    borderRadius: cfg.radius, background: cfg.bgTransparent ? "transparent" : cfg.bgColor,
    boxShadow: shadows[cfg.shadow], overflow: "hidden",
    width: "100%", boxSizing: "border-box", position: "relative",
  };
  const PaddingOverlay = () => {
    if (hint !== "padding") return null;
    const cardEl = cardRef?.current;
    const cardW = cardEl ? cardEl.getBoundingClientRect().width : 0;
    const [ar_w, ar_h] = aspectNums(cfg.thumbAspect);
    const thumbH = cfg.showThumbnail ? ((cardW - inset * 2) * ar_h / ar_w) + inset : 0;
    return <>
      <div style={{ position: "absolute", top: thumbH, left: 0, right: 0, height: p, background: HINTS.padding.bg, pointerEvents: "none", zIndex: 10 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: p, background: HINTS.padding.bg, pointerEvents: "none", zIndex: 10 }} />
      <div style={{ position: "absolute", top: thumbH + p, bottom: p, left: 0, width: p, background: HINTS.padding.bg, pointerEvents: "none", zIndex: 10 }} />
      <div style={{ position: "absolute", top: thumbH + p, bottom: p, right: 0, width: p, background: HINTS.padding.bg, pointerEvents: "none", zIndex: 10 }} />
    </>;
  };
  return (
    <div ref={cardRef} style={cardStyle}>
      {!isOverlay && <PaddingOverlay />}
      <OverlayLabel cfg={cfg} />
      {hint && <div style={{ position: "absolute", top: 6, right: 6, zIndex: 20, fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 5, background: HINTS[hint]?.border, color: "#fff", pointerEvents: "none" }}>{HINTS[hint]?.label}</div>}
      {cfg.showThumbnail && (
        <div style={{ padding: `${inset}px ${inset}px ${isOverlay ? 0 : 0}` }}>
          <div style={{ background: `linear-gradient(135deg, ${cfg.thumbGradFrom}, ${cfg.thumbGradTo})`, borderRadius: cfg.thumbInset ? cfg.thumbInsetRadius : 0, overflow: "hidden", aspectRatio: aspectToRatio(cfg.thumbAspect), width: "100%" }} />
        </div>
      )}
      {isOverlay ? (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2, borderRadius: `0 0 ${cfg.radius}px ${cfg.radius}px`, background: cfg.overlayScrim ? "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)" : "transparent", padding: p, display: "flex", flexDirection: "column" }}>
          {buildContentCol(cfg, hint)}
        </div>
      ) : (
        <div style={{ padding: p, display: "flex", flexDirection: "column" }}>
          {buildContentCol(cfg, hint)}
        </div>
      )}
    </div>
  );
}

// ── Horizontal Card ─────────────────────────────────────────────
function HorizontalCard({ cfg, hint, cardRef }) {
  const p = cfg.padding;
  const inset = cfg.thumbInset ? cfg.thumbInsetAmount : 0;
  const [ar_w, ar_h] = aspectNums(cfg.thumbAspect);
  const thumbH = cfg.cardHeight - inset * 2;
  const thumbW = Math.round(thumbH * ar_w / ar_h);
  const thumbOuterW = thumbW + inset;
  const showCTACol = cfg.ctaColumn && cfg.showCTA;
  const cardStyle = {
    border: `${cfg.borderWidth}px solid ${cfg.borderColor}`,
    borderRadius: cfg.radius, background: cfg.bgTransparent ? "transparent" : cfg.bgColor,
    boxShadow: shadows[cfg.shadow], overflow: "hidden",
    width: "100%", minWidth: cfg.cardMinWidth,
    height: cfg.cardHeight, boxSizing: "border-box",
    position: "relative", display: "flex", alignItems: "stretch",
  };
  return (
    <div ref={cardRef} style={cardStyle}>
      <OverlayLabel cfg={cfg} />
      {hint && <div style={{ position: "absolute", top: 6, right: 6, zIndex: 20, fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 5, background: HINTS[hint]?.border, color: "#fff", pointerEvents: "none" }}>{HINTS[hint]?.label}</div>}
      {cfg.showThumbnail && (
        <div style={{ flexShrink: 0, width: thumbOuterW, height: cfg.cardHeight, padding: `${inset}px 0 ${inset}px ${inset}px`, boxSizing: "border-box" }}>
          <div style={{ width: thumbW, height: thumbH, background: `linear-gradient(135deg, ${cfg.thumbGradFrom}, ${cfg.thumbGradTo})`, borderRadius: cfg.thumbInset ? cfg.thumbInsetRadius : 0, overflow: "hidden" }} />
        </div>
      )}
      <div style={{ flex: 1, padding: p, overflow: "hidden", minWidth: 0, display: "flex", flexDirection: "column", justifyContent: (cfg.pinnedBottom || []).length ? "flex-start" : { top: "flex-start", center: "center", bottom: "flex-end" }[cfg.contentAlign] ?? "flex-start" }}>
        {buildContentCol(cfg, hint, { excludeCTA: showCTACol })}
      </div>
      {showCTACol && (
        <div style={{ flexShrink: 0, padding: p, display: "flex", alignItems: "center", borderLeft: `1px solid ${cfg.borderColor}` }}>
          {(() => { const CtaIc = cfg.ctaIcon ? ICONS[cfg.ctaIcon] : null; return <button style={{ fontSize: 12, fontWeight: 500, padding: "7px 14px", borderRadius: cfg.ctaRadius, background: cfg.ctaBg, color: cfg.ctaColor, border: `1px solid ${cfg.ctaBorderColor}`, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>{CtaIc && cfg.ctaIconPosition === "left" && <CtaIc size={13} />}{!cfg.ctaIconOnly && cfg.ctaText}{CtaIc && cfg.ctaIconPosition === "right" && <CtaIc size={13} />}</button>; })()}
        </div>
      )}
    </div>
  );
}

// ── Page Section ────────────────────────────────────────────────
function PageSection({ section, preset, pageCfg }) {
  const cfg = preset.cfg;
  const isHorizontal = preset.layout === "horizontal";
  const isHScroll = section.displayMode === "scroll" && !isHorizontal;
  const cards = Array.from({ length: section.cardCount }, (_, i) => i);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ fontSize: pageCfg.titleSize, fontWeight: 600, color: "#111827", margin: 0 }}>{section.title}</p>
        {section.showSeeMore && <button style={{ fontSize: 13, color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>{section.seeMoreLabel}</button>}
      </div>
      {isHScroll ? (
        <div className="hide-scrollbar" style={{ display: "flex", gap: 12, overflowX: "auto" }}>
          {cards.map(i => <div key={i} style={{ flexShrink: 0, width: cfg.cardFixedWidth || cfg.cardMinWidth }}><VerticalCard cfg={cfg} /></div>)}
        </div>
      ) : isHorizontal ? (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(max(${cfg.cardMinWidth}px, calc((100% - ${(cfg.cardsPerRow - 1) * 12}px) / ${cfg.cardsPerRow})), 1fr))`, gap: 12 }}>
          {cards.map(i => <HorizontalCard key={i} cfg={cfg} />)}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(cfg.cardMinWidth, 140)}px, 1fr))`, gap: 12 }}>
          {cards.map(i => <div key={i}><VerticalCard cfg={cfg} /></div>)}
        </div>
      )}
    </div>
  );
}

// ── Code generators ─────────────────────────────────────────────
function cssStr(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, m => `-${m.toLowerCase()}`)}: ${v}`)
    .join('; ');
}

const SHADOW_CSS = { none: "none", sm: "0 1px 3px rgba(0,0,0,0.07)", md: "0 4px 12px rgba(0,0,0,0.09)", lg: "0 8px 24px rgba(0,0,0,0.12)" };
const SOCIAL_AVATAR_COLORS = ["#6366f1", "#a78bfa", "#f472b6"];

function genContentLines(cfg, pad, excludeCTA = false) {
  const lines = [];
  if (cfg.showLabel && cfg.labelMode !== "overlay") lines.push(`${pad}<span style="${cssStr({ display: "inline-block", fontSize: "11px", fontWeight: 500, padding: "2px 9px", borderRadius: `${cfg.labelRadius}px`, background: cfg.labelBg, color: cfg.labelColor, whiteSpace: "pre-line" })}">${cfg.labelText}</span>`);
  if (cfg.showHeader)  lines.push(`${pad}<h3 style="${cssStr({ fontSize: `${cfg.headerSize}px`, fontWeight: 600, color: cfg.headerColor, margin: 0, lineHeight: 1.3 })}">${cfg.headerText}</h3>`);
  if (cfg.showSubtext) lines.push(`${pad}<p style="${cssStr({ fontSize: `${cfg.subtextSize}px`, color: cfg.subtextColor, margin: 0, lineHeight: 1.5 })}">${cfg.subtextText}</p>`);
  if (cfg.showSocialProof) {
    lines.push(`${pad}<div style="display: flex; align-items: center; gap: 6px;">`);
    if (cfg.socialProofAvatars) {
      lines.push(`${pad}  <div style="display: flex;">`);
      SOCIAL_AVATAR_COLORS.forEach((c, i) => lines.push(`${pad}    <div style="width: 18px; height: 18px; border-radius: 50%; background: ${c}; border: 2px solid #fff;${i > 0 ? " margin-left: -6px;" : ""}"></div>`));
      lines.push(`${pad}  </div>`);
    }
    lines.push(`${pad}  <span style="font-size: 11px; color: ${cfg.socialProofColor};">${cfg.socialProofText}</span>`);
    lines.push(`${pad}</div>`);
  }
  if (cfg.showStat) {
    lines.push(`${pad}<div>`);
    lines.push(`${pad}  <p style="font-size: 20px; font-weight: 700; color: ${cfg.statValueColor}; margin: 0;">${cfg.statValue}</p>`);
    lines.push(`${pad}  <p style="font-size: 11px; color: ${cfg.statLabelColor}; margin: 2px 0 0;">${cfg.statLabel}</p>`);
    lines.push(`${pad}</div>`);
  }
  if (!excludeCTA && cfg.showCTA) lines.push(`${pad}<button style="${cssStr({ fontSize: "12px", fontWeight: 500, padding: "7px 14px", borderRadius: `${cfg.ctaRadius}px`, background: cfg.ctaBg, color: cfg.ctaColor, border: `1px solid ${cfg.ctaBorderColor}`, cursor: "pointer" })}">${cfg.ctaText}</button>`);
  return lines.join("\n");
}

function genCardHTML(cfg, layout) {
  const bg = cfg.bgTransparent ? "transparent" : cfg.bgColor;
  const shadow = SHADOW_CSS[cfg.shadow];
  const p = `${cfg.padding}px`;
  const base = { border: `${cfg.borderWidth}px solid ${cfg.borderColor}`, borderRadius: `${cfg.radius}px`, background: bg, boxShadow: shadow, overflow: "hidden" };

  if (layout === "vertical") {
    const inset = cfg.thumbInset ? cfg.thumbInsetAmount : 0;
    const [aw, ah] = cfg.thumbAspect.split(":").map(Number);
    const lines = [`<div style="${cssStr({ ...base, position: "relative", width: "100%" })}">`];
    if (cfg.showLabel && cfg.labelMode === "overlay") {
      lines.push(`  <div style="${cssStr({ position: "absolute", zIndex: 5, top: cfg.labelOverlayY === "top" ? 0 : "auto", bottom: cfg.labelOverlayY === "bottom" ? 0 : "auto", left: cfg.labelOverlayX === "left" ? 0 : "auto", right: cfg.labelOverlayX === "right" ? 0 : "auto", fontSize: "11px", fontWeight: 700, padding: "6px 10px", borderRadius: `${cfg.labelRadius}px`, background: cfg.labelBg, color: cfg.labelColor, whiteSpace: "pre-line", textAlign: "center" })}">${cfg.labelText}</div>`);
    }
    if (cfg.showThumbnail) {
      lines.push(`  <div style="padding: ${inset}px ${inset}px 0;">`);
      lines.push(`    <div style="${cssStr({ aspectRatio: `${aw}/${ah}`, width: "100%", background: `linear-gradient(135deg, ${cfg.thumbGradFrom}, ${cfg.thumbGradTo})`, borderRadius: cfg.thumbInset ? `${cfg.thumbInsetRadius}px` : 0 })}"></div>`);
      lines.push(`  </div>`);
    }
    const isOverlay = cfg.contentOverlay && cfg.showThumbnail;
    if (isOverlay) {
      lines.push(`  <div style="${cssStr({ position: "absolute", bottom: 0, left: 0, right: 0, padding: p, display: "flex", flexDirection: "column", gap: `${cfg.gap}px`, zIndex: 2, ...(cfg.overlayScrim ? { background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)" } : {}) })}">`);
    } else {
      lines.push(`  <div style="${cssStr({ padding: p, display: "flex", flexDirection: "column", gap: `${cfg.gap}px` })}">`);
    }
    lines.push(genContentLines(cfg, "    "));
    lines.push(`  </div>`);
    lines.push(`</div>`);
    return lines.join("\n");
  } else {
    const inset = cfg.thumbInset ? cfg.thumbInsetAmount : 0;
    const [aw, ah] = cfg.thumbAspect.split(":").map(Number);
    const thumbH = cfg.cardHeight - inset * 2;
    const thumbW = Math.round(thumbH * aw / ah);
    const showCTACol = cfg.ctaColumn && cfg.showCTA;
    const lines = [`<div style="${cssStr({ ...base, display: "flex", alignItems: "stretch", height: `${cfg.cardHeight}px`, width: "100%" })}">`];
    if (cfg.showLabel && cfg.labelMode === "overlay") {
      lines.push(`  <div style="${cssStr({ position: "absolute", zIndex: 5, top: cfg.labelOverlayY === "top" ? 0 : "auto", bottom: cfg.labelOverlayY === "bottom" ? 0 : "auto", left: cfg.labelOverlayX === "left" ? 0 : "auto", right: cfg.labelOverlayX === "right" ? 0 : "auto", fontSize: "11px", fontWeight: 700, padding: "6px 10px", borderRadius: `${cfg.labelRadius}px`, background: cfg.labelBg, color: cfg.labelColor, whiteSpace: "pre-line" })}">${cfg.labelText}</div>`);
    }
    if (cfg.showThumbnail) {
      lines.push(`  <div style="${cssStr({ flexShrink: 0, width: `${thumbW + inset}px`, height: `${cfg.cardHeight}px`, padding: `${inset}px 0 ${inset}px ${inset}px`, boxSizing: "border-box" })}">`);
      lines.push(`    <div style="${cssStr({ width: `${thumbW}px`, height: `${thumbH}px`, background: `linear-gradient(135deg, ${cfg.thumbGradFrom}, ${cfg.thumbGradTo})`, borderRadius: cfg.thumbInset ? `${cfg.thumbInsetRadius}px` : 0 })}"></div>`);
      lines.push(`  </div>`);
    }
    lines.push(`  <div style="${cssStr({ flex: 1, padding: p, overflow: "hidden", display: "flex", flexDirection: "column", gap: `${cfg.gap}px` })}">`);
    lines.push(genContentLines(cfg, "    ", showCTACol));
    lines.push(`  </div>`);
    if (showCTACol) {
      lines.push(`  <div style="${cssStr({ flexShrink: 0, padding: p, display: "flex", alignItems: "center", borderLeft: `1px solid ${cfg.borderColor}` })}">`);
      lines.push(`    <button style="${cssStr({ fontSize: "12px", fontWeight: 500, padding: "7px 14px", borderRadius: `${cfg.ctaRadius}px`, background: cfg.ctaBg, color: cfg.ctaColor, border: `1px solid ${cfg.ctaBorderColor}`, cursor: "pointer", whiteSpace: "nowrap" })}">${cfg.ctaText}</button>`);
      lines.push(`  </div>`);
    }
    lines.push(`</div>`);
    return lines.join("\n");
  }
}

function genPageHTML(sections, presets, pageCfg) {
  const lines = [`<div style="${cssStr({ background: pageCfg.bgColor, padding: `${pageCfg.pagePadding}px`, display: "flex", flexDirection: "column", gap: `${pageCfg.sectionGap}px` })}">`];
  sections.forEach(sec => {
    const preset = presets.find(p => p.id === sec.presetId);
    if (!preset) return;
    const cfg = preset.cfg;
    const isHorizontal = preset.layout === "horizontal";
    const isScroll = sec.displayMode === "scroll" && !isHorizontal;
    lines.push(`  <!-- ${sec.title} -->`);
    lines.push(`  <div>`);
    lines.push(`    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">`);
    lines.push(`      <h2 style="font-size: ${pageCfg.titleSize}px; font-weight: 600; color: #111827; margin: 0;">${sec.title}</h2>`);
    if (sec.showSeeMore) lines.push(`      <button style="font-size: 13px; color: #6366f1; background: none; border: none; cursor: pointer; font-weight: 500;">${sec.seeMoreLabel}</button>`);
    lines.push(`    </div>`);
    let gridStyle;
    if (isScroll) gridStyle = `display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px;`;
    else if (isHorizontal) gridStyle = `display: grid; grid-template-columns: repeat(auto-fill, minmax(max(${cfg.cardMinWidth}px, calc((100% - ${(cfg.cardsPerRow - 1) * 12}px) / ${cfg.cardsPerRow})), 1fr)); gap: 12px;`;
    else gridStyle = `display: grid; grid-template-columns: repeat(auto-fill, minmax(${cfg.cardMinWidth}px, 1fr)); gap: 12px;`;
    lines.push(`    <div style="${gridStyle}">`);
    const cardHTML = genCardHTML(cfg, preset.layout);
    const indented = cardHTML.split("\n").map(l => `      ${l}`).join("\n");
    for (let i = 0; i < sec.cardCount; i++) {
      if (isScroll) {
        lines.push(`      <div style="flex-shrink: 0; width: ${cfg.cardFixedWidth || cfg.cardMinWidth}px;">`);
        lines.push(cardHTML.split("\n").map(l => `        ${l}`).join("\n"));
        lines.push(`      </div>`);
      } else {
        lines.push(indented);
      }
    }
    lines.push(`    </div>`);
    lines.push(`  </div>`);
  });
  lines.push(`</div>`);
  return lines.join("\n");
}

// ── Code panel ───────────────────────────────────────────────────
function CodePanel({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ width: 300, flexShrink: 0, borderLeft: "1px solid #e5e7eb", background: "#f8fafc", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af" }}>HTML</span>
        <button onClick={copy} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 5, border: `1px solid ${copied ? "#6ee7b7" : "#d1d5db"}`, background: copied ? "#d1fae5" : "#fff", color: copied ? "#065f46" : "#374151", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre style={{ flex: 1, overflow: "auto", margin: 0, padding: "12px", fontSize: 10.5, lineHeight: 1.65, fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace", color: "#1e293b", whiteSpace: "pre", wordBreak: "normal" }}>
        {code}
      </pre>
    </div>
  );
}

// ── Card Tab ────────────────────────────────────────────────────
function CardTab({ presets, onSaveNew, onOverwrite, onDelete }) {
  const [cfg, setCfg] = useState(DEFAULT_CARD_CFG);
  const [layout, setLayout] = useState("vertical");
  const [previewMode, setPreviewMode] = useState("grid");
  const [panel, setPanel] = useState("elements");
  const [hint, setHint] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const cardRef = useRef();

  const togglePin = key => setCfg(c => {
    const cur = c.pinnedBottom || [];
    return { ...c, pinnedBottom: cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key] };
  });

  const set = k => v => setCfg(c => {
    const next = { ...c, [k]: v };
    if (k === "radius" || k === "thumbInsetAmount")
      next.thumbInsetRadius = Math.max(0, next.radius - next.thumbInsetAmount);
    return next;
  });

  const tabBtn = active => ({ flex: 1, fontSize: 12, padding: "5px 0", borderRadius: 6, border: `1px solid ${active ? "#d1d5db" : "transparent"}`, background: active ? "#fff" : "transparent", color: active ? "#111827" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 500 : 400, textTransform: "capitalize" });
  const layoutBtn = active => ({ flex: 1, fontSize: 11, padding: "6px 0", borderRadius: 6, border: `1px solid ${active ? "#a5b4fc" : "#e5e7eb"}`, background: active ? "#eef2ff" : "#fff", color: active ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 600 : 400, textTransform: "capitalize" });

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <div style={{ width: 236, flexShrink: 0, background: "#f9fafb", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "10px 12px", borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af", margin: "0 0 7px" }}>Layout</p>
          <div style={{ display: "flex", gap: 5 }}>
            {["vertical","horizontal"].map(l => <button key={l} style={layoutBtn(layout === l)} onClick={() => setLayout(l)}>{l}</button>)}
          </div>
        </div>
        <div style={{ display: "flex", padding: "7px 10px", gap: 4, borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
          {["elements","shape","typography"].map(p => <button key={p} style={tabBtn(panel === p)} onClick={() => setPanel(p)}>{p}</button>)}
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <SectionBox title="Saved presets">
            {presets.length === 0 && <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>No presets yet.</p>}
            {presets.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                <button onClick={() => { setCfg(p.cfg); setLayout(p.layout); }}
                  style={{ flex: 1, fontSize: 12, color: "#374151", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit", textAlign: "left" }}>
                  {p.name} <span style={{ fontSize: 10, color: "#9ca3af" }}>({p.layout})</span>
                </button>
                <button onClick={() => onDelete(p.id)} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "0 0 0 6px", fontFamily: "inherit" }}>✕</button>
              </div>
            ))}
            <SaveWidget items={presets} label="Preset"
              onSaveNew={name => onSaveNew(name, cfg, layout)}
              onOverwrite={id => onOverwrite(id, cfg, layout)} />
          </SectionBox>
          {panel === "elements" && <>
            <SectionBox title="Visibility">
              {layout === "horizontal" ? <>
                <VisibilityRow label="Thumbnail"    show={cfg.showThumbnail}   onShow={set("showThumbnail")}   pinnedBottom={cfg.pinnedBottom} onTogglePin={togglePin} />
                <VisibilityRow label="Label / badge" show={cfg.showLabel}      onShow={set("showLabel")}       pinKey="label"       pinnedBottom={cfg.pinnedBottom} onTogglePin={togglePin} />
                <VisibilityRow label="Header"        show={cfg.showHeader}     onShow={set("showHeader")}      pinKey="header"      pinnedBottom={cfg.pinnedBottom} onTogglePin={togglePin} />
                <VisibilityRow label="Subtext"       show={cfg.showSubtext}    onShow={set("showSubtext")}     pinKey="subtext"     pinnedBottom={cfg.pinnedBottom} onTogglePin={togglePin} />
                <VisibilityRow label="Social proof"  show={cfg.showSocialProof} onShow={set("showSocialProof")} pinKey="socialProof" pinnedBottom={cfg.pinnedBottom} onTogglePin={togglePin} />
                <VisibilityRow label="Stat"          show={cfg.showStat}       onShow={set("showStat")}        pinKey="stat"        pinnedBottom={cfg.pinnedBottom} onTogglePin={togglePin} />
                <VisibilityRow label="CTA button"    show={cfg.showCTA}        onShow={set("showCTA")}         pinKey="cta"         pinnedBottom={cfg.pinnedBottom} onTogglePin={togglePin} />
              </> : <>
                <Toggle label="Thumbnail"    value={cfg.showThumbnail}    onChange={set("showThumbnail")} />
                <Toggle label="Label / badge" value={cfg.showLabel}       onChange={set("showLabel")} />
                <Toggle label="Header"        value={cfg.showHeader}      onChange={set("showHeader")} />
                <Toggle label="Subtext"       value={cfg.showSubtext}     onChange={set("showSubtext")} />
                <Toggle label="Social proof"  value={cfg.showSocialProof} onChange={set("showSocialProof")} />
                <Toggle label="Stat"          value={cfg.showStat}        onChange={set("showStat")} />
                <Toggle label="CTA button"    value={cfg.showCTA}         onChange={set("showCTA")} />
              </>}
            </SectionBox>
            {cfg.showThumbnail && (
              <SectionBox title="Thumbnail">
                <AspectButtons value={cfg.thumbAspect} onChange={set("thumbAspect")} />
                <ColorRow label="Gradient from" value={cfg.thumbGradFrom} onChange={set("thumbGradFrom")} />
                <ColorRow label="Gradient to" value={cfg.thumbGradTo} onChange={set("thumbGradTo")} />
                <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 4, paddingTop: 10 }}>
                  <Toggle label="Inset thumbnail" value={cfg.thumbInset} onChange={set("thumbInset")} />
                  {cfg.thumbInset && <>
                    <Slider label="Inset amount" value={cfg.thumbInsetAmount} min={2} max={24} onChange={set("thumbInsetAmount")} />
                    <Slider label="Inset radius" value={cfg.thumbInsetRadius} min={0} max={20} onChange={set("thumbInsetRadius")} />
                  </>}
                </div>
                {layout === "vertical" && (
                  <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 4, paddingTop: 10 }}>
                    <Toggle label="Content overlay" value={cfg.contentOverlay} onChange={set("contentOverlay")} />
                    {cfg.contentOverlay && <Toggle label="Gradient scrim" value={cfg.overlayScrim} onChange={set("overlayScrim")} />}
                  </div>
                )}
              </SectionBox>
            )}
            {cfg.showLabel && <SectionBox title="Label / badge">
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 12, color: "#374151", margin: "0 0 6px" }}>Mode</p>
                <div style={{ display: "flex", gap: 4 }}>
                  {["inline", "overlay"].map(m => (
                    <button key={m} onClick={() => set("labelMode")(m)} style={{ flex: 1, fontSize: 11, padding: "4px 0", borderRadius: 6, border: `1px solid ${cfg.labelMode === m ? "#a5b4fc" : "#e5e7eb"}`, background: cfg.labelMode === m ? "#eef2ff" : "#fff", color: cfg.labelMode === m ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: cfg.labelMode === m ? 600 : 400, textTransform: "capitalize" }}>{m}</button>
                  ))}
                </div>
              </div>
              {cfg.labelMode === "overlay" && (
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 12, color: "#374151", margin: "0 0 6px" }}>Corner</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                    {[["top","left","↖"],["top","right","↗"],["bottom","left","↙"],["bottom","right","↘"]].map(([y, x, arrow]) => {
                      const active = cfg.labelOverlayY === y && cfg.labelOverlayX === x;
                      return (
                        <button key={`${y}-${x}`} onClick={() => { set("labelOverlayY")(y); set("labelOverlayX")(x); }}
                          style={{ fontSize: 11, padding: "4px 0", borderRadius: 6, border: `1px solid ${active ? "#a5b4fc" : "#e5e7eb"}`, background: active ? "#eef2ff" : "#fff", color: active ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 600 : 400 }}>
                          {arrow} {y === "top" ? "Top" : "Bot"} {x === "left" ? "L" : "R"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <TextField label="Text" value={cfg.labelText} onChange={set("labelText")} multiline />
              <ColorRow label="Background" value={cfg.labelBg} onChange={set("labelBg")} />
              <ColorRow label="Text color" value={cfg.labelColor} onChange={set("labelColor")} />
              <Slider label="Border radius" value={cfg.labelRadius} min={0} max={20} onChange={set("labelRadius")} />
            </SectionBox>}
            {cfg.showSocialProof && <SectionBox title="Social proof">
              <TextField label="Text" value={cfg.socialProofText} onChange={set("socialProofText")} />
              <ColorRow label="Text color" value={cfg.socialProofColor} onChange={set("socialProofColor")} />
              <Toggle label="Show avatars" value={cfg.socialProofAvatars} onChange={set("socialProofAvatars")} />
            </SectionBox>}
            {cfg.showStat && <SectionBox title="Stat">
              <TextField label="Value" value={cfg.statValue} onChange={set("statValue")} />
              <TextField label="Label" value={cfg.statLabel} onChange={set("statLabel")} />
              <ColorRow label="Value color" value={cfg.statValueColor} onChange={set("statValueColor")} />
              <ColorRow label="Label color" value={cfg.statLabelColor} onChange={set("statLabelColor")} />
            </SectionBox>}
            {cfg.showCTA && <SectionBox title="CTA button">
              {layout === "horizontal" && <Toggle label="Right column" value={cfg.ctaColumn} onChange={set("ctaColumn")} />}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                <span style={{ fontSize: 12, color: "#374151", flex: 1 }}>Icon</span>
                <IconPicker value={cfg.ctaIcon} onChange={set("ctaIcon")} />
                {cfg.ctaIcon && (
                  <div style={{ display: "flex", gap: 3 }}>
                    {["left","right"].map(pos => (
                      <button key={pos} onClick={() => set("ctaIconPosition")(pos)} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 5, border: `1px solid ${cfg.ctaIconPosition === pos ? "#a5b4fc" : "#e5e7eb"}`, background: cfg.ctaIconPosition === pos ? "#eef2ff" : "#fff", color: cfg.ctaIconPosition === pos ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit" }}>{pos}</button>
                    ))}
                  </div>
                )}
              </div>
              {cfg.ctaIcon && <Toggle label="Icon only" value={cfg.ctaIconOnly} onChange={set("ctaIconOnly")} />}
              {!cfg.ctaIconOnly && <TextField label="Text" value={cfg.ctaText} onChange={set("ctaText")} />}
              <ColorRow label="Background" value={cfg.ctaBg} onChange={set("ctaBg")} />
              <ColorRow label="Text color" value={cfg.ctaColor} onChange={set("ctaColor")} />
              <ColorRow label="Border color" value={cfg.ctaBorderColor} onChange={set("ctaBorderColor")} />
              <Slider label="Border radius" value={cfg.ctaRadius} min={0} max={24} onChange={set("ctaRadius")} />
            </SectionBox>}
          </>}

          {panel === "shape" && <>
            <SectionBox title="Card shape">
              {layout === "horizontal" && !(cfg.pinnedBottom || []).length && (
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 12, color: "#374151", margin: "0 0 6px" }}>Content align</p>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[["top","↑ Top"],["center","· Mid"],["bottom","↓ Bot"]].map(([val, lbl]) => (
                      <button key={val} onClick={() => set("contentAlign")(val)} style={{ flex: 1, fontSize: 11, padding: "4px 0", borderRadius: 6, border: `1px solid ${cfg.contentAlign === val ? "#a5b4fc" : "#e5e7eb"}`, background: cfg.contentAlign === val ? "#eef2ff" : "#fff", color: cfg.contentAlign === val ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: cfg.contentAlign === val ? 600 : 400 }}>{lbl}</button>
                    ))}
                  </div>
                </div>
              )}
              <Slider label="Border radius" value={cfg.radius} min={0} max={32} onChange={set("radius")} />
              <Slider label="Border width" value={cfg.borderWidth} min={0} max={4} onChange={set("borderWidth")} />
              <Slider label="Padding" value={cfg.padding} min={0} max={40} onChange={set("padding")} hintKey="padding" onHint={setHint} />
              <Slider label="Element gap" value={cfg.gap} min={2} max={24} onChange={set("gap")} hintKey="gap" onHint={setHint} />
              {layout === "horizontal" && <Slider label="Card height" value={cfg.cardHeight} min={80} max={320} onChange={set("cardHeight")} />}
              <Slider label="Min width (grid)" value={cfg.cardMinWidth} min={100} max={480} onChange={set("cardMinWidth")} />
              {layout === "vertical" && <Slider label="Fixed width (scroll)" value={cfg.cardFixedWidth} min={100} max={480} onChange={set("cardFixedWidth")} />}
              {layout === "horizontal" && (
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 12, color: "#374151", margin: "0 0 6px" }}>Cards per row</p>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4].map(n => (
                      <button key={n} onClick={() => set("cardsPerRow")(n)} style={{ flex: 1, fontSize: 11, padding: "4px 0", borderRadius: 6, border: `1px solid ${cfg.cardsPerRow === n ? "#a5b4fc" : "#e5e7eb"}`, background: cfg.cardsPerRow === n ? "#eef2ff" : "#fff", color: cfg.cardsPerRow === n ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: cfg.cardsPerRow === n ? 600 : 400 }}>{n}</button>
                    ))}
                  </div>
                </div>
              )}
            </SectionBox>
            <SectionBox title="Colors">
              <Toggle label="Transparent background" value={cfg.bgTransparent} onChange={set("bgTransparent")} />
              {!cfg.bgTransparent && <ColorRow label="Background" value={cfg.bgColor} onChange={set("bgColor")} />}
              <ColorRow label="Border" value={cfg.borderColor} onChange={set("borderColor")} />
            </SectionBox>
            <SectionBox title="Shadow">
              <div style={{ display: "flex", gap: 5 }}>
                {Object.keys(shadows).map(s => <button key={s} onClick={() => set("shadow")(s)} style={{ flex: 1, fontSize: 11, padding: "4px 0", borderRadius: 6, border: `1px solid ${cfg.shadow === s ? "#9ca3af" : "#e5e7eb"}`, background: cfg.shadow === s ? "#fff" : "transparent", color: cfg.shadow === s ? "#111827" : "#9ca3af", cursor: "pointer", fontFamily: "inherit", fontWeight: cfg.shadow === s ? 500 : 400 }}>{s}</button>)}
              </div>
            </SectionBox>
          </>}

          {panel === "typography" && <>
            <SectionBox title="Header">
              <TextField label="Text" value={cfg.headerText} onChange={set("headerText")} />
              <Slider label="Font size" value={cfg.headerSize} min={12} max={28} onChange={set("headerSize")} />
              <Slider label="Max lines" value={cfg.headerLines} min={1} max={6} unit="" onChange={set("headerLines")} />
              <ColorRow label="Color" value={cfg.headerColor} onChange={set("headerColor")} />
            </SectionBox>
            <SectionBox title="Subtext">
              <TextField label="Text" value={cfg.subtextText} onChange={set("subtextText")} />
              <Slider label="Font size" value={cfg.subtextSize} min={10} max={18} onChange={set("subtextSize")} />
              <Slider label="Max lines" value={cfg.subtextLines} min={1} max={8} unit="" onChange={set("subtextLines")} />
              <ColorRow label="Color" value={cfg.subtextColor} onChange={set("subtextColor")} />
            </SectionBox>
          </>}

        </div>

        <div style={{ padding: "10px 14px", borderTop: "1px solid #e5e7eb", background: "#fff" }}>
          <button onClick={() => { setCfg(DEFAULT_CARD_CFG); setLayout("vertical"); }}
            style={{ width: "100%", fontSize: 11, padding: "6px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", cursor: "pointer", fontFamily: "inherit" }}>Reset to default</button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, overflow: "auto", padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", background: "#f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            {layout === "vertical" && ["grid", "scroll"].map(m => (
              <button key={m} onClick={() => setPreviewMode(m)} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, border: `1px solid ${previewMode === m ? "#a5b4fc" : "#e5e7eb"}`, background: previewMode === m ? "#eef2ff" : "#fff", color: previewMode === m ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: previewMode === m ? 600 : 400, textTransform: "capitalize" }}>{m}</button>
            ))}
            <button onClick={() => setShowCode(c => !c)} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, border: `1px solid ${showCode ? "#a5b4fc" : "#e5e7eb"}`, background: showCode ? "#eef2ff" : "#fff", color: showCode ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: showCode ? 600 : 400 }}>&lt;/&gt; Code</button>
          </div>
          <div style={{ width: layout === "horizontal" ? cfg.cardMinWidth : previewMode === "scroll" ? cfg.cardFixedWidth : cfg.cardMinWidth }}>
            {hint && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#6b7280", marginBottom: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: HINTS[hint].bg, border: `1px dashed ${HINTS[hint].border}` }} />
                <span>Showing <strong style={{ color: "#111827" }}>{HINTS[hint].label}</strong></span>
              </div>
            )}
            {layout === "vertical"
              ? <VerticalCard cfg={cfg} hint={hint} cardRef={cardRef} />
              : <HorizontalCard cfg={cfg} hint={hint} cardRef={cardRef} />}
          </div>
        </div>
        {showCode && <CodePanel code={genCardHTML(cfg, layout)} />}
      </div>
    </div>
  );
}

// ── Page Tab ─────────────────────────────────────────────────────
function PageTab({ presets, pageLayouts, onSaveLayout, onOverwriteLayout, onDeleteLayout }) {
  const [pageCfg, setPageCfg] = useState(DEFAULT_PAGE_CFG);
  const [sections, setSections] = useState([newSection()]);
  const [browserW, setBrowserW] = useState(390);
  const [showCode, setShowCode] = useState(false);
  const setPage = k => v => setPageCfg(c => ({ ...c, [k]: v }));
  const updateSection = (id, k, v) => setSections(s => s.map(sec => sec.id === id ? { ...sec, [k]: v } : sec));
  const removeSection = id => setSections(s => s.filter(sec => sec.id !== id));
  const moveSection = (id, dir) => setSections(s => {
    const i = s.findIndex(sec => sec.id === id), j = i + dir;
    if (j < 0 || j >= s.length) return s;
    const a = [...s]; [a[i], a[j]] = [a[j], a[i]]; return a;
  });

  const layoutBtn = active => ({ flex: 1, fontSize: 11, padding: "4px 0", borderRadius: 5, border: `1px solid ${active ? "#a5b4fc" : "#e5e7eb"}`, background: active ? "#eef2ff" : "#fff", color: active ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 600 : 400, textTransform: "capitalize" });

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <div style={{ width: 236, flexShrink: 0, background: "#f9fafb", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <SectionBox title="Saved layouts">
            {pageLayouts.length === 0 && <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>No layouts saved yet.</p>}
            {pageLayouts.map(pl => (
              <div key={pl.id} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                <button onClick={() => { setSections(pl.sections); setPageCfg(pl.pageCfg); }}
                  style={{ flex: 1, fontSize: 12, color: "#374151", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit", textAlign: "left" }}>{pl.name}</button>
                <button onClick={() => onDeleteLayout(pl.id)} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "0 0 0 6px", fontFamily: "inherit" }}>✕</button>
              </div>
            ))}
            <SaveWidget items={pageLayouts} label="Layout"
              onSaveNew={name => onSaveLayout(name, sections, pageCfg)}
              onOverwrite={id => onOverwriteLayout(id, sections, pageCfg)} />
          </SectionBox>

          <SectionBox title="Page settings">
            <ColorRow label="Background" value={pageCfg.bgColor} onChange={setPage("bgColor")} />
            <Slider label="Page padding" value={pageCfg.pagePadding} min={0} max={40} onChange={setPage("pagePadding")} />
            <Slider label="Section gap" value={pageCfg.sectionGap} min={8} max={64} onChange={setPage("sectionGap")} />
            <Slider label="Title font size" value={pageCfg.titleSize} min={12} max={28} onChange={setPage("titleSize")} />
          </SectionBox>

          <SectionBox title="Sections">
            {sections.map((sec, idx) => (
              <div key={sec.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 8, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", padding: "7px 10px", background: "#fff", gap: 4 }}>
                  <button onClick={() => updateSection(sec.id, "collapsed", !sec.collapsed)}
                    style={{ flex: 1, textAlign: "left", fontSize: 12, fontWeight: 500, color: "#111827", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
                    {sec.collapsed ? "▶" : "▼"} {sec.title || "Untitled"}
                  </button>
                  <button onClick={() => moveSection(sec.id, -1)} disabled={idx === 0} style={{ fontSize: 11, color: "#9ca3af", background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer", padding: "0 2px" }}>↑</button>
                  <button onClick={() => moveSection(sec.id, 1)} disabled={idx === sections.length - 1} style={{ fontSize: 11, color: "#9ca3af", background: "none", border: "none", cursor: idx === sections.length - 1 ? "default" : "pointer", padding: "0 2px" }}>↓</button>
                  <button onClick={() => removeSection(sec.id)} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "0 2px" }}>✕</button>
                </div>
                {!sec.collapsed && (
                  <div style={{ padding: "10px 10px 4px", background: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
                    <TextField label="Title" value={sec.title} onChange={v => updateSection(sec.id, "title", v)} />
                    <Toggle label="Show 'See more'" value={sec.showSeeMore} onChange={v => updateSection(sec.id, "showSeeMore", v)} />
                    {sec.showSeeMore && <TextField label="Button label" value={sec.seeMoreLabel} onChange={v => updateSection(sec.id, "seeMoreLabel", v)} />}
                    <div style={{ marginBottom: 9 }}>
                      <label style={{ fontSize: 12, color: "#374151", display: "block", marginBottom: 4 }}>Preset</label>
                      {presets.length === 0
                        ? <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>No presets saved yet.</p>
                        : <select value={sec.presetId || ""} onChange={e => updateSection(sec.id, "presetId", e.target.value || null)}
                            style={{ width: "100%", fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", color: sec.presetId ? "#111827" : "#9ca3af", fontFamily: "inherit" }}>
                            <option value="">— Select a preset —</option>
                            {presets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.layout})</option>)}
                          </select>}
                    </div>
                    {(() => {
                      const sel = presets.find(p => p.id === sec.presetId);
                      if (!sel) return null;
                      if (sel.layout === "vertical") return (
                        <div style={{ marginBottom: 9 }}>
                          <label style={{ fontSize: 12, color: "#374151", display: "block", marginBottom: 4 }}>Display mode</label>
                          <div style={{ display: "flex", gap: 4 }}>
                            {["grid","scroll"].map(m => <button key={m} style={layoutBtn(sec.displayMode === m)} onClick={() => updateSection(sec.id, "displayMode", m)}>{m}</button>)}
                          </div>
                        </div>
                      );
                      return <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 8px" }}>Horizontal cards wrap into rows based on min/max width.</p>;
                    })()}
                    <Slider label="Card count" value={sec.cardCount} min={2} max={8} unit="" onChange={v => updateSection(sec.id, "cardCount", v)} />
                  </div>
                )}
              </div>
            ))}
            <button onClick={() => setSections(s => [...s, newSection()])}
              style={{ width: "100%", fontSize: 11, padding: "6px 0", borderRadius: 6, border: "1px dashed #d1d5db", background: "transparent", color: "#6b7280", cursor: "pointer", fontFamily: "inherit" }}>+ Add section</button>
          </SectionBox>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#f3f4f6" }}>
        <div style={{ padding: "8px 16px", background: "#fff", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#6b7280", marginRight: 4 }}>Width</span>
          {[344, 375, 390, 768, 1024, 1280].map(w => (
            <button key={w} onClick={() => setBrowserW(w)}
              style={{ fontSize: 11, padding: "3px 9px", borderRadius: 5, border: `1px solid ${browserW === w ? "#a5b4fc" : "#e5e7eb"}`, background: browserW === w ? "#eef2ff" : "#fff", color: browserW === w ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit" }}>{w}</button>
          ))}
          <span style={{ fontSize: 11, color: "#d1d5db", marginLeft: 4 }}>{browserW}px</span>
          <div style={{ flex: 1 }} />
          <button onClick={() => setShowCode(c => !c)} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 5, border: `1px solid ${showCode ? "#a5b4fc" : "#e5e7eb"}`, background: showCode ? "#eef2ff" : "#fff", color: showCode ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: showCode ? 600 : 400 }}>&lt;/&gt; Code</button>
        </div>

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ flex: 1, overflow: "auto", padding: "32px 24px", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
          <div style={{ width: browserW, flexShrink: 0, border: "1px solid #d1d5db", borderRadius: 10, overflow: "hidden", alignSelf: "flex-start" }}>
            <div style={{ padding: "7px 12px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", gap: 5 }}>
                {["#ff5f57","#febc2e","#28c840"].map((c,i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
              </div>
              <div style={{ flex: 1, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 5, padding: "3px 10px", margin: "0 8px" }}>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>localhost:3000</span>
              </div>
              <span style={{ fontSize: 10, color: "#d1d5db", fontFamily: "monospace" }}>{browserW}px</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <div style={{ background: pageCfg.bgColor, padding: pageCfg.pagePadding, display: "flex", flexDirection: "column", gap: pageCfg.sectionGap, minHeight: 300 }}>
                {sections.map(sec => {
                  const preset = presets.find(p => p.id === sec.presetId);
                  if (!preset) return (
                    <div key={sec.id} style={{ border: "1.5px dashed #d1d5db", borderRadius: 10, padding: "24px 16px", textAlign: "center" }}>
                      <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>"{sec.title}" — select a preset to preview</p>
                    </div>
                  );
                  return <PageSection key={sec.id} section={sec} preset={preset} pageCfg={pageCfg} />;
                })}
              </div>
            </div>
            <div style={{ height: 8, background: "#f3f4f6", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 32, height: 3, borderRadius: 2, background: "#d1d5db" }} />
            </div>
          </div>
          </div>
          {showCode && <CodePanel code={genPageHTML(sections, presets, pageCfg)} />}
        </div>
      </div>
    </div>
  );
}

// ── Nav bar ──────────────────────────────────────────────────────
const DEFAULT_NAV_ITEMS = [
  { icon: "Home",   label: "Home" },
  { icon: "Search", label: "Search" },
  { icon: "Heart",  label: "Saved" },
  { icon: "Bell",   label: "Alerts" },
  { icon: "User",   label: "Profile" },
];

const DEFAULT_NAV_CFG = {
  height: 64, bgColor: "#ffffff", bgTransparent: false,
  shadow: "sm", borderRadiusTop: 0, borderRadiusBottom: 0,
  borderTop: true, borderColor: "#e5e7eb", borderWidth: 1,
  paddingX: 8, paddingBottom: 0,
  itemCount: 4, activeIndex: 0, items: DEFAULT_NAV_ITEMS,
  showLabels: true,
  showIndicator: false, indicatorStyle: "pill",
  activeStyle: "color",
  activeContainerBg: "#22c55e", activeContainerRadius: 12,
  activeContainerPadding: 10, activeContainerIconColor: "#ffffff",
  activeColor: "#6366f1", inactiveColor: "#9ca3af",
  iconSize: 24, labelSize: 10,
};

function NavBar({ cfg }) {
  const items = cfg.items.slice(0, cfg.itemCount);
  const bg = cfg.bgTransparent ? "transparent" : cfg.bgColor;
  const rt = cfg.borderRadiusTop ?? 0, rb = cfg.borderRadiusBottom ?? 0;
  const barStyle = {
    display: "flex", alignItems: "stretch",
    height: cfg.height, background: bg,
    boxShadow: shadows[cfg.shadow],
    borderRadius: `${rt}px ${rt}px ${rb}px ${rb}px`,
    borderTop: cfg.borderTop ? `${cfg.borderWidth}px solid ${cfg.borderColor}` : "none",
    paddingLeft: cfg.paddingX, paddingRight: cfg.paddingX,
    paddingBottom: cfg.paddingBottom, boxSizing: "border-box", overflow: "hidden",
  };
  return (
    <div style={barStyle}>
      {items.map((item, i) => {
        const active = i === cfg.activeIndex;
        const isContainer = cfg.activeStyle === "container";
        const color = active && !isContainer ? cfg.activeColor : cfg.inactiveColor;
        const Ic = item.icon ? ICONS[item.icon] : null;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, position: "relative", paddingTop: cfg.showIndicator && cfg.indicatorStyle === "pill" ? 6 : 0 }}>
            {cfg.showIndicator && active && cfg.indicatorStyle === "pill" && (
              <div style={{ position: "absolute", top: 0, width: 36, height: 3, borderRadius: 2, background: cfg.activeColor }} />
            )}
            {isContainer && active ? (
              <div style={{ background: cfg.activeContainerBg, borderRadius: cfg.activeContainerRadius, padding: cfg.activeContainerPadding, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {Ic && <Ic size={cfg.iconSize} color={cfg.activeContainerIconColor} strokeWidth={2} />}
              </div>
            ) : (
              Ic && <Ic size={cfg.iconSize} color={color} strokeWidth={active ? 2.5 : 1.75} />
            )}
            {cfg.showLabels && (
              <span style={{ fontSize: cfg.labelSize, color, fontWeight: active ? 600 : 400, lineHeight: 1, whiteSpace: "nowrap" }}>{item.label}</span>
            )}
            {cfg.showIndicator && active && cfg.indicatorStyle === "dot" && (
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: cfg.activeColor, marginTop: 1 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function NavTab({ navPresets, onSaveNew, onOverwrite, onDelete }) {
  const [cfg, setCfg] = useState(DEFAULT_NAV_CFG);
  const [panel, setPanel] = useState("elements");
  const [showCode, setShowCode] = useState(false);
  const [previewBg, setPreviewBg] = useState("#f3f4f6");

  const set = k => v => setCfg(c => ({ ...c, [k]: v }));
  const setItem = (i, k, v) => setCfg(c => {
    const items = c.items.map((it, idx) => idx === i ? { ...it, [k]: v } : it);
    return { ...c, items };
  });

  const tabBtn = active => ({ flex: 1, fontSize: 12, padding: "5px 0", borderRadius: 6, border: `1px solid ${active ? "#d1d5db" : "transparent"}`, background: active ? "#fff" : "transparent", color: active ? "#111827" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 500 : 400, textTransform: "capitalize" });
  const segBtn = (active) => ({ flex: 1, fontSize: 11, padding: "4px 0", borderRadius: 6, border: `1px solid ${active ? "#a5b4fc" : "#e5e7eb"}`, background: active ? "#eef2ff" : "#fff", color: active ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 600 : 400 });

  const navCode = (() => {
    const items = cfg.items.slice(0, cfg.itemCount);
    const bg = cfg.bgTransparent ? "transparent" : cfg.bgColor;
    const border = cfg.borderTop ? `border-top: ${cfg.borderWidth}px solid ${cfg.borderColor};` : "";
    const lines = [`<nav style="display: flex; align-items: stretch; height: ${cfg.height}px; background: ${bg}; box-shadow: ${SHADOW_CSS[cfg.shadow]}; border-radius: ${cfg.borderRadius}px; ${border} padding: 0 ${cfg.paddingX}px ${cfg.paddingBottom}px; box-sizing: border-box;">`];
    items.forEach((item, i) => {
      const active = i === cfg.activeIndex;
      const color = active ? cfg.activeColor : cfg.inactiveColor;
      lines.push(`  <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;">`);
      lines.push(`    <span style="font-size: ${cfg.iconSize}px;">${item.icon}</span>`);
      if (cfg.showLabels) lines.push(`    <span style="font-size: ${cfg.labelSize}px; color: ${color}; font-weight: ${active ? 600 : 400};">${item.label}</span>`);
      lines.push(`  </div>`);
    });
    lines.push(`</nav>`);
    return lines.join("\n");
  })();

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      {/* ── Sidebar ── */}
      <div style={{ width: 236, flexShrink: 0, background: "#f9fafb", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Saved presets */}
          <SectionBox title="Saved presets">
            {navPresets.length === 0 && <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>No presets yet.</p>}
            {navPresets.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                <button onClick={() => setCfg(p.cfg)} style={{ flex: 1, fontSize: 12, color: "#374151", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit", textAlign: "left" }}>{p.name}</button>
                <button onClick={() => onDelete(p.id)} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "0 0 0 6px", fontFamily: "inherit" }}>✕</button>
              </div>
            ))}
            <SaveWidget items={navPresets} label="Preset" onSaveNew={name => onSaveNew(name, cfg)} onOverwrite={id => onOverwrite(id, cfg)} />
          </SectionBox>

          {/* Panel tabs */}
          <div style={{ display: "flex", padding: "7px 10px", gap: 4, borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
            {["elements", "shape", "typography"].map(p => <button key={p} style={tabBtn(panel === p)} onClick={() => setPanel(p)}>{p}</button>)}
          </div>

          {panel === "elements" && <>
            <SectionBox title="Items">
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 12, color: "#374151", margin: "0 0 6px" }}>Count</p>
                <div style={{ display: "flex", gap: 4 }}>
                  {[3, 4, 5].map(n => <button key={n} onClick={() => set("itemCount")(n)} style={segBtn(cfg.itemCount === n)}>{n}</button>)}
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 12, color: "#374151", margin: "0 0 6px" }}>Active tab</p>
                <div style={{ display: "flex", gap: 4 }}>
                  {Array.from({ length: cfg.itemCount }, (_, i) => (
                    <button key={i} onClick={() => set("activeIndex")(i)} style={segBtn(cfg.activeIndex === i)}>{i + 1}</button>
                  ))}
                </div>
              </div>
              {cfg.items.slice(0, cfg.itemCount).map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
                  <IconPicker value={item.icon} onChange={v => setItem(i, "icon", v)} />
                  <input value={item.label} onChange={e => setItem(i, "label", e.target.value)}
                    style={{ flex: 1, fontSize: 12, padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: 6, fontFamily: "inherit", background: "#fff", color: "#111827" }} />
                </div>
              ))}
            </SectionBox>
            <SectionBox title="Visibility">
              <Toggle label="Labels" value={cfg.showLabels} onChange={set("showLabels")} />
              <Toggle label="Active indicator" value={cfg.showIndicator} onChange={set("showIndicator")} />
              {cfg.showIndicator && (
                <div style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 12, color: "#374151", margin: "0 0 6px" }}>Indicator style</p>
                  <div style={{ display: "flex", gap: 4 }}>
                    {["pill", "dot"].map(s => <button key={s} onClick={() => set("indicatorStyle")(s)} style={{ ...segBtn(cfg.indicatorStyle === s), textTransform: "capitalize" }}>{s}</button>)}
                  </div>
                </div>
              )}
            </SectionBox>
            <SectionBox title="Active state">
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 12, color: "#374151", margin: "0 0 6px" }}>Style</p>
                <div style={{ display: "flex", gap: 4 }}>
                  {[["color","Color"],["container","Container"]].map(([val, lbl]) => (
                    <button key={val} onClick={() => set("activeStyle")(val)} style={{ ...segBtn(cfg.activeStyle === val) }}>{lbl}</button>
                  ))}
                </div>
              </div>
              {cfg.activeStyle === "container" ? <>
                <ColorRow label="Container bg" value={cfg.activeContainerBg} onChange={set("activeContainerBg")} />
                <ColorRow label="Icon color" value={cfg.activeContainerIconColor} onChange={set("activeContainerIconColor")} />
                <Slider label="Corner radius" value={cfg.activeContainerRadius} min={0} max={32} onChange={set("activeContainerRadius")} />
                <Slider label="Padding" value={cfg.activeContainerPadding} min={4} max={20} onChange={set("activeContainerPadding")} />
              </> : (
                <ColorRow label="Active color" value={cfg.activeColor} onChange={set("activeColor")} />
              )}
              <ColorRow label="Inactive color" value={cfg.inactiveColor} onChange={set("inactiveColor")} />
            </SectionBox>
          </>}

          {panel === "shape" && <>
            <SectionBox title="Size & spacing">
              <Slider label="Height" value={cfg.height} min={48} max={96} onChange={set("height")} />
              <Slider label="Top corner radius" value={cfg.borderRadiusTop ?? 0} min={0} max={48} onChange={set("borderRadiusTop")} />
              <Slider label="Bottom corner radius" value={cfg.borderRadiusBottom ?? 0} min={0} max={48} onChange={set("borderRadiusBottom")} />
              <Slider label="Horizontal padding" value={cfg.paddingX} min={0} max={32} onChange={set("paddingX")} />
              <Slider label="Bottom padding" value={cfg.paddingBottom} min={0} max={40} onChange={set("paddingBottom")} />
            </SectionBox>
            <SectionBox title="Background">
              <Toggle label="Transparent" value={cfg.bgTransparent} onChange={set("bgTransparent")} />
              {!cfg.bgTransparent && <ColorRow label="Color" value={cfg.bgColor} onChange={set("bgColor")} />}
            </SectionBox>
            <SectionBox title="Border">
              <Toggle label="Top border" value={cfg.borderTop} onChange={set("borderTop")} />
              {cfg.borderTop && <>
                <Slider label="Width" value={cfg.borderWidth} min={0} max={4} onChange={set("borderWidth")} />
                <ColorRow label="Color" value={cfg.borderColor} onChange={set("borderColor")} />
              </>}
            </SectionBox>
            <SectionBox title="Shadow">
              <div style={{ display: "flex", gap: 5 }}>
                {Object.keys(shadows).map(s => <button key={s} onClick={() => set("shadow")(s)} style={{ flex: 1, fontSize: 11, padding: "4px 0", borderRadius: 6, border: `1px solid ${cfg.shadow === s ? "#9ca3af" : "#e5e7eb"}`, background: cfg.shadow === s ? "#fff" : "transparent", color: cfg.shadow === s ? "#111827" : "#9ca3af", cursor: "pointer", fontFamily: "inherit", fontWeight: cfg.shadow === s ? 500 : 400 }}>{s}</button>)}
              </div>
            </SectionBox>
          </>}

          {panel === "typography" && <>
            <SectionBox title="Sizes">
              <Slider label="Icon size" value={cfg.iconSize} min={16} max={36} onChange={set("iconSize")} />
              {cfg.showLabels && <Slider label="Label size" value={cfg.labelSize} min={8} max={14} onChange={set("labelSize")} />}
            </SectionBox>
          </>}
        </div>

        <div style={{ padding: "10px 14px", borderTop: "1px solid #e5e7eb", background: "#fff" }}>
          <button onClick={() => setCfg(DEFAULT_NAV_CFG)}
            style={{ width: "100%", fontSize: 11, padding: "6px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", cursor: "pointer", fontFamily: "inherit" }}>Reset to default</button>
        </div>
      </div>

      {/* ── Preview ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f3f4f6", gap: 16, padding: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "#6b7280" }}>Canvas</span>
            <Swatch value={previewBg} onChange={setPreviewBg} />
            <button onClick={() => setShowCode(c => !c)} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, border: `1px solid ${showCode ? "#a5b4fc" : "#e5e7eb"}`, background: showCode ? "#eef2ff" : "#fff", color: showCode ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: showCode ? 600 : 400 }}>&lt;/&gt; Code</button>
          </div>
          <div style={{ width: 390, background: previewBg, borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
            <div style={{ height: 120, background: previewBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 12, color: "#d1d5db" }}>content area</span>
            </div>
            <NavBar cfg={cfg} />
          </div>
        </div>
        {showCode && <CodePanel code={navCode} />}
      </div>
    </div>
  );
}

// ── Root ────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("card");
  const [presets, setPresets] = useState([]);
  const [pageLayouts, setPageLayouts] = useState([]);
  const [navPresets, setNavPresets] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const pr = storage.get("presets");
    const pl = storage.get("pageLayouts");
    const np = storage.get("navPresets");
    if (pr) setPresets(pr);
    if (pl) setPageLayouts(pl);
    if (np) setNavPresets(np);
    setLoaded(true);
  }, []);

  const savePreset = (name, cfg, layout) => {
    const p = [...presets, { id: String(Date.now()), name, cfg, layout }];
    setPresets(p); storage.set("presets", p);
  };
  const overwritePreset = (id, cfg, layout) => {
    const p = presets.map(pr => pr.id === id ? { ...pr, cfg, layout } : pr);
    setPresets(p); storage.set("presets", p);
  };
  const deletePreset = id => {
    const p = presets.filter(pr => pr.id !== id);
    setPresets(p); storage.set("presets", p);
  };
  const saveLayout = (name, sections, pageCfg) => {
    const l = [...pageLayouts, { id: String(Date.now()), name, sections, pageCfg }];
    setPageLayouts(l); storage.set("pageLayouts", l);
  };
  const overwriteLayout = (id, sections, pageCfg) => {
    const l = pageLayouts.map(pl => pl.id === id ? { ...pl, sections, pageCfg } : pl);
    setPageLayouts(l); storage.set("pageLayouts", l);
  };
  const deleteLayout = id => {
    const l = pageLayouts.filter(pl => pl.id !== id);
    setPageLayouts(l); storage.set("pageLayouts", l);
  };
  const saveNavPreset = (name, cfg) => {
    const p = [...navPresets, { id: String(Date.now()), name, cfg }];
    setNavPresets(p); storage.set("navPresets", p);
  };
  const overwriteNavPreset = (id, cfg) => {
    const p = navPresets.map(pr => pr.id === id ? { ...pr, cfg } : pr);
    setNavPresets(p); storage.set("navPresets", p);
  };
  const deleteNavPreset = id => {
    const p = navPresets.filter(pr => pr.id !== id);
    setNavPresets(p); storage.set("navPresets", p);
  };

  const tabBtn = active => ({ fontSize: 13, padding: "6px 20px", borderRadius: 6, border: "none", background: active ? "#111827" : "transparent", color: active ? "#fff" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 500 : 400 });

  if (!loaded) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: 13, color: "#9ca3af" }}>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "8px 16px", background: "#fff", borderBottom: "1px solid #e5e7eb", gap: 4, flexShrink: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: "0 16px 0 0" }}>Design playground</p>
        <button style={tabBtn(tab === "card")} onClick={() => setTab("card")}>Card</button>
        <button style={tabBtn(tab === "page")} onClick={() => setTab("page")}>Page</button>
        <button style={tabBtn(tab === "nav")} onClick={() => setTab("nav")}>Nav</button>
        <span style={{ fontSize: 11, color: "#d1d5db", marginLeft: 8 }}>{presets.length} preset{presets.length !== 1 ? "s" : ""} · {pageLayouts.length} layout{pageLayouts.length !== 1 ? "s" : ""} saved</span>
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {tab === "card" && <CardTab presets={presets} onSaveNew={savePreset} onOverwrite={overwritePreset} onDelete={deletePreset} />}
        {tab === "page" && <PageTab presets={presets} pageLayouts={pageLayouts} onSaveLayout={saveLayout} onOverwriteLayout={overwriteLayout} onDeleteLayout={deleteLayout} />}
        {tab === "nav" && <NavTab navPresets={navPresets} onSaveNew={saveNavPreset} onOverwrite={overwriteNavPreset} onDelete={deleteNavPreset} />}
      </div>
    </div>
  );
}
