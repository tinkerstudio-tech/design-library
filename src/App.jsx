import { useState, useRef, useCallback, useEffect } from "react";

const BROWSER_MIN = 280, BROWSER_MAX = 1400;
const ASPECTS = ["1:1", "4:3", "3:2", "16:9"];
const aspectToRatio = a => { const [w, h] = a.split(":").map(Number); return `${w}/${h}`; };
const aspectNums = a => a.split(":").map(Number);

const DEFAULT_CARD_CFG = {
  radius: 12, borderWidth: 1, borderColor: "#e5e7eb",
  shadow: "sm", padding: 16, gap: 8, bgColor: "#ffffff",
  cardHeight: 160, cardMinWidth: 200,
  showThumbnail: true, showLabel: true, showHeader: true,
  showSubtext: true, showStat: false, showCTA: true,
  thumbGradFrom: "#6366f1", thumbGradTo: "#a78bfa", thumbAspect: "4:3",
  thumbInset: false, thumbInsetAmount: 16, thumbInsetRadius: 0,
  labelText: "New", labelBg: "#eef2ff", labelColor: "#4f46e5", labelRadius: 20,
  headerText: "Card heading", headerSize: 16, headerColor: "#111827",
  subtextText: "A short description that gives more context about this card.",
  subtextSize: 13, subtextColor: "#6b7280",
  statValue: "2,491", statLabel: "Users", statValueColor: "#111827", statLabelColor: "#9ca3af",
  ctaText: "Learn more", ctaBg: "#111827", ctaColor: "#ffffff", ctaRadius: 8, ctaBorderColor: "#111827",
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

function TextField({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 9 }}>
      <label style={{ fontSize: 12, color: "#374151", display: "block", marginBottom: 3 }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)}
        style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", color: "#111827", width: "100%", fontFamily: "inherit", boxSizing: "border-box" }} />
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

function SectionBox({ title, children }) {
  return (
    <div style={{ borderBottom: "1px solid #e5e7eb", padding: "12px 16px" }}>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af", margin: "0 0 10px" }}>{title}</p>
      {children}
    </div>
  );
}

function AspectButtons({ value, onChange }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <p style={{ fontSize: 12, color: "#374151", margin: "0 0 6px" }}>Aspect ratio</p>
      <div style={{ display: "flex", gap: 4 }}>
        {ASPECTS.map(a => (
          <button key={a} onClick={() => onChange(a)} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 5, border: `1px solid ${value === a ? "#a5b4fc" : "#e5e7eb"}`, background: value === a ? "#eef2ff" : "#fff", color: value === a ? "#4f46e5" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: value === a ? 600 : 400 }}>{a}</button>
        ))}
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

// ── Card content builder ────────────────────────────────────────
function buildContentCol(cfg, hint) {
  const g = cfg.gap;
  const items = [
    cfg.showLabel   && <div key="label" style={{ display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 9px", borderRadius: cfg.labelRadius, background: cfg.labelBg, color: cfg.labelColor, alignSelf: "flex-start" }}>{cfg.labelText}</div>,
    cfg.showHeader  && <p key="header" style={{ fontSize: cfg.headerSize, fontWeight: 600, color: cfg.headerColor, margin: 0, lineHeight: 1.3 }}>{cfg.headerText}</p>,
    cfg.showSubtext && <p key="subtext" style={{ fontSize: cfg.subtextSize, color: cfg.subtextColor, margin: 0, lineHeight: 1.5 }}>{cfg.subtextText}</p>,
    cfg.showStat    && <div key="stat"><p style={{ fontSize: 20, fontWeight: 700, color: cfg.statValueColor, margin: 0 }}>{cfg.statValue}</p><p style={{ fontSize: 11, color: cfg.statLabelColor, margin: "2px 0 0" }}>{cfg.statLabel}</p></div>,
    cfg.showCTA     && <button key="cta" style={{ fontSize: 12, fontWeight: 500, padding: "7px 14px", borderRadius: cfg.ctaRadius, background: cfg.ctaBg, color: cfg.ctaColor, border: `1px solid ${cfg.ctaBorderColor}`, cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-start" }}>{cfg.ctaText}</button>,
  ].filter(Boolean);
  return items.reduce((acc, el, i) => {
    acc.push(el);
    if (i < items.length - 1) acc.push(
      hint === "gap"
        ? <div key={`g${i}`} style={{ height: g, background: HINTS.gap.bg, border: `1px dashed ${HINTS.gap.border}`, borderRadius: 2, flexShrink: 0 }} />
        : <div key={`g${i}`} style={{ height: g, flexShrink: 0 }} />
    );
    return acc;
  }, []);
}

// ── Vertical Card ───────────────────────────────────────────────
function VerticalCard({ cfg, hint, cardRef }) {
  const p = cfg.padding;
  const inset = cfg.thumbInset ? cfg.thumbInsetAmount : 0;
  const cardStyle = {
    border: `${cfg.borderWidth}px solid ${cfg.borderColor}`,
    borderRadius: cfg.radius, background: cfg.bgColor,
    boxShadow: shadows[cfg.shadow], overflow: "hidden",
    width: "100%", minWidth: cfg.cardMinWidth, boxSizing: "border-box", position: "relative",
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
      <PaddingOverlay />
      {hint && <div style={{ position: "absolute", top: 6, right: 6, zIndex: 20, fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 5, background: HINTS[hint]?.border, color: "#fff", pointerEvents: "none" }}>{HINTS[hint]?.label}</div>}
      {cfg.showThumbnail && (
        <div style={{ padding: `${inset}px ${inset}px 0` }}>
          <div style={{ background: `linear-gradient(135deg, ${cfg.thumbGradFrom}, ${cfg.thumbGradTo})`, borderRadius: cfg.thumbInset ? cfg.thumbInsetRadius : 0, overflow: "hidden", aspectRatio: aspectToRatio(cfg.thumbAspect), width: "100%" }} />
        </div>
      )}
      <div style={{ padding: p, display: "flex", flexDirection: "column" }}>
        {buildContentCol(cfg, hint)}
      </div>
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
  const cardStyle = {
    border: `${cfg.borderWidth}px solid ${cfg.borderColor}`,
    borderRadius: cfg.radius, background: cfg.bgColor,
    boxShadow: shadows[cfg.shadow], overflow: "hidden",
    width: "100%", minWidth: cfg.cardMinWidth,
    height: cfg.cardHeight, boxSizing: "border-box",
    position: "relative", display: "flex", alignItems: "stretch",
  };
  return (
    <div ref={cardRef} style={cardStyle}>
      {hint && <div style={{ position: "absolute", top: 6, right: 6, zIndex: 20, fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 5, background: HINTS[hint]?.border, color: "#fff", pointerEvents: "none" }}>{HINTS[hint]?.label}</div>}
      {cfg.showThumbnail && (
        <div style={{ flexShrink: 0, width: thumbOuterW, height: cfg.cardHeight, padding: `${inset}px 0 ${inset}px ${inset}px`, boxSizing: "border-box" }}>
          <div style={{ width: thumbW, height: thumbH, background: `linear-gradient(135deg, ${cfg.thumbGradFrom}, ${cfg.thumbGradTo})`, borderRadius: cfg.thumbInset ? cfg.thumbInsetRadius : 0, overflow: "hidden" }} />
        </div>
      )}
      <div style={{ flex: 1, padding: p, overflow: "hidden", minWidth: 0, display: "flex", flexDirection: "column" }}>
        {buildContentCol(cfg, hint)}
      </div>
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
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
          {cards.map(i => <div key={i} style={{ flexShrink: 0, width: Math.max(cfg.cardMinWidth, 180) }}><VerticalCard cfg={cfg} /></div>)}
        </div>
      ) : isHorizontal ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cards.map(i => <div key={i}><HorizontalCard cfg={cfg} /></div>)}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(cfg.cardMinWidth, 140)}px, 1fr))`, gap: 12 }}>
          {cards.map(i => <div key={i}><VerticalCard cfg={cfg} /></div>)}
        </div>
      )}
    </div>
  );
}

// ── Card Tab ────────────────────────────────────────────────────
function CardTab({ presets, onSaveNew, onOverwrite, onDelete }) {
  const [cfg, setCfg] = useState(DEFAULT_CARD_CFG);
  const [layout, setLayout] = useState("vertical");
  const [panel, setPanel] = useState("elements");
  const [hint, setHint] = useState(null);
  const cardRef = useRef();

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
          {panel === "elements" && <>
            <SectionBox title="Visibility">
              <Toggle label="Thumbnail" value={cfg.showThumbnail} onChange={set("showThumbnail")} />
              <Toggle label="Label / badge" value={cfg.showLabel} onChange={set("showLabel")} />
              <Toggle label="Header" value={cfg.showHeader} onChange={set("showHeader")} />
              <Toggle label="Subtext" value={cfg.showSubtext} onChange={set("showSubtext")} />
              <Toggle label="Stat" value={cfg.showStat} onChange={set("showStat")} />
              <Toggle label="CTA button" value={cfg.showCTA} onChange={set("showCTA")} />
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
              </SectionBox>
            )}
            {cfg.showLabel && <SectionBox title="Label / badge">
              <TextField label="Text" value={cfg.labelText} onChange={set("labelText")} />
              <ColorRow label="Background" value={cfg.labelBg} onChange={set("labelBg")} />
              <ColorRow label="Text color" value={cfg.labelColor} onChange={set("labelColor")} />
              <Slider label="Border radius" value={cfg.labelRadius} min={0} max={20} onChange={set("labelRadius")} />
            </SectionBox>}
            {cfg.showStat && <SectionBox title="Stat">
              <TextField label="Value" value={cfg.statValue} onChange={set("statValue")} />
              <TextField label="Label" value={cfg.statLabel} onChange={set("statLabel")} />
              <ColorRow label="Value color" value={cfg.statValueColor} onChange={set("statValueColor")} />
              <ColorRow label="Label color" value={cfg.statLabelColor} onChange={set("statLabelColor")} />
            </SectionBox>}
            {cfg.showCTA && <SectionBox title="CTA button">
              <TextField label="Text" value={cfg.ctaText} onChange={set("ctaText")} />
              <ColorRow label="Background" value={cfg.ctaBg} onChange={set("ctaBg")} />
              <ColorRow label="Text color" value={cfg.ctaColor} onChange={set("ctaColor")} />
              <ColorRow label="Border color" value={cfg.ctaBorderColor} onChange={set("ctaBorderColor")} />
              <Slider label="Border radius" value={cfg.ctaRadius} min={0} max={24} onChange={set("ctaRadius")} />
            </SectionBox>}
          </>}

          {panel === "shape" && <>
            <SectionBox title="Card shape">
              <Slider label="Border radius" value={cfg.radius} min={0} max={32} onChange={set("radius")} />
              <Slider label="Border width" value={cfg.borderWidth} min={0} max={4} onChange={set("borderWidth")} />
              <Slider label="Padding" value={cfg.padding} min={0} max={40} onChange={set("padding")} hintKey="padding" onHint={setHint} />
              <Slider label="Element gap" value={cfg.gap} min={2} max={24} onChange={set("gap")} hintKey="gap" onHint={setHint} />
              {layout === "horizontal" && <Slider label="Card height" value={cfg.cardHeight} min={80} max={320} onChange={set("cardHeight")} />}
              <Slider label="Min card width" value={cfg.cardMinWidth} min={100} max={480} onChange={set("cardMinWidth")} />
            </SectionBox>
            <SectionBox title="Colors">
              <ColorRow label="Background" value={cfg.bgColor} onChange={set("bgColor")} />
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
              <ColorRow label="Color" value={cfg.headerColor} onChange={set("headerColor")} />
            </SectionBox>
            <SectionBox title="Subtext">
              <TextField label="Text" value={cfg.subtextText} onChange={set("subtextText")} />
              <Slider label="Font size" value={cfg.subtextSize} min={10} max={18} onChange={set("subtextSize")} />
              <ColorRow label="Color" value={cfg.subtextColor} onChange={set("subtextColor")} />
            </SectionBox>
          </>}

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
        </div>

        <div style={{ padding: "10px 14px", borderTop: "1px solid #e5e7eb", background: "#fff" }}>
          <button onClick={() => { setCfg(DEFAULT_CARD_CFG); setLayout("vertical"); }}
            style={{ width: "100%", fontSize: 11, padding: "6px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#6b7280", cursor: "pointer", fontFamily: "inherit" }}>Reset to default</button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "32px 24px", display: "flex", justifyContent: "center", alignItems: "flex-start", background: "#f3f4f6" }}>
        <div style={{ width: layout === "horizontal" ? 480 : 300 }}>
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
    </div>
  );
}

// ── Page Tab ─────────────────────────────────────────────────────
function PageTab({ presets, pageLayouts, onSaveLayout, onOverwriteLayout, onDeleteLayout }) {
  const [pageCfg, setPageCfg] = useState(DEFAULT_PAGE_CFG);
  const [sections, setSections] = useState([newSection()]);
  const [browserW, setBrowserW] = useState(390);
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
          <SectionBox title="Page settings">
            <ColorRow label="Background" value={pageCfg.bgColor} onChange={setPage("bgColor")} />
            <Slider label="Page padding" value={pageCfg.pagePadding} min={0} max={40} onChange={setPage("pagePadding")} />
            <Slider label="Section gap" value={pageCfg.sectionGap} min={8} max={64} onChange={setPage("sectionGap")} />
            <Slider label="Title font size" value={pageCfg.titleSize} min={12} max={28} onChange={setPage("titleSize")} />
          </SectionBox>

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
                      return <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 8px" }}>Horizontal cards stack in a single column.</p>;
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
        </div>

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
            <div style={{ height: 8, background: "#f3f4f6", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 32, height: 3, borderRadius: 2, background: "#d1d5db" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root ────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("card");
  const [presets, setPresets] = useState([]);
  const [pageLayouts, setPageLayouts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const pr = storage.get("presets");
    const pl = storage.get("pageLayouts");
    if (pr) setPresets(pr);
    if (pl) setPageLayouts(pl);
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

  const tabBtn = active => ({ fontSize: 13, padding: "6px 20px", borderRadius: 6, border: "none", background: active ? "#111827" : "transparent", color: active ? "#fff" : "#6b7280", cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 500 : 400 });

  if (!loaded) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontSize: 13, color: "#9ca3af" }}>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "8px 16px", background: "#fff", borderBottom: "1px solid #e5e7eb", gap: 4, flexShrink: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: "0 16px 0 0" }}>Design playground</p>
        <button style={tabBtn(tab === "card")} onClick={() => setTab("card")}>Card</button>
        <button style={tabBtn(tab === "page")} onClick={() => setTab("page")}>Page</button>
        <span style={{ fontSize: 11, color: "#d1d5db", marginLeft: 8 }}>{presets.length} preset{presets.length !== 1 ? "s" : ""} · {pageLayouts.length} layout{pageLayouts.length !== 1 ? "s" : ""} saved</span>
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {tab === "card" && <CardTab presets={presets} onSaveNew={savePreset} onOverwrite={overwritePreset} onDelete={deletePreset} />}
        {tab === "page" && <PageTab presets={presets} pageLayouts={pageLayouts} onSaveLayout={saveLayout} onOverwriteLayout={overwriteLayout} onDeleteLayout={deleteLayout} />}
      </div>
    </div>
  );
}
