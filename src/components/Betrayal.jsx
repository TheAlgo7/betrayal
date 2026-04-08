"use client";

import { useState, useMemo, useCallback, useEffect, useRef, createContext, useContext } from "react";

// ── Themes ────────────────────────────────────────────────────────────
const THEMES = {
  ig: {
    id: "ig",
    name: "IG Dark",
    label: "Grounded Optimism",
    bg: "#000000",
    surface: "#121212",
    surfaceRaised: "#1a1a1a",
    surfaceHover: "#222222",
    border: "#262626",
    borderLight: "#363636",
    pink: "#C13584",
    purple: "#833AB4",
    blue: "#405DE6",
    lavender: "#B4A7D6",
    sage: "#9CB89C",
    teal: "#2ABFBF",
    persimmon: "#E8734A",
    butterYellow: "#FCCC63",
    plum: "#4A1942",
    text: "#F5F5F5",
    textSecondary: "#A8A8A8",
    textTertiary: "#6B6B6B",
    danger: "#ED4956",
    success: "#78C257",
    radius: "16px",
    radiusSm: "12px",
    radiusXs: "8px",
    font: "var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif",
    fontMono: "var(--font-jetbrains-mono), 'SF Mono', monospace",
    fontDisplay: "var(--font-outfit), sans-serif",
    gradient: "linear-gradient(135deg, #FCCC63, #C13584, #833AB4, #405DE6)",
    gradientSubtle: "linear-gradient(135deg, #C1358418, #833AB418, #405DE618)",
    swatchColors: ["#C13584", "#833AB4", "#405DE6"],
  },
  disruption: {
    id: "disruption",
    name: "Grounded Disruption",
    label: "Dramatic Grounding",
    bg: "#101010",
    surface: "#181818",
    surfaceRaised: "#202020",
    surfaceHover: "#272727",
    border: "#2A2A2A",
    borderLight: "#3A3030",
    pink: "#7B1541",
    purple: "#9B1D4E",
    blue: "#E17A47",
    lavender: "#E5D8B6",
    sage: "#C4B08A",
    teal: "#D09060",
    persimmon: "#E17A47",
    butterYellow: "#E5D8B6",
    plum: "#4A0A28",
    text: "#E5D8B6",
    textSecondary: "#A89870",
    textTertiary: "#6B5A3E",
    danger: "#C0392B",
    success: "#7A8C5A",
    radius: "16px",
    radiusSm: "12px",
    radiusXs: "8px",
    font: "var(--font-dm-sans), -apple-system, BlinkMacSystemFont, sans-serif",
    fontMono: "var(--font-jetbrains-mono), 'SF Mono', monospace",
    fontDisplay: "var(--font-outfit), sans-serif",
    gradient: "linear-gradient(135deg, #7B1541, #9B1D4E, #E17A47)",
    gradientSubtle: "linear-gradient(135deg, #7B154118, #E17A4718)",
    swatchColors: ["#7B1541", "#9B1D4E", "#E17A47"],
  },
};

// ── Theme Context ─────────────────────────────────────────────────────
const ThemeCtx = createContext(THEMES.ig);
const useTheme = () => useContext(ThemeCtx);

// ── Parsing ────────────────────────────────────────────────────────────
function parseFollowersList(raw) {
  if (!raw?.trim()) return [];
  let text = raw.replace(/<[^>]*>/g, "\n").replace(/^Followers\s*/i, "");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const usernames = [];
  for (const line of lines) {
    if (/^[A-Z][a-z]{2}\s\d{1,2},\s\d{4}/i.test(line)) continue;
    if (/^profile\s*photo/i.test(line)) continue;
    if (line.length < 2) continue;
    if (/^[a-zA-Z0-9._]+$/.test(line)) usernames.push(line.toLowerCase());
  }
  return [...new Set(usernames)];
}

function parseFollowingList(raw) {
  if (!raw?.trim()) return [];
  let text = raw.replace(/<[^>]*>/g, "\n").replace(/^Following\s*/i, "").replace(/Profiles you choose to see content from/i, "");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const usernames = [];
  for (const line of lines) {
    if (/^[A-Z][a-z]{2}\s\d{1,2},\s\d{4}/i.test(line)) continue;
    if (/^https?:\/\//i.test(line)) continue;
    if (/^profile\s*photo/i.test(line)) continue;
    if (line.length < 2) continue;
    if (/^[a-zA-Z0-9._]+$/.test(line)) usernames.push(line.toLowerCase());
  }
  return [...new Set(usernames)];
}

function readFile(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsText(file);
  });
}

// ── Global CSS (theme-aware) ───────────────────────────────────────────
function makeGlobalCSS(T) {
  const glitch = T.id === "disruption" ? `
    @keyframes glitchBurst {
      0%, 100% { box-shadow: 0 6px 28px ${T.pink}44; }
      25%  { box-shadow: -3px 6px 28px ${T.pink}66, 3px 6px 20px ${T.blue}44; }
      75%  { box-shadow: 3px 6px 28px ${T.blue}66, -3px 6px 20px ${T.pink}44; }
    }
    .betrayal-cta:hover { animation: glitchBurst 0.5s ease-out; }
  ` : `
    .betrayal-cta:hover { box-shadow: 0 8px 36px ${T.pink}55 !important; }
  `;

  return `
    .betrayal-scroll::-webkit-scrollbar { width: 6px; }
    .betrayal-scroll::-webkit-scrollbar-track { background: ${T.surface}; border-radius: 3px; }
    .betrayal-scroll::-webkit-scrollbar-thumb { background: ${T.borderLight}; border-radius: 3px; }
    .betrayal-scroll::-webkit-scrollbar-thumb:hover { background: ${T.textTertiary}; }
    .betrayal-scroll { scrollbar-width: thin; scrollbar-color: ${T.borderLight} ${T.surface}; }

    .betrayal-row:hover .betrayal-action {
      border-color: transparent !important;
      background: ${T.surfaceRaised} !important;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-12px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.95) translateY(12px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    ${glitch}
  `;
}

// ── Profile Pic ────────────────────────────────────────────────────────
function ProfilePic({ username, size = 40 }) {
  const T = useTheme();
  const [failed, setFailed] = useState(false);
  const colors = [
    [T.pink, T.purple],
    [T.purple, T.blue],
    [T.blue, T.teal],
    [T.persimmon, T.butterYellow],
    [T.pink, T.butterYellow],
    [T.teal, T.sage],
  ];
  const hash = username.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const [c1, c2] = colors[hash % colors.length];

  if (failed) {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.4, fontWeight: 700, color: "#fff",
        textTransform: "uppercase", letterSpacing: "-0.5px",
      }}>
        {username[0]}
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${c1}44, ${c2}44)` }}>
      <img
        src={`https://unavatar.io/instagram/${username}?fallback=false`}
        alt=""
        onError={() => setFailed(true)}
        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
        loading="lazy"
      />
    </div>
  );
}

// ── Theme Card (used in onboarding) ───────────────────────────────────
function ThemeCard({ th, isSelected, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, border: `2px solid ${isSelected ? th.pink : "#333"}`,
      borderRadius: "14px", background: th.bg,
      cursor: "pointer", overflow: "hidden", padding: 0,
      boxShadow: isSelected ? `0 0 16px ${th.pink}44` : "none",
      transition: "all 0.25s",
    }}>
      <div style={{ height: "5px", background: th.gradient }} />
      <div style={{ padding: "12px 10px 10px" }}>
        <div style={{
          fontSize: "11px", fontWeight: 800, fontFamily: "var(--font-outfit), sans-serif",
          background: th.gradient, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent",
          marginBottom: "2px", letterSpacing: "-0.3px",
        }}>{th.name}</div>
        <div style={{ fontSize: "9px", color: th.textTertiary, marginBottom: "8px", letterSpacing: "0.3px" }}>{th.label}</div>
        <div style={{ display: "flex", gap: "4px" }}>
          {th.swatchColors.map((c, i) => (
            <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
          ))}
        </div>
      </div>
    </button>
  );
}

// ── Onboarding Modal ──────────────────────────────────────────────────
function OnboardingModal({ onClose, themeId, setThemeId }) {
  const T = useTheme();

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.88)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: "24px",
        maxWidth: "380px",
        width: "100%",
        padding: "32px 26px 26px",
        textAlign: "center",
        animation: "modalIn 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Logo */}
        <div style={{
          fontSize: "clamp(28px, 7vw, 36px)", fontWeight: 900,
          fontFamily: T.fontDisplay, letterSpacing: "-1.5px", margin: "0 0 2px",
          color: "#fff",
        }}>BETRAYAL</div>
        <p style={{ color: T.textTertiary, fontSize: "10px", margin: "0 0 20px", letterSpacing: "2px", textTransform: "uppercase" }}>
          Keep your circle real
        </p>

        {/* What it does */}
        <p style={{ color: T.textSecondary, fontSize: "13px", lineHeight: 1.75, margin: "0 0 22px", textAlign: "left" }}>
          Instagram doesn't tell you who unfollowed you. This app uses your <strong style={{ color: T.text }}>official Instagram data export</strong> to compare your followers and following lists — no logins, no third-party access, no account risk.
          <br /><br />
          Everything runs in your browser. Zero data leaves your device.
        </p>

        {/* Theme picker */}
        <div style={{
          border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
          padding: "14px", marginBottom: "20px", background: T.bg,
        }}>
          <p style={{ color: T.textTertiary, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 10px" }}>
            Pick your vibe
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            {Object.values(THEMES).map((th) => (
              <ThemeCard key={th.id} th={th} isSelected={themeId === th.id} onClick={() => setThemeId(th.id)} />
            ))}
          </div>
        </div>

        {/* Credits */}
        <p style={{ color: T.textTertiary, fontSize: "11px", margin: "0 0 18px" }}>
          Built by{" "}
          <a href="https://thealgothrim.com" target="_blank" rel="noopener noreferrer"
            style={{ color: T.lavender, textDecoration: "none", fontWeight: 600 }}>
            Gaurav Kumar
          </a>
          {" "}aka{" "}
          <a href="https://thealgothrim.com" target="_blank" rel="noopener noreferrer"
            style={{ color: T.lavender, fontWeight: 700, textDecoration: "none", fontFamily: T.fontDisplay }}>
            The Algothrim
          </a>
        </p>

        {/* CTA */}
        <button onClick={onClose} className="betrayal-cta" style={{
          width: "100%", padding: "14px", border: "none", borderRadius: T.radius,
          background: T.gradient, color: "#fff", fontSize: "14px", fontWeight: 700,
          fontFamily: T.font, cursor: "pointer", letterSpacing: "0.2px",
          boxShadow: `0 6px 28px ${T.pink}44`,
          transition: "transform 0.12s, box-shadow 0.2s",
        }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.985)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          Enter the circle →
        </button>
      </div>
    </div>
  );
}

// ── Theme Toggle Button ───────────────────────────────────────────────
function ThemeToggle({ themeId, onToggle }) {
  const T = useTheme();
  const [hov, setHov] = useState(false);
  const other = themeId === "ig" ? THEMES.disruption : THEMES.ig;

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={`Switch to ${other.name}`}
      style={{
        position: "absolute", top: "14px", right: "16px",
        background: hov ? T.surfaceRaised : T.surface,
        border: `1px solid ${hov ? T.borderLight : T.border}`,
        borderRadius: "20px", padding: "6px 10px",
        display: "flex", alignItems: "center", gap: "6px",
        cursor: "pointer", transition: "all 0.2s",
      }}
    >
      {Object.values(THEMES).map((th) => (
        <div
          key={th.id}
          style={{
            width: themeId === th.id ? 12 : 8,
            height: themeId === th.id ? 12 : 8,
            borderRadius: "50%",
            background: th.gradient,
            opacity: themeId === th.id ? 1 : 0.35,
            transition: "all 0.25s",
          }}
        />
      ))}
    </button>
  );
}

// ── Main App ───────────────────────────────────────────────────────────
export default function Betrayal() {
  const [themeId, setThemeIdState] = useState("ig");
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [step, setStep] = useState("input");
  const [followersRaw, setFollowersRaw] = useState("");
  const [followingRaw, setFollowingRaw] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("snakes");
  const [inputMode, setInputMode] = useState("paste");
  const [followerFile, setFollowerFile] = useState(null);
  const [followingFile, setFollowingFile] = useState(null);
  const [error, setError] = useState("");
  const [showDismissed, setShowDismissed] = useState(false);
  const [ready, setReady] = useState(false);

  const T = THEMES[themeId];

  // ── Persist theme ──────────────────────────────────────────────────
  const setThemeId = (id) => {
    setThemeIdState(id);
    try { localStorage.setItem("betrayal-theme", id); } catch {}
  };

  // ── localStorage hydration ─────────────────────────────────────────
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("betrayal-theme");
      if (savedTheme && THEMES[savedTheme]) setThemeIdState(savedTheme);

      const dismissed = localStorage.getItem("betrayal-dismissed");
      if (dismissed) setDismissed(JSON.parse(dismissed));

      const onboarded = localStorage.getItem("betrayal-onboarded");
      if (!onboarded) setShowOnboarding(true);
    } catch {}
  }, []);

  // ── Persist dismissed ──────────────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem("betrayal-dismissed", JSON.stringify(dismissed)); } catch {}
  }, [dismissed]);

  useEffect(() => {
    if (step === "results") setTimeout(() => setReady(true), 60);
    else setReady(false);
  }, [step]);

  const handleOnboardClose = () => {
    setShowOnboarding(false);
    try { localStorage.setItem("betrayal-onboarded", "1"); } catch {}
  };

  const handleCompare = useCallback(async () => {
    setError("");
    let fRaw = followersRaw, gRaw = followingRaw;
    if (inputMode === "upload") {
      if (!followerFile || !followingFile) { setError("Upload both files to continue."); return; }
      try { fRaw = await readFile(followerFile); gRaw = await readFile(followingFile); }
      catch { setError("Could not read files. Use text or HTML files."); return; }
    }
    const f = parseFollowersList(fRaw), g = parseFollowingList(gRaw);
    if (!f.length && !g.length) { setError("No usernames found. Check your pasted data or uploaded files."); return; }
    setFollowers(f); setFollowing(g); setStep("results");
  }, [followersRaw, followingRaw, inputMode, followerFile, followingFile]);

  const followersSet = useMemo(() => new Set(followers), [followers]);
  const followingSet = useMemo(() => new Set(following), [following]);

  const snakes = useMemo(() => following.filter((u) => !followersSet.has(u) && !dismissed.includes(u)), [following, followersSet, dismissed]);
  const fans = useMemo(() => followers.filter((u) => !followingSet.has(u)), [followers, followingSet]);
  const mutuals = useMemo(() => followers.filter((u) => followingSet.has(u)), [followers, followingSet]);
  const dismissedVisible = useMemo(() => following.filter((u) => !followersSet.has(u) && dismissed.includes(u)), [following, followersSet, dismissed]);

  const currentList = useMemo(() => {
    const lists = { snakes, fans, mutuals };
    const list = lists[tab] || [];
    return search ? list.filter((u) => u.includes(search.toLowerCase())) : list;
  }, [tab, snakes, fans, mutuals, search]);

  const handleReset = () => {
    setStep("input"); setFollowersRaw(""); setFollowingRaw(""); setFollowers([]); setFollowing([]);
    setFollowerFile(null); setFollowingFile(null); setSearch(""); setError(""); setTab("snakes");
  };

  const handleExport = () => {
    const blob = new Blob([currentList.map((u) => `@${u}`).join("\n")], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `betrayal-${tab}-${new Date().toISOString().slice(0, 10)}.txt`; a.click();
  };

  return (
    <ThemeCtx.Provider value={T}>
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, color: T.text, transition: "background 0.35s, color 0.35s" }}>
        <style>{makeGlobalCSS(T)}</style>

        {showOnboarding && (
          <OnboardingModal onClose={handleOnboardClose} themeId={themeId} setThemeId={setThemeId} />
        )}

        {/* ── HEADER ─────────────────────────────────── */}
        <header style={{ padding: "32px 20px 24px", textAlign: "center", borderBottom: `1px solid ${T.border}`, background: T.gradientSubtle, position: "relative" }}>
          <ThemeToggle themeId={themeId} onToggle={() => setThemeId(themeId === "ig" ? "disruption" : "ig")} />
          <h1 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(30px, 6vw, 42px)", fontWeight: 900, margin: 0, letterSpacing: "-2px", color: "#fff" }}>
            BETRAYAL
          </h1>
          <p style={{ color: T.textSecondary, fontSize: "13px", margin: "4px 0 0", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 500 }}>
            Keep your circle real
          </p>
        </header>

        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "20px 16px 60px" }}>

          {/* ── INPUT ────────────────────────────────── */}
          {step === "input" && (
            <div style={{ animation: "fadeUp 0.5s ease" }}>
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "16px 18px", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", color: T.textSecondary, margin: 0, lineHeight: 1.7 }}>
                  <span style={{ color: T.butterYellow, fontWeight: 600 }}>Step 1</span> — Instagram → Settings → Your Activity → Download Your Information<br />
                  <span style={{ color: T.persimmon, fontWeight: 600 }}>Step 2</span> — Select <em>Followers and Following</em> only → Format: <strong style={{ color: T.text }}>HTML</strong> → Submit<br />
                  <span style={{ color: T.teal, fontWeight: 600 }}>Step 3</span> — Download the zip from email → Upload or paste the data below
                </p>
              </div>

              <div style={{ display: "flex", gap: "2px", background: T.surface, borderRadius: T.radiusSm, padding: "3px", marginBottom: "20px", border: `1px solid ${T.border}` }}>
                {[{ id: "paste", label: "Paste Text" }, { id: "upload", label: "Upload Files" }].map((m) => (
                  <button key={m.id} onClick={() => setInputMode(m.id)} style={{
                    flex: 1, padding: "11px", border: "none", borderRadius: "10px", cursor: "pointer",
                    fontSize: "13px", fontWeight: 600, fontFamily: T.font,
                    background: inputMode === m.id ? T.gradient : "transparent",
                    color: inputMode === m.id ? "#fff" : T.textTertiary,
                    transition: "all 0.25s",
                  }}>{m.label}</button>
                ))}
              </div>

              {inputMode === "paste" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <PasteBox label="Followers List" hint="from followers.html" value={followersRaw} onChange={setFollowersRaw}
                    placeholder={"Followers\nusername_one\nApr 07, 2026 12:27 pm\nusername_two\nApr 07, 2026 12:05 pm\n..."} />
                  <PasteBox label="Following List" hint="from following.html" value={followingRaw} onChange={setFollowingRaw}
                    placeholder={"Following\nProfiles you choose to see content from\nusername_one\nhttps://instagram.com/...\nApr 07, 2026 12:27 pm\n..."} />
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <DropZone label="followers.html" file={followerFile} onFile={setFollowerFile} />
                  <DropZone label="following.html" file={followingFile} onFile={setFollowingFile} />
                </div>
              )}

              {error && (
                <div style={{ marginTop: "14px", padding: "12px 16px", background: `${T.danger}15`, border: `1px solid ${T.danger}30`, borderRadius: T.radiusSm, color: T.danger, fontSize: "13px" }}>
                  {error}
                </div>
              )}

              <button onClick={handleCompare} className="betrayal-cta" style={{
                width: "100%", marginTop: "22px", padding: "16px", border: "none", borderRadius: T.radius,
                background: T.gradient, color: "#fff", fontSize: "15px", fontWeight: 700, fontFamily: T.font,
                cursor: "pointer", letterSpacing: "0.2px",
                boxShadow: `0 6px 28px ${T.pink}44`,
                transition: "transform 0.12s, box-shadow 0.2s",
              }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.985)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                Expose the Betrayers
              </button>
            </div>
          )}

          {/* ── RESULTS ──────────────────────────────── */}
          {step === "results" && (
            <div style={{ animation: "fadeUp 0.45s cubic-bezier(0.16,1,0.3,1)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "18px" }}>
                <Stat label="Followers" value={followers.length} gradient={`linear-gradient(135deg, ${T.blue}, ${T.purple})`} />
                <Stat label="Following" value={following.length} gradient={`linear-gradient(135deg, ${T.pink}, ${T.persimmon})`} />
                <Stat label="Mutuals" value={mutuals.length} gradient={`linear-gradient(135deg, ${T.teal}, ${T.sage})`} />
                <Stat label="Snakes" value={snakes.length + dismissedVisible.length} gradient={`linear-gradient(135deg, ${T.butterYellow}, ${T.persimmon})`} />
              </div>

              <div style={{ display: "flex", gap: "6px", marginBottom: "14px", overflowX: "auto", paddingBottom: "2px" }}>
                {[
                  { id: "snakes", label: "Not Following Back", count: snakes.length, color: T.pink },
                  { id: "fans", label: "Your Fans", count: fans.length, color: T.blue },
                  { id: "mutuals", label: "Mutuals", count: mutuals.length, color: T.teal },
                ].map((t) => (
                  <button key={t.id} onClick={() => setTab(t.id)} style={{
                    flex: 1, padding: "10px 6px", border: "none", borderRadius: T.radiusSm, cursor: "pointer",
                    fontSize: "12px", fontWeight: 600, fontFamily: T.font, whiteSpace: "nowrap",
                    background: tab === t.id ? `${t.color}22` : T.surface,
                    color: tab === t.id ? t.color : T.textTertiary,
                    border: tab === t.id ? `1px solid ${t.color}44` : `1px solid ${T.border}`,
                    transition: "all 0.2s",
                  }}>
                    {t.label} <span style={{ opacity: 0.7 }}>({t.count})</span>
                  </button>
                ))}
              </div>

              <div style={{ position: "relative", marginBottom: "12px" }}>
                <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.textTertiary} strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input type="text" placeholder="Search usernames..." value={search} onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px 12px 42px", border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
                    background: T.surface, color: T.text, fontSize: "13px", fontFamily: T.font, outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = T.purple)}
                  onBlur={(e) => (e.target.style.borderColor = T.border)}
                />
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap", alignItems: "center" }}>
                {tab === "snakes" && dismissedVisible.length > 0 && (
                  <Pill onClick={() => setShowDismissed(!showDismissed)} active={showDismissed} activeColor={T.butterYellow}>
                    {showDismissed ? "Hide" : "Show"} Dismissed ({dismissedVisible.length})
                  </Pill>
                )}
                <div style={{ flex: 1 }} />
                <Pill onClick={handleExport}>↓ Export</Pill>
                <Pill onClick={handleReset}>← New Scan</Pill>
              </div>

              {showDismissed && dismissedVisible.length > 0 && (
                <div style={{
                  background: `${T.butterYellow}0A`, border: `1px solid ${T.butterYellow}22`,
                  borderRadius: T.radius, padding: "14px", marginBottom: "14px",
                }}>
                  <p style={{ fontSize: "11px", color: T.butterYellow, margin: "0 0 10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Dismissed — tap to restore
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {dismissedVisible.map((u) => (
                      <button key={u} onClick={() => setDismissed((p) => p.filter((x) => x !== u))} style={{
                        padding: "5px 12px 5px 6px", border: "none", borderRadius: "20px",
                        background: `${T.butterYellow}18`, color: T.butterYellow,
                        fontSize: "12px", fontFamily: T.fontMono, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "6px",
                        transition: "background 0.15s",
                      }}>
                        <ProfilePic username={u} size={20} />
                        @{u} ✕
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden" }}>
                {currentList.length === 0 ? (
                  <div style={{ padding: "48px 20px", textAlign: "center", color: T.textTertiary, fontSize: "14px" }}>
                    {search ? "No usernames match your search" :
                      tab === "snakes" ? "Everyone you follow is following you back! No betrayers here 🎉" :
                      tab === "fans" ? "You follow everyone who follows you" :
                      "No mutual connections found"}
                  </div>
                ) : (
                  <div className="betrayal-scroll" style={{ maxHeight: "520px", overflowY: "auto" }}>
                    {currentList.map((username, i) => (
                      <UserRow key={username} username={username} idx={i} canDismiss={tab === "snakes"} ready={ready}
                        onDismiss={() => setDismissed((p) => [...p, username])} />
                    ))}
                  </div>
                )}
              </div>

              <p style={{ fontSize: "11px", color: T.textTertiary, textAlign: "center", marginTop: "20px", lineHeight: 1.6 }}>
                All processing happens locally in your browser. Zero data leaves your device.
              </p>
            </div>
          )}

          {/* ── FOOTER ───────────────────────────────── */}
          <footer style={{ marginTop: "40px", paddingTop: "20px", borderTop: `1px solid ${T.border}`, textAlign: "center" }}>
            <p style={{ fontSize: "11px", color: T.textTertiary, margin: 0 }}>
              Built by{" "}
              <a href="https://thealgothrim.com" target="_blank" rel="noopener noreferrer"
                style={{ color: T.lavender, textDecoration: "none", fontWeight: 600, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.target.style.color = T.pink)}
                onMouseLeave={(e) => (e.target.style.color = T.lavender)}
              >
                Gaurav Kumar
              </a>
              {" "}aka{" "}
              <a href="https://thealgothrim.com" target="_blank" rel="noopener noreferrer"
                style={{ color: T.lavender, fontWeight: 700, textDecoration: "none", fontFamily: T.fontDisplay }}>
                The Algothrim
              </a>
            </p>
          </footer>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────

function PasteBox({ label, hint, value, onChange, placeholder }) {
  const T = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
        <label style={{ fontSize: "13px", fontWeight: 600, color: T.text }}>{label}</label>
        <span style={{ fontSize: "11px", color: T.textTertiary }}>{hint}</span>
      </div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={7}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "14px", borderRadius: T.radiusSm, background: T.bg,
          color: T.text, fontSize: "12px", fontFamily: T.fontMono, lineHeight: 1.7,
          resize: "vertical", outline: "none", boxSizing: "border-box",
          border: `1px solid ${focused ? T.purple : T.border}`,
          transition: "border-color 0.25s",
        }} />
    </div>
  );
}

function DropZone({ label, file, onFile }) {
  const T = useTheme();
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);
  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]); }}
      style={{
        padding: "30px 20px", borderRadius: T.radius, textAlign: "center", cursor: "pointer",
        border: `2px dashed ${file ? T.success : drag ? T.purple : T.border}`,
        background: file ? `${T.success}0A` : drag ? `${T.purple}0A` : T.surface,
        transition: "all 0.25s",
      }}
    >
      <input ref={ref} type="file" accept=".html,.txt" style={{ display: "none" }}
        onChange={(e) => onFile(e.target.files[0])} />
      <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: file ? T.success : T.textSecondary }}>
        {file ? `✓ ${file.name}` : `Drop or tap to upload ${label}`}
      </p>
      <p style={{ margin: "4px 0 0", fontSize: "11px", color: T.textTertiary }}>
        {file ? `${(file.size / 1024).toFixed(1)} KB` : ".html or .txt accepted"}
      </p>
    </div>
  );
}

function Stat({ label, value, gradient }) {
  const T = useTheme();
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "14px 6px", textAlign: "center" }}>
      <div style={{
        fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, fontFamily: T.fontDisplay,
        background: gradient, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent",
        letterSpacing: "-0.5px",
      }}>{value.toLocaleString()}</div>
      <div style={{ fontSize: "9px", color: T.textTertiary, marginTop: "3px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>
        {label}
      </div>
    </div>
  );
}

function Pill({ children, onClick, active, activeColor }) {
  const T = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "7px 14px", borderRadius: "20px", cursor: "pointer",
        fontSize: "12px", fontWeight: 500, fontFamily: T.font,
        border: `1px solid ${active ? `${activeColor}44` : T.border}`,
        background: active ? `${activeColor}15` : hov ? T.surfaceRaised : T.surface,
        color: active ? activeColor : hov ? T.textSecondary : T.textTertiary,
        transition: "all 0.2s",
      }}>{children}</button>
  );
}

function UserRow({ username, idx, canDismiss, onDismiss, ready }) {
  const T = useTheme();
  const [hov, setHov] = useState(false);
  const [dismissed, setDismissedLocal] = useState(false);

  if (dismissed) return null;

  return (
    <div className="betrayal-row"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", padding: "10px 16px", gap: "12px",
        borderBottom: `1px solid ${T.border}`,
        background: hov ? T.surfaceHover : "transparent",
        transition: "background 0.15s",
        animation: ready ? `slideIn 0.35s ease ${Math.min(idx * 25, 500)}ms both` : "none",
      }}
    >
      <ProfilePic username={username} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <a href={`https://instagram.com/${username}`} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "13.5px", fontFamily: T.fontMono, color: T.text, textDecoration: "none", fontWeight: 500, display: "block" }}>
          @{username}
        </a>
      </div>
      <a href={`https://instagram.com/${username}`} target="_blank" rel="noopener noreferrer"
        className="betrayal-action"
        style={{
          fontSize: "11px", color: hov ? T.lavender : T.textTertiary, textDecoration: "none",
          padding: "6px 12px", borderRadius: T.radiusXs,
          border: `1px solid ${hov ? T.lavender + "44" : "transparent"}`,
          background: hov ? `${T.lavender}12` : "transparent",
          transition: "all 0.2s", fontWeight: 500, fontFamily: T.font,
        }}>
        Open
      </a>
      {canDismiss && (
        <button className="betrayal-action" onClick={() => { setDismissedLocal(true); setTimeout(onDismiss, 150); }}
          style={{
            fontSize: "11px", color: hov ? T.butterYellow : T.textTertiary,
            padding: "6px 12px", borderRadius: T.radiusXs, cursor: "pointer",
            border: `1px solid ${hov ? T.butterYellow + "44" : "transparent"}`,
            background: hov ? `${T.butterYellow}12` : "transparent",
            fontWeight: 500, fontFamily: T.font, transition: "all 0.2s",
          }}>
          Dismiss
        </button>
      )}
    </div>
  );
}
