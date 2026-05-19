"use client";

import { useState, useEffect, useMemo, useRef } from "react";

/* ── helpers ── */
function parseHTML(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const links = doc.querySelectorAll("a[href]");
  const users = [], seen = new Set();
  links.forEach((a) => {
    const href = a.getAttribute("href") || "";
    const text = (a.textContent || "").trim();
    const m = href.match(/instagram\.com\/([^/?#]+)/i);
    const handle = m ? m[1] : text.startsWith("@") ? text.slice(1) : text;
    if (handle && handle.length > 0 && handle !== "instagram" && !seen.has(handle.toLowerCase())) {
      seen.add(handle.toLowerCase());
      users.push({ handle: handle.toLowerCase(), displayHandle: handle, href });
    }
  });
  return users;
}

function validateAndSet(which, html) {
  if (!html || !html.includes("instagram.com")) return { users: null, error: `This doesn't look like a valid ${which}.html from an Instagram export. Make sure you're using HTML format.` };
  const users = parseHTML(html);
  if (users.length === 0) return { users: null, error: `No accounts found. Check you selected ${which}.html (HTML format, not JSON).` };
  const warning = users.length < 3 ? `Only ${users.length} account${users.length === 1 ? "" : "s"} found. Double-check the file.` : null;
  return { users, warning };
}

function downloadCSV(data, label) {
  if (!data.length) return;
  const header = "username,profile_url\n";
  const rows = data.map((u) => `${u.displayHandle},https://www.instagram.com/${u.displayHandle}/`).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `betrayal-${label}-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

const DEMO_FOLLOWERS = ["alex.wanderer","photo_by_nina","mikedraws","lia.creates","sunsetlens","techbro_mike","wanderlust.jess","code.and.coffee","theclimber","minimal.moods","urban.stories","lena_shots","bentheboston","coffeelover99","desertwinds","mountain.kate","the.data.guy","pixel.poet","quietlunch","salmonsays"];
const DEMO_FOLLOWING = ["alex.wanderer","photo_by_nina","sunsetlens","techbro_mike","wanderlust.jess","code.and.coffee","theclimber","notfollowingback1","ghost.acc","absent.user","noreply.sam","lurker.mode","shadow.user42","bentheboston","the.data.guy","pixel.poet","quietlunch","salmonsays","minimal.moods","unknown.entity","disconnected.dan","faded.out.frank"];
const mkUsers = (handles) => handles.map((h) => ({ handle: h.toLowerCase(), displayHandle: h, href: `https://www.instagram.com/${h}/` }));

const STEPS = [
  { img: "/steps/step_1.webp",  screenAlt: "Instagram profile screen with the three-line menu icon highlighted in the top-right corner", text: "Open Instagram and go to the profile of the account you want unfollower data for. Tap the three-line menu (☰) in the top-right corner." },
  { img: "/steps/step_2.webp",  screenAlt: "Instagram Settings & Activity page with Accounts Center link highlighted at the top", text: "On the Settings & Activity page, tap Accounts Center at the top." },
  { img: "/steps/step_3.webp",  screenAlt: "Accounts Center page with Your information and permissions option visible", text: "Inside Accounts Center, tap Your information and permissions." },
  { img: "/steps/step_4.webp",  screenAlt: "Your information and permissions page with Export your information option highlighted", text: "Tap Export your information." },
  { img: "/steps/step_5.webp",  screenAlt: "Export your information page showing a blue Create export button", text: "Tap the blue Create export button." },
  { img: "/steps/step_6.webp",  screenAlt: "Meta accounts selection screen showing an Instagram account to choose", text: "Your Meta accounts appear. Select the Instagram account you want data from." },
  { img: "/steps/step_7.webp",  screenAlt: "Choose where to export page with Export to device option highlighted", text: "On the Choose where to export page, tap Export to device." },
  { img: "/steps/step_8.webp",  screenAlt: "Confirm your export page with Customise information button highlighted", text: "On the Confirm your export page, tap Customise information." },
  { img: "/steps/step_9.webp",  screenAlt: "Information customisation page with only the Followers and following checkbox checked under Connections", text: "Unselect everything on the page. Under the Connections section, check only Followers and following. Tap Save." },
  { img: "/steps/step_10.webp", screenAlt: "Date range selector screen with All time option selected", text: "Back on the export page, tap Date range. Select All time, then tap Save." },
  { img: "/steps/step_11.webp", screenAlt: "Confirm your export page showing Followers and following and All time settings, with Start export button", text: "You're back on Confirm your export. Check that Customise information shows Followers and following and Date range shows All time. Tap Start export." },
  { img: "/steps/step_12.webp", screenAlt: "Instagram password re-entry screen to confirm the export request", text: "Re-enter your Instagram password to confirm, then tap Continue." },
  { img: "/steps/step_13.webp", screenAlt: "Popup overlay confirming that the export is being prepared with an estimated wait time", text: "A popup confirms your export is being prepared. Wait 5–15 minutes for Instagram to email your download link." },
  { img: "/steps/step_14.webp", screenAlt: "Gmail inbox showing an email from Instagram titled Meta information download is ready", text: "Open Gmail. You'll get an email from Instagram saying your Meta information download is ready. Tap export your information in the email and download the ZIP." },
  { img: null,                  text: "You're back in Betrayal. Extract the ZIP, then upload followers.html and following.html (much easier), or paste their contents directly. Tap Compare Lists to see your unfollowers." },
];

/* ── icons ── */
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="9.5" y1="9.5" x2="12.5" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconDownload = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M6.5 1v8M6.5 9l-2.5-2.5M6.5 9l2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 9.5V12h11V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconRefresh = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M1.5 6.5a5 5 0 1 1 1.2 3.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M1.5 9.5V6.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconInfo = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 10V7m0-2.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconPaste = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 5h6M4 7.5h6M4 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconUpload = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M7 9V2M7 2L4.5 4.5M7 2l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.5 9v2.5a1 1 0 001 1h9a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconMoon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M13 9.5A6.5 6.5 0 0 1 5.5 2a5.5 5.5 0 1 0 7.5 7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconSun = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.1 3.1l1.06 1.06M10.84 10.84l1.06 1.06M11.9 3.1l-1.06 1.06M4.16 10.84l-1.06 1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconX = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconExternalLink = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <path d="M5 2H2a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 1h3v3M10 1L6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconUndo = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M2.5 6A4.5 4.5 0 1 0 3.7 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2.5 1.5v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3 9l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconFolder = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M3 8a2 2 0 012-2h5l2 2h11a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

/* ── main component ── */
export default function Betrayal() {
  const [theme, setTheme] = useState("dark");
  const [screen, setScreen] = useState("input");
  const [inputMode, setInputMode] = useState("paste");
  const [onboarding, setOnboarding] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  const [pasteFollowers, setPasteFollowers] = useState("");
  const [pasteFollowing, setPasteFollowing] = useState("");
  const [rawFollowers, setRawFollowers] = useState(null);
  const [rawFollowing, setRawFollowing] = useState(null);
  const [errFollowers, setErrFollowers] = useState("");
  const [errFollowing, setErrFollowing] = useState("");

  const [betrayal, setBetrayal] = useState([]);
  const [fans, setFans] = useState([]);
  const [mutuals, setMutuals] = useState([]);
  const [currentTab, setCurrentTab] = useState("betrayal");
  const [searchQuery, setSearchQuery] = useState("");
  const [dismissed, setDismissed] = useState(new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const [dragOverFollowers, setDragOverFollowers] = useState(false);
  const [dragOverFollowing, setDragOverFollowing] = useState(false);
  const [uploadedFollowers, setUploadedFollowers] = useState(null);
  const [uploadedFollowing, setUploadedFollowing] = useState(null);

  const announceRef = useRef(null);
  const onboardingRef = useRef(null);
  const guideRef = useRef(null);
  const prevFocusRef = useRef(null);
  const swipeTouchStartX = useRef(null);
  const swipeTouchStartY = useRef(null);
  const modeTouchStartX = useRef(null);
  const modeTouchStartY = useRef(null);
  const [modeAnimating, setModeAnimating] = useState(false);

  function announce(msg) {
    if (announceRef.current) {
      announceRef.current.textContent = "";
      requestAnimationFrame(() => { if (announceRef.current) announceRef.current.textContent = msg; });
    }
  }

  /* ── init ── */
  useEffect(() => {
    try {
      const t = localStorage.getItem("betrayal-theme") || "dark";
      setTheme(t);
      document.documentElement.setAttribute("data-theme", t);
    } catch {}
    try {
      const d = JSON.parse(localStorage.getItem("betrayal-dismissed") || "[]");
      setDismissed(new Set(d));
    } catch {}
    try {
      if (localStorage.getItem("betrayal-mode") === "upload") setInputMode("upload");
    } catch {}
    try {
      if (!localStorage.getItem("betrayal-seen")) setOnboarding(true);
    } catch { setOnboarding(true); }
  }, []);

  /* ── focus trap: onboarding ── */
  useEffect(() => {
    if (!onboarding) return;
    const raf = requestAnimationFrame(() => {
      if (!onboardingRef.current) return;
      const els = onboardingRef.current.querySelectorAll('button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])');
      if (els.length) els[0].focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [onboarding]);

  /* ── guide image preloading ── */
  useEffect(() => {
    if (!showGuide) return;
    const preloadImg = (src) => {
      if (!src) return;
      const img = new window.Image();
      img.src = src;
    };
    // Immediate: current + adjacent
    preloadImg(STEPS[guideStep]?.img);
    preloadImg(STEPS[guideStep + 1]?.img);
    preloadImg(STEPS[guideStep - 1]?.img);
    // Deferred: rest of the guide
    const t = setTimeout(() => {
      STEPS.forEach((s, i) => {
        if (i !== guideStep && i !== guideStep + 1 && i !== guideStep - 1) {
          preloadImg(s.img);
        }
      });
    }, 400);
    return () => clearTimeout(t);
  }, [showGuide, guideStep]);

  /* ── focus trap: guide ── */
  useEffect(() => {
    if (showGuide) {
      prevFocusRef.current = document.activeElement;
      const raf = requestAnimationFrame(() => {
        if (!guideRef.current) return;
        const els = guideRef.current.querySelectorAll('button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])');
        if (els.length) els[0].focus();
      });
      return () => cancelAnimationFrame(raf);
    } else {
      if (prevFocusRef.current) { prevFocusRef.current.focus(); prevFocusRef.current = null; }
    }
  }, [showGuide]);

  function applyTheme(t) {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("betrayal-theme", t); } catch {}
  }

  function toggleTheme() {
    applyTheme(theme === "dark" ? "light" : "dark");
  }

  function closeOnboarding() {
    setOnboarding(false);
    try { localStorage.setItem("betrayal-seen", "1"); } catch {}
  }

  function openGuide(step = 0) {
    setGuideStep(step);
    setShowGuide(true);
  }

  function closeGuide() { setShowGuide(false); }

  function handleHowToFromOnboarding() {
    setOnboarding(false);
    try { localStorage.setItem("betrayal-seen", "1"); } catch {}
    setGuideStep(0);
    setShowGuide(true);
  }

  function handleDemoFromOnboarding() {
    closeOnboarding();
    loadDemoData();
  }

  /* ── guide keyboard nav ── */
  function handleGuideKeyDown(e) {
    if (e.key === "Escape") { closeGuide(); return; }
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setGuideStep(s => Math.min(s + 1, STEPS.length - 1));
      return;
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setGuideStep(s => Math.max(s - 1, 0));
      return;
    }
    if (e.key !== "Tab" || !guideRef.current) return;
    const focusable = Array.from(guideRef.current.querySelectorAll('button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])'));
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function handleGuideTouchStart(e) {
    swipeTouchStartX.current = e.touches[0].clientX;
    swipeTouchStartY.current = e.touches[0].clientY;
  }

  function handleGuideTouchEnd(e) {
    if (swipeTouchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - swipeTouchStartX.current;
    const dy = e.changedTouches[0].clientY - swipeTouchStartY.current;
    swipeTouchStartX.current = null;
    swipeTouchStartY.current = null;
    if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) setGuideStep(s => Math.min(s + 1, STEPS.length - 1));
    else setGuideStep(s => Math.max(s - 1, 0));
  }

  function handleModeTouchStart(e) {
    modeTouchStartX.current = e.touches[0].clientX;
    modeTouchStartY.current = e.touches[0].clientY;
  }

  function handleModeTouchEnd(e) {
    if (modeTouchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - modeTouchStartX.current;
    const dy = e.changedTouches[0].clientY - modeTouchStartY.current;
    modeTouchStartX.current = null;
    modeTouchStartY.current = null;
    if (Math.abs(dx) < 44 || Math.abs(dy) > Math.abs(dx)) return;
    const next = dx < 0 ? "upload" : "paste";
    if (next !== inputMode) { switchInputMode(next); setModeAnimating(true); }
  }

  function switchInputMode(mode) {
    setInputMode(mode);
    try { localStorage.setItem("betrayal-mode", mode); } catch {}
  }

  /* ── paste ── */
  function onPasteFollowers(val) {
    setPasteFollowers(val);
    setErrFollowers("");
    if (!val.trim()) { setRawFollowers(null); return; }
    const { users, error, warning } = validateAndSet("followers", val);
    if (error) { setErrFollowers(error); setRawFollowers(null); }
    else { if (warning) setErrFollowers(warning); setRawFollowers(users); }
  }

  function onPasteFollowing(val) {
    setPasteFollowing(val);
    setErrFollowing("");
    if (!val.trim()) { setRawFollowing(null); return; }
    const { users, error, warning } = validateAndSet("following", val);
    if (error) { setErrFollowing(error); setRawFollowing(null); }
    else { if (warning) setErrFollowing(warning); setRawFollowing(users); }
  }

  /* ── file upload ── */
  function readFile(file, which) {
    const r = new FileReader();
    r.onload = (e) => {
      const html = e.target.result;
      const { users, error, warning } = validateAndSet(which, html);
      if (which === "followers") {
        if (error) { setErrFollowers(error); setRawFollowers(null); setUploadedFollowers(null); }
        else {
          if (warning) setErrFollowers(warning); else setErrFollowers("");
          setRawFollowers(users);
          setUploadedFollowers({ name: file.name, count: users.length });
        }
      } else {
        if (error) { setErrFollowing(error); setRawFollowing(null); setUploadedFollowing(null); }
        else {
          if (warning) setErrFollowing(warning); else setErrFollowing("");
          setRawFollowing(users);
          setUploadedFollowing({ name: file.name, count: users.length });
        }
      }
    };
    r.readAsText(file);
  }

  /* ── compare ── */
  function runCompare() {
    if (!rawFollowers || !rawFollowing) return;
    const fSet = new Set(rawFollowers.map((u) => u.handle));
    const gSet = new Set(rawFollowing.map((u) => u.handle));
    setBetrayal(rawFollowing.filter((u) => !fSet.has(u.handle)));
    setFans(rawFollowers.filter((u) => !gSet.has(u.handle)));
    setMutuals(rawFollowing.filter((u) => fSet.has(u.handle)));
    setCurrentTab("betrayal");
    setSearchQuery("");
    setSearchOpen(false);
    setScreen("results");
    window.scrollTo({ top: 0 });
    const b = rawFollowing.filter((u) => !fSet.has(u.handle)).length;
    const f = rawFollowers.filter((u) => !gSet.has(u.handle)).length;
    const m = rawFollowing.filter((u) => fSet.has(u.handle)).length;
    announce(`Comparison complete. ${b} unfollowers, ${f} fans, ${m} mutuals.`);
  }

  function goHome() { setScreen("input"); setSearchOpen(false); window.scrollTo({ top: 0 }); }

  /* ── dismiss ── */
  function dismissUser(handle) {
    const next = new Set(dismissed); next.add(handle); setDismissed(next);
    try { localStorage.setItem("betrayal-dismissed", JSON.stringify([...next])); } catch {}
    announce(`@${handle} dismissed.`);
  }
  function restoreUser(handle) {
    const next = new Set(dismissed); next.delete(handle); setDismissed(next);
    try { localStorage.setItem("betrayal-dismissed", JSON.stringify([...next])); } catch {}
    announce(`@${handle} restored.`);
  }
  function restoreAll() {
    const tabData = currentTab === "betrayal" ? betrayal : currentTab === "fans" ? fans : mutuals;
    const next = new Set(dismissed);
    tabData.forEach((u) => next.delete(u.handle));
    setDismissed(next);
    try { localStorage.setItem("betrayal-dismissed", JSON.stringify([...next])); } catch {}
    announce("All dismissed accounts restored.");
  }

  /* ── export ── */
  function doExport() {
    const tabData = currentTab === "betrayal" ? betrayal : currentTab === "fans" ? fans : mutuals;
    const data = tabData.filter((u) => !dismissed.has(u.handle));
    if (!data.length) { announce("Nothing to export."); return; }
    const labels = { betrayal: "unfollowers", fans: "fans", mutuals: "mutuals" };
    downloadCSV(data, labels[currentTab]);
    announce(`Exported ${data.length} accounts as CSV.`);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2000);
  }

  /* ── demo ── */
  function loadDemoData() {
    const rf = mkUsers(DEMO_FOLLOWERS);
    const rg = mkUsers(DEMO_FOLLOWING);
    setRawFollowers(rf);
    setRawFollowing(rg);
    setPasteFollowers(`<!-- Demo: ${rf.length} followers -->`);
    setPasteFollowing(`<!-- Demo: ${rg.length} following -->`);
    setErrFollowers(""); setErrFollowing("");
    announce("Demo data loaded. Hit Compare to see results.");
  }

  /* ── derived ── */
  const canCompare = useMemo(() => !!(rawFollowers?.length && rawFollowing?.length), [rawFollowers, rawFollowing]);

  const compareHint = useMemo(() => {
    if (!rawFollowers && !rawFollowing) return "Paste or upload both files to compare";
    if (!rawFollowers) return "Still need followers.html";
    if (!rawFollowing) return "Still need following.html";
    return `${rawFollowers.length} followers · ${rawFollowing.length} following, ready!`;
  }, [rawFollowers, rawFollowing]);

  const tabData = useMemo(
    () => currentTab === "betrayal" ? betrayal : currentTab === "fans" ? fans : mutuals,
    [currentTab, betrayal, fans, mutuals]
  );

  const activeQuery = searchQuery.toLowerCase().trim();

  const filtered = useMemo(() => {
    if (!activeQuery) return tabData;
    return tabData.filter((u) => u.handle.includes(activeQuery) || u.displayHandle.toLowerCase().includes(activeQuery));
  }, [tabData, activeQuery]);

  const dismissedInTab = useMemo(
    () => tabData.filter((u) => dismissed.has(u.handle)).length,
    [tabData, dismissed]
  );

  /* ── render ── */
  return (
    <>
      <div ref={announceRef} aria-live="polite" aria-atomic="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }} />

      {/* ── Onboarding overlay ── */}
      {onboarding && (
        <div className="onboarding-overlay" ref={onboardingRef} role="dialog" aria-modal="true" aria-label="Welcome to Betrayal">
          <div className="ob-glow" aria-hidden="true" />
          <div className="onboarding-card">
            <div className="ob-logo"><span className="w-accent">B</span>ETRAYAL</div>
            <div className="ob-tagline">Keep your circle real</div>
            <p className="ob-desc">
              Find out exactly who stopped following you on Instagram. No login, no scraping. Everything stays in your browser.
            </p>

            <div className="ob-theme-row">
              <span className="ob-theme-label">Theme</span>
              <div className="ob-theme-choices" role="group" aria-label="Choose theme">
                <button
                  className={`ob-theme-choice${theme === "dark" ? " active" : ""}`}
                  onClick={() => applyTheme("dark")}
                  aria-pressed={theme === "dark"}
                >
                  <IconMoon /> Dark
                </button>
                <button
                  className={`ob-theme-choice${theme === "light" ? " active" : ""}`}
                  onClick={() => applyTheme("light")}
                  aria-pressed={theme === "light"}
                >
                  <IconSun /> Light
                </button>
              </div>
            </div>

            <div className="ob-ctas">
              <button className="ob-cta-primary" onClick={handleHowToFromOnboarding}>
                How to export data from Instagram →
              </button>
              <button className="ob-cta-secondary" onClick={closeOnboarding}>
                I have my files, let&apos;s go
              </button>
              <button className="ob-cta-demo" onClick={handleDemoFromOnboarding}>
                try demo first
              </button>
            </div>

            <div className="ob-credit">
              Built by{" "}
              <a href="https://www.thealgothrim.com" target="_blank" rel="noopener noreferrer" className="ob-credit-link">
                Gaurav - The Algothrim
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Guide overlay ── */}
      {showGuide && (
        <div
          className="guide-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-title"
          ref={guideRef}
          onKeyDown={handleGuideKeyDown}
          onClick={(e) => { if (e.target === e.currentTarget) closeGuide(); }}
        >
          <div className="guide-modal" onTouchStart={handleGuideTouchStart} onTouchEnd={handleGuideTouchEnd}>
            <div className="guide-drag-handle" aria-hidden="true" />
            <div className="guide-header">
              <span className="guide-title" id="guide-title">Export guide</span>
              <button className="guide-close" onClick={closeGuide} aria-label="Close guide"><IconX /></button>
            </div>

            <div className="guide-body">
              <div className="guide-left">
                <div className="guide-left-content">
                  <div className="guide-step-num">{String(guideStep + 1).padStart(2, "0")}</div>
                  <p className="guide-step-text">{STEPS[guideStep].text}</p>
                </div>
                <div className="guide-left-footer">
                  <div
                    className="guide-progress"
                    role="progressbar"
                    aria-valuenow={guideStep + 1}
                    aria-valuemin={1}
                    aria-valuemax={STEPS.length}
                    aria-label={`Step ${guideStep + 1} of ${STEPS.length}`}
                  >
                    <div className="guide-progress-fill" style={{ width: `${(guideStep / (STEPS.length - 1)) * 100}%` }} />
                  </div>
                  <div className="guide-nav">
                    <button
                      className="guide-nav-btn"
                      onClick={() => setGuideStep(s => Math.max(s - 1, 0))}
                      disabled={guideStep === 0}
                      aria-label="Previous step"
                    >
                      <IconChevronLeft />
                    </button>
                    <span className="guide-nav-count" aria-hidden="true">{guideStep + 1} / {STEPS.length}</span>
                    {guideStep < STEPS.length - 1 ? (
                      <button
                        className="guide-nav-btn next"
                        onClick={() => setGuideStep(s => s + 1)}
                        aria-label="Next step"
                      >
                        <IconChevronRight />
                      </button>
                    ) : (
                      <button
                        className="guide-nav-btn done"
                        onClick={closeGuide}
                        aria-label="Finish guide"
                      >
                        <IconCheck />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="guide-right">
                {STEPS[guideStep].img ? (
                  <img
                    key={STEPS[guideStep].img}
                    src={STEPS[guideStep].img}
                    alt={STEPS[guideStep].screenAlt || `Step ${guideStep + 1} screenshot`}
                    className="guide-screenshot"
                    width={1080}
                    height={2256}
                    decoding="async"
                  />
                ) : (
                  <div className="guide-app-preview" aria-hidden="true">
                    <div className="guide-app-icon"><IconCheck /></div>
                    <div className="guide-app-title">You&rsquo;re all set</div>
                    <div className="guide-app-sub">Drop your files into Betrayal and hit Compare.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="app-header">
        <button className="wordmark" onClick={goHome} aria-label="Betrayal home">
          <span className="w-accent">B</span>ETRAYAL
        </button>
        <div className="header-right">
          <div className="privacy-badge" aria-label="All processing is local">
            <span className="privacy-badge-dot" aria-hidden="true" />
            <span>All processing is local</span>
          </div>
          <button className="help-btn" onClick={() => openGuide(0)} aria-label="How to use Betrayal">
            <IconInfo />
            How it works
          </button>
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle color theme">
            {theme === "dark" ? <IconMoon /> : <IconSun />}
          </button>
        </div>
      </header>

      {/* ── Input screen ── */}
      {screen === "input" && (
        <>
        <main className="input-screen">
          <div className="input-hero">
            <div className="tagline">KEEP YOUR CIRCLE REAL</div>
            <h1>Find out who&apos;s<br /><em>unfollowing you.</em></h1>
            <p>Upload your official Instagram export files. No login, no scraping. Everything happens right here in your browser.</p>
          </div>

          <div className="mode-wrap">
            <div className="mode-toggle" role="group" aria-label="Input mode">
              <button
                className={`mode-btn${inputMode === "paste" ? " active" : ""}`}
                onClick={() => switchInputMode("paste")}
                aria-pressed={inputMode === "paste"}
              >
                <IconPaste />Paste HTML
              </button>
              <button
                className={`mode-btn${inputMode === "upload" ? " active" : ""}`}
                onClick={() => switchInputMode("upload")}
                aria-pressed={inputMode === "upload"}
              >
                <IconUpload />Upload File
              </button>
            </div>
          </div>

          <div
            className={`panels-swipe${modeAnimating ? " animating" : ""}`}
            onTouchStart={handleModeTouchStart}
            onTouchEnd={handleModeTouchEnd}
            onAnimationEnd={() => setModeAnimating(false)}
          >
          <div className="panels-grid">
            <div className={`panel${rawFollowers ? " loaded" : ""}`}>
              <div className="panel-header">
                <span className="panel-title">Followers</span>
                <span className={`panel-status${rawFollowers ? " ok" : ""}`}>
                  {rawFollowers ? `✓ ${rawFollowers.length} loaded` : "followers.html"}
                </span>
              </div>
              <div className="panel-body">
                {inputMode === "paste" ? (
                  <textarea
                    className="data-textarea"
                    value={pasteFollowers}
                    placeholder="Paste the full contents of followers.html here…"
                    aria-label="Paste followers.html contents"
                    onChange={(e) => onPasteFollowers(e.target.value)}
                  />
                ) : (
                  <div
                    className={`dropzone${dragOverFollowers ? " drag-over" : ""}${uploadedFollowers ? " loaded" : ""}`}
                    role="button" tabIndex={0} aria-label="Upload followers.html"
                    onDragOver={(e) => { e.preventDefault(); setDragOverFollowers(true); }}
                    onDragLeave={() => setDragOverFollowers(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOverFollowers(false); const f = e.dataTransfer.files[0]; if (f) readFile(f, "followers"); }}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.querySelector("input").click(); } }}
                  >
                    <input type="file" accept=".html,.zip" aria-hidden="true" tabIndex={-1} onChange={(e) => { const f = e.target.files[0]; if (f) readFile(f, "followers"); }} />
                    <div className="dropzone-icon" aria-hidden="true">{uploadedFollowers ? <IconCheck /> : <IconFolder />}</div>
                    <div className="dropzone-title">{uploadedFollowers ? uploadedFollowers.name : "followers.html"}</div>
                    <div className="dropzone-sub">
                      {uploadedFollowers
                        ? <><strong>{uploadedFollowers.count} accounts</strong> found, ready</>
                        : <>Drag &amp; drop or <strong>click to browse</strong></>}
                    </div>
                  </div>
                )}
                {errFollowers && <div className="panel-error visible" role="alert">{errFollowers}</div>}
              </div>
            </div>

            <div className={`panel${rawFollowing ? " loaded" : ""}`}>
              <div className="panel-header">
                <span className="panel-title">Following</span>
                <span className={`panel-status${rawFollowing ? " ok" : ""}`}>
                  {rawFollowing ? `✓ ${rawFollowing.length} loaded` : "following.html"}
                </span>
              </div>
              <div className="panel-body">
                {inputMode === "paste" ? (
                  <textarea
                    className="data-textarea"
                    value={pasteFollowing}
                    placeholder="Paste the full contents of following.html here…"
                    aria-label="Paste following.html contents"
                    onChange={(e) => onPasteFollowing(e.target.value)}
                  />
                ) : (
                  <div
                    className={`dropzone${dragOverFollowing ? " drag-over" : ""}${uploadedFollowing ? " loaded" : ""}`}
                    role="button" tabIndex={0} aria-label="Upload following.html"
                    onDragOver={(e) => { e.preventDefault(); setDragOverFollowing(true); }}
                    onDragLeave={() => setDragOverFollowing(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOverFollowing(false); const f = e.dataTransfer.files[0]; if (f) readFile(f, "following"); }}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.querySelector("input").click(); } }}
                  >
                    <input type="file" accept=".html,.zip" aria-hidden="true" tabIndex={-1} onChange={(e) => { const f = e.target.files[0]; if (f) readFile(f, "following"); }} />
                    <div className="dropzone-icon" aria-hidden="true">{uploadedFollowing ? <IconCheck /> : <IconFolder />}</div>
                    <div className="dropzone-title">{uploadedFollowing ? uploadedFollowing.name : "following.html"}</div>
                    <div className="dropzone-sub">
                      {uploadedFollowing
                        ? <><strong>{uploadedFollowing.count} accounts</strong> found, ready</>
                        : <>Drag &amp; drop or <strong>click to browse</strong></>}
                    </div>
                  </div>
                )}
                {errFollowing && <div className="panel-error visible" role="alert">{errFollowing}</div>}
              </div>
            </div>
          </div>
          </div>

        </main>
        <div className="action-bar" role="region" aria-label="Compare actions">
          <div className="action-bar-inner">
            <span className="action-hint">{compareHint}</span>
            <div className="action-btns">
              <button className="btn-demo" onClick={loadDemoData} aria-label="Load demo data">
                try demo →
              </button>
              <button className="btn-compare" disabled={!canCompare} onClick={runCompare}>
                Compare Lists →
              </button>
            </div>
          </div>
        </div>
        </>
      )}

      {/* ── Results screen ── */}
      {screen === "results" && (
        <section className="results-screen" aria-label="Comparison results">
          <div className="results-top">
            <h1 className="results-heading">
              Your <span>{currentTab === "betrayal" ? "unfollowers" : currentTab === "fans" ? "fans" : "mutuals"}</span>
            </h1>
            <div className="results-actions">
              <button className={`btn-util${exportDone ? " done" : ""}`} onClick={doExport} aria-label={exportDone ? "Exported!" : "Export current tab as CSV"}>
                {exportDone ? <IconCheck /> : <IconDownload />}
                {exportDone ? "Exported!" : "Export CSV"}
              </button>
              <button className="btn-util" onClick={goHome} aria-label="New scan">
                <IconRefresh />New scan
              </button>
            </div>
          </div>

          <div className="stats-strip">
            <div
              className={`strip-seg${currentTab === "betrayal" ? " active" : ""}`}
              role="button" tabIndex={0} aria-label="Unfollowers"
              onClick={() => setCurrentTab("betrayal")}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCurrentTab("betrayal"); } }}
            >
              <div className="strip-num c-accent">{betrayal.length}</div>
              <div className="strip-lbl">Unfollowers</div>
            </div>
            <div className="strip-div" aria-hidden="true" />
            <div
              className={`strip-seg${currentTab === "fans" ? " active-warn" : ""}`}
              role="button" tabIndex={0} aria-label="Fans"
              onClick={() => setCurrentTab("fans")}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCurrentTab("fans"); } }}
            >
              <div className="strip-num c-warn">{fans.length}</div>
              <div className="strip-lbl">Fans</div>
            </div>
            <div className="strip-div" aria-hidden="true" />
            <div
              className={`strip-seg${currentTab === "mutuals" ? " active-success" : ""}`}
              role="button" tabIndex={0} aria-label="Mutuals"
              onClick={() => setCurrentTab("mutuals")}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCurrentTab("mutuals"); } }}
            >
              <div className="strip-num c-success">{mutuals.length}</div>
              <div className="strip-lbl">Mutuals</div>
            </div>
          </div>

          <div className="list-header">
            {searchOpen ? (
              <div className="search-inline">
                <span className="search-icon-inline" aria-hidden="true"><IconSearch /></span>
                <input
                  className="search-input" type="search" value={searchQuery}
                  placeholder="Search @username…" aria-label="Search usernames"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off" spellCheck={false} autoFocus
                />
                <button className="search-clear" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} aria-label="Close search">
                  <IconX />
                </button>
              </div>
            ) : (
              <>
                <div className="seg-tabs" role="tablist">
                  {["betrayal", "fans", "mutuals"].map((tab) => {
                    const counts = { betrayal: betrayal.length, fans: fans.length, mutuals: mutuals.length };
                    const labels = { betrayal: "Unfollowers", fans: "Fans", mutuals: "Mutuals" };
                    return (
                      <button
                        key={tab}
                        id={`tab-${tab}`}
                        className={`seg-tab${currentTab === tab ? " active" : ""}`}
                        role="tab" aria-selected={currentTab === tab}
                        aria-controls="results-panel"
                        onClick={() => { setCurrentTab(tab); setSearchQuery(""); setSearchOpen(false); }}
                      >
                        {labels[tab]} <span className="tab-count">{counts[tab]}</span>
                      </button>
                    );
                  })}
                </div>
                <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search users">
                  <IconSearch />
                </button>
              </>
            )}
          </div>

          <div className="user-list-wrap" role="tabpanel" id="results-panel" aria-labelledby={`tab-${currentTab}`}>
            <div className="user-list-inner" role="list" aria-label="User list">
              {filtered.length === 0 ? (
                <div className="empty-state">
                  {activeQuery ? (
                    <>
                      <div className="empty-glyph">?</div>
                      <div className="empty-title">No match for &ldquo;{activeQuery}&rdquo;</div>
                      <div className="empty-desc">Try a different username or clear the search.</div>
                    </>
                  ) : tabData.length === 0 ? (
                    <>
                      <div className="empty-glyph">0</div>
                      <div className="empty-title">
                        {currentTab === "betrayal" ? "No unfollowers found." : currentTab === "fans" ? "No fans yet." : "No mutuals."}
                      </div>
                      <div className="empty-desc">
                        {currentTab === "betrayal" ? "Everyone you follow, follows you back." : currentTab === "fans" ? "No one follows you that you don't follow back." : "Upload both files to find mutual connections."}
                      </div>
                      {currentTab === "betrayal" && <div className="empty-wit">Either you&apos;re very selective, or they&apos;re very clever.</div>}
                    </>
                  ) : null}
                </div>
              ) : (
                filtered.map((user, i) => {
                  const isDismissed = dismissed.has(user.handle);
                  return (
                    <div
                      key={user.handle}
                      className={`user-row${!activeQuery ? " entering" : ""}${isDismissed ? " is-dismissed" : ""}`}
                      role="listitem"
                      style={{ animationDelay: `${Math.min(i, 12) * 28}ms` }}
                    >
                      <div className="user-avatar" aria-hidden="true">
                        {user.displayHandle.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <div className="user-handle">@{user.displayHandle}</div>
                        {isDismissed && <div className="user-meta">Dismissed. Tap restore to undo.</div>}
                      </div>
                      <div className="user-actions">
                        {!isDismissed && (
                          <a
                            className="btn-ig"
                            href={user.href || `https://www.instagram.com/${user.displayHandle}/`}
                            target="_blank" rel="noopener noreferrer"
                            aria-label={`Open @${user.displayHandle} on Instagram`}
                          >
                            <IconExternalLink /> Instagram
                          </a>
                        )}
                        {isDismissed ? (
                          <button className="icon-action restore" onClick={() => restoreUser(user.handle)} aria-label={`Restore @${user.displayHandle}`}><IconUndo /></button>
                        ) : (
                          <button className="icon-action dismiss" onClick={() => dismissUser(user.handle)} aria-label={`Dismiss @${user.displayHandle}`}><IconX /></button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {dismissedInTab > 0 && (
              <div className="dismissed-footer">
                <span className="dismissed-info">{dismissedInTab} account{dismissedInTab === 1 ? "" : "s"} dismissed in this tab</span>
                <button className="btn-restore-all" onClick={restoreAll}>Restore all</button>
              </div>
            )}
          </div>

        </section>
      )}

      <style jsx>{`
        /* ── Onboarding ── */
        .onboarding-overlay {
          position: fixed; inset: 0; background: var(--bg);
          display: flex; align-items: center; justify-content: center;
          z-index: 600; padding: 24px; overflow-y: auto;
        }
        .ob-glow {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -60%);
          width: 700px; height: 700px; pointer-events: none;
          background: radial-gradient(circle, oklch(60% 0.25 330 / 0.12) 0%, transparent 65%);
        }
        .onboarding-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 480px;
          display: flex; flex-direction: column; align-items: center; text-align: center;
          padding: 40px 36px 36px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 32px;
          box-shadow: var(--shadow-lg), inset 0 1px 0 oklch(100% 0 0 / 0.06);
        }
        .ob-logo {
          font-family: var(--font-display); font-weight: 900; font-size: 56px;
          letter-spacing: -0.02em; color: var(--fg); line-height: 1;
          text-shadow: 0 0 60px var(--wordmark-glow); margin-bottom: 8px;
        }
        .ob-tagline {
          font-family: var(--font-mono); font-size: 11px; font-weight: 500;
          letter-spacing: 0.35em; text-transform: uppercase; color: var(--muted);
          opacity: 0.7; margin-bottom: 24px;
        }
        .ob-desc {
          font-size: 15px; color: var(--muted); line-height: 1.7;
          max-width: 360px; margin-bottom: 28px;
        }
        .ob-theme-row {
          display: flex; align-items: center; gap: 14px; margin-bottom: 28px;
        }
        .ob-theme-label {
          font-family: var(--font-mono); font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted);
        }
        .ob-theme-choices {
          display: flex; background: var(--bg); border: 1px solid var(--border);
          border-radius: var(--radius-full); overflow: hidden; padding: 3px; gap: 2px;
        }
        .ob-theme-choice {
          padding: 6px 18px; min-height: 36px; font-family: var(--font-body);
          font-size: 13px; font-weight: 600; color: var(--muted);
          cursor: pointer; border: none; background: none; border-radius: var(--radius-full);
          display: flex; align-items: center; gap: 7px;
          transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
        }
        .ob-theme-choice.active {
          background: var(--surface-raised); color: var(--fg);
          box-shadow: var(--shadow-sm);
        }
        .ob-theme-choice:hover:not(.active) { color: var(--fg); }
        .ob-theme-choice:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
        .ob-ctas {
          display: flex; flex-direction: column; align-items: stretch; gap: 10px;
          width: 100%; margin-bottom: 28px;
        }
        .ob-cta-primary {
          padding: 16px 24px; background: var(--accent); color: var(--accent-fg);
          border: none; border-radius: var(--radius-full); cursor: pointer;
          font-family: var(--font-display); font-weight: 700; font-size: 20px;
          letter-spacing: -0.01em; line-height: 1.2;
          box-shadow: 0 4px 24px oklch(60% 0.25 330 / 0.35);
          transition: background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
        }
        .ob-cta-primary:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 8px 32px oklch(60% 0.25 330 / 0.45); }
        .ob-cta-primary:active { transform: scale(0.97); }
        .ob-cta-primary:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
        .ob-cta-secondary {
          padding: 14px 24px; background: var(--surface-raised);
          color: var(--fg); border: 1.5px solid var(--border);
          border-radius: var(--radius-full); cursor: pointer;
          font-family: var(--font-body); font-weight: 600; font-size: 15px;
          transition: border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out);
        }
        .ob-cta-secondary:hover { border-color: var(--border-strong); }
        .ob-cta-secondary:active { transform: scale(0.97); }
        .ob-cta-secondary:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
        .ob-cta-demo {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: var(--radius-full); color: var(--muted);
          font-family: var(--font-mono); font-size: 12px; font-weight: 500; cursor: pointer;
          padding: 10px 20px; min-height: 40px;
          transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out);
        }
        .ob-cta-demo:hover { border-color: var(--border-strong); color: var(--fg); background: var(--surface-raised); }
        .ob-cta-demo:active { transform: scale(0.97); }
        .ob-cta-demo:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
        .ob-credit {
          font-family: var(--font-mono); font-size: 11px; color: var(--muted);
          opacity: 0.45; letter-spacing: 0.02em;
        }
        .ob-credit-link {
          color: inherit; text-decoration: underline; text-underline-offset: 2px;
        }
        .ob-credit-link:hover { color: var(--muted); }

        /* ── Guide ── */
        .guide-overlay {
          position: fixed; inset: 0; background: var(--overlay-bg);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          z-index: 500; padding: 16px;
          animation: modal-in 200ms var(--ease-out) both;
        }
        .guide-drag-handle {
          width: 36px; height: 4px; border-radius: var(--radius-full);
          background: var(--border-strong); margin: 10px auto 0;
          flex-shrink: 0; display: none;
        }
        .guide-modal {
          width: 100%; max-width: 860px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 24px; box-shadow: var(--shadow-lg);
          display: flex; flex-direction: column;
          max-height: calc(100vh - 32px); overflow: hidden;
          touch-action: pan-y;
        }
        .guide-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px; border-bottom: 1px solid var(--border); flex-shrink: 0;
        }
        .guide-title {
          font-family: var(--font-display); font-weight: 700; font-size: 17px;
          letter-spacing: -0.01em; color: var(--fg);
        }
        .guide-close {
          width: 44px; height: 44px; border-radius: var(--radius-full);
          border: 1px solid var(--border); background: var(--surface-raised);
          color: var(--muted); cursor: pointer; font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
        }
        .guide-close:hover { border-color: var(--border-strong); color: var(--fg); }
        .guide-close:active { transform: scale(0.94); }
        .guide-close:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
        .guide-body {
          display: grid; grid-template-columns: 1fr 1fr;
          flex: 1; min-height: 0; overflow: hidden;
        }
        .guide-left {
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 36px 32px 28px;
          border-right: 1px solid var(--border); overflow-y: auto;
        }
        .guide-left-content { flex: 1; }
        .guide-left-footer { margin-top: 32px; }
        .guide-step-num {
          font-family: var(--font-display); font-weight: 900; font-size: 80px;
          letter-spacing: -0.04em; line-height: 1; color: var(--border-strong);
          margin-bottom: 20px; font-variant-numeric: tabular-nums;
        }
        .guide-step-text {
          font-size: 18px; color: var(--fg); line-height: 1.65;
        }
        .guide-progress {
          height: 3px; background: var(--border); border-radius: var(--radius-full);
          margin-bottom: 20px; overflow: hidden;
        }
        .guide-progress-fill {
          height: 100%; background: var(--accent); border-radius: var(--radius-full);
          transition: width var(--dur-base) var(--ease-out);
          min-width: 8px;
        }
        .guide-nav {
          display: flex; align-items: center; gap: 12px;
        }
        .guide-nav-count {
          font-family: var(--font-mono); font-size: 12px; color: var(--muted);
          flex: 1; text-align: center;
        }
        .guide-nav-btn {
          width: 40px; height: 40px; border-radius: var(--radius-full);
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; border: 1.5px solid var(--border);
          background: var(--surface-raised); color: var(--fg);
          transition: border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out);
          flex-shrink: 0;
        }
        .guide-nav-btn:hover { border-color: var(--border-strong); }
        .guide-nav-btn:active { transform: scale(0.94); }
        .guide-nav-btn.next { background: var(--accent); border-color: var(--accent); color: var(--accent-fg); }
        .guide-nav-btn.next:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
        .guide-nav-btn.done { background: var(--success-subtle); border-color: var(--success); color: var(--success); }
        .guide-nav-btn:disabled { opacity: 0.30; cursor: not-allowed; }
        .guide-nav-btn:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
        .guide-right {
          display: flex; align-items: center; justify-content: center;
          padding: 20px; background: var(--bg); overflow: hidden;
        }
        .guide-screenshot {
          max-height: calc(100vh - 160px); max-width: 100%;
          width: auto; height: auto;
          object-fit: contain; border-radius: 28px;
          border: 2px solid var(--border-strong);
          box-shadow: var(--shadow-md);
          display: block; align-self: flex-start;
        }
        .guide-app-preview {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 14px; text-align: center;
          max-width: 280px; width: auto; margin: 0 auto;
          padding: 40px 28px; border-radius: 24px;
          background: var(--surface); border: 1.5px solid var(--border);
        }
        .guide-app-icon {
          width: 64px; height: 64px; border-radius: 20px;
          background: var(--accent-subtle); color: var(--accent);
          display: flex; align-items: center; justify-content: center;
        }
        .guide-app-icon :global(svg) { width: 32px; height: 32px; }
        .guide-app-title {
          font-family: var(--font-display); font-weight: 700; font-size: 22px;
          letter-spacing: -0.01em; color: var(--fg);
        }
        .guide-app-sub {
          font-size: 14px; color: var(--muted); line-height: 1.5; max-width: 240px;
        }

        /* ── App Header ── */
        .app-header {
          position: sticky; top: 0; z-index: 200;
          height: 56px;
          background: oklch(from var(--surface) l c h / 0.82);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; gap: 16px;
        }
        .wordmark {
          font-family: var(--font-display); font-weight: 900; font-size: 24px;
          letter-spacing: -0.015em; color: var(--fg); line-height: 1;
          cursor: pointer; user-select: none; background: none; border: none;
          text-shadow: 0 0 20px var(--wordmark-glow);
          transition: opacity var(--dur-fast) var(--ease-out);
        }
        .wordmark:hover { opacity: 0.8; }
        .wordmark:active { transform: scale(0.97); }
        .wordmark:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); border-radius: var(--radius-sm); }
        .w-accent { color: var(--accent); }
        .header-right { display: flex; align-items: center; gap: 10px; }
        .privacy-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--success-subtle); border: 1px solid var(--success-border);
          border-radius: var(--radius-full); padding: 4px 12px;
          font-family: var(--font-mono); font-size: 11px; font-weight: 500;
          color: var(--success); letter-spacing: 0.03em; white-space: nowrap;
        }
        .privacy-badge-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--success); flex-shrink: 0;
          animation: dot-pulse 2.4s ease-in-out infinite;
        }
        .theme-btn {
          width: 44px; height: 44px; border-radius: var(--radius-full);
          border: 1px solid var(--border); background: var(--surface-raised);
          cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;
          transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out); color: var(--muted);
        }
        .theme-btn:hover { border-color: var(--border-strong); color: var(--fg); }
        .theme-btn:active { transform: scale(0.94); }
        .theme-btn:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
        .help-btn {
          height: 40px; border-radius: var(--radius-full); border: 1px solid var(--border);
          background: var(--surface-raised); cursor: pointer; font-family: var(--font-body);
          font-size: 13px; font-weight: 600; color: var(--muted); padding: 0 16px;
          display: flex; align-items: center; gap: 6px;
          transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
        }
        .help-btn:hover { border-color: var(--border-strong); color: var(--fg); }
        .help-btn:active { transform: scale(0.97); }
        .help-btn:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }

        /* ── Input Screen ── */
        .input-screen { max-width: 880px; margin: 0 auto; padding: 60px 24px 140px; }
        .input-hero { text-align: center; margin-bottom: 48px; }
        .input-hero h1 {
          font-family: var(--font-display); font-weight: 900;
          font-size: clamp(52px, 9vw, 92px); letter-spacing: -0.03em;
          line-height: 0.95; color: var(--fg); margin-bottom: 16px;
          text-shadow: 0 0 40px var(--hero-glow);
        }
        .input-hero h1 em { color: var(--accent); font-style: normal; }
        .tagline {
          font-family: var(--font-mono); font-size: 14px; font-weight: 500;
          letter-spacing: 0.4em; color: var(--muted); text-transform: uppercase;
          margin-bottom: 32px; opacity: 0.8;
        }
        .input-hero p { font-size: 17px; color: var(--muted); max-width: 480px; margin: 0 auto; line-height: 1.65; }
        .mode-wrap { display: flex; justify-content: center; margin-bottom: 28px; }
        .mode-toggle {
          display: flex; background: var(--surface);
          border: 1px solid var(--border); border-radius: var(--radius-full);
          padding: 4px; gap: 2px;
        }
        .mode-btn {
          padding: 8px 20px; min-height: 40px; font-family: var(--font-body); font-size: 13px; font-weight: 600;
          color: var(--muted); cursor: pointer; border: none; background: none;
          border-radius: var(--radius-full);
          transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
          display: flex; align-items: center; gap: 7px;
        }
        .mode-btn.active {
          background: var(--accent); color: var(--accent-fg);
          box-shadow: var(--shadow-sm);
        }
        .mode-btn:not(.active):hover { background: var(--surface-raised); color: var(--fg); }
        .mode-btn:active { transform: scale(0.97); }
        .mode-btn:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
        .panels-swipe { touch-action: pan-y; }
        .panels-swipe.animating { animation: panel-snap 240ms var(--ease-snap) both; }
        .panels-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 0; }
        .panel {
          background: var(--surface); border: 1.5px solid var(--border);
          border-radius: 24px; overflow: hidden;
          box-shadow: inset 0 1px 0 oklch(100% 0 0 / 0.05);
          transition: border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out);
        }
        .panel.loaded {
          border-color: var(--success);
          box-shadow: 0 0 0 3px var(--success-subtle), inset 0 1px 0 oklch(100% 0 0 / 0.05);
        }
        .panel-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px; border-bottom: 1px solid var(--border);
        }
        .panel-title { font-family: var(--font-display); font-weight: 700; font-size: 18px; letter-spacing: -0.01em; color: var(--fg); }
        .panel-status { font-family: var(--font-mono); font-size: 11px; font-weight: 500; color: var(--muted); }
        .panel-status.ok { color: var(--success); }
        .panel-body { padding: 16px 18px; }
        .data-textarea {
          width: 100%; min-height: 140px; font-family: var(--font-mono); font-size: 12px;
          color: var(--fg); background: var(--bg); border: 1.5px solid var(--border);
          border-radius: var(--radius-lg); padding: 12px 14px; resize: vertical; outline: none;
          transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
          line-height: 1.55;
        }
        .data-textarea::placeholder { color: var(--muted); opacity: 0.6; }
        .data-textarea:hover { border-color: var(--border-strong); }
        .data-textarea:focus, .data-textarea:focus-visible { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-subtle); }
        .dropzone {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          border: 2px dashed var(--border-strong); border-radius: var(--radius-lg);
          padding: 36px 24px; cursor: pointer; background: var(--bg);
          transition: border-color var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out); position: relative; outline: none;
          min-height: 140px; justify-content: center;
        }
        .dropzone:hover, .dropzone.drag-over { border-color: var(--accent); background: var(--accent-subtle); }
        .dropzone:focus-visible { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-subtle); }
        .dropzone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; font-size: 0; }
        .dropzone-icon {
          width: 40px; height: 40px; margin-bottom: 12px; background: var(--surface);
          border: 1.5px solid var(--border); border-radius: 14px;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
          transition: background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out);
        }
        .dropzone:hover .dropzone-icon, .dropzone.drag-over .dropzone-icon { background: var(--accent); border-color: var(--accent); }
        .dropzone-title { font-family: var(--font-display); font-weight: 700; font-size: 16px; letter-spacing: -0.01em; color: var(--fg); margin-bottom: 4px; }
        .dropzone-sub { font-size: 12px; color: var(--muted); line-height: 1.5; }
        .dropzone-sub strong { color: var(--accent); font-weight: 600; }
        .dropzone.loaded { border-style: solid; border-color: var(--success); background: var(--success-subtle); }
        .dropzone.loaded .dropzone-title { color: var(--success); }
        .dropzone.loaded .dropzone-icon { background: var(--success); border-color: var(--success); }
        .panel-error {
          display: none; margin-top: 10px; padding: 10px 14px;
          background: var(--danger-subtle); border: 1px solid var(--danger);
          border-radius: var(--radius-md); font-size: 13px; color: var(--danger); line-height: 1.5;
        }
        .panel-error.visible { display: block; }

        /* ── Action Bar ── */
        .action-bar {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
          background: oklch(from var(--surface) l c h / 0.88);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border-top: 1px solid var(--border);
          padding: 12px 24px max(12px, env(safe-area-inset-bottom));
        }
        .action-bar-inner {
          max-width: 880px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }
        .action-hint { font-size: 13px; color: var(--muted); flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .action-btns { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .btn-compare {
          display: inline-flex; align-items: center; gap: 8px; background: var(--accent);
          color: var(--accent-fg); border: none; border-radius: var(--radius-full); padding: 12px 28px;
          font-family: var(--font-display); font-weight: 700; font-size: 18px; letter-spacing: -0.01em;
          cursor: pointer;
          box-shadow: 0 4px 20px oklch(60% 0.25 330 / 0.30);
          transition: background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
        }
        .btn-compare:hover { background: var(--accent-hover); box-shadow: 0 6px 28px oklch(60% 0.25 330 / 0.40); }
        .btn-compare:active { transform: scale(0.97); }
        .btn-compare:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }
        .btn-compare:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
        .btn-demo {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-full); font-size: 12px; color: var(--muted);
          cursor: pointer; font-family: var(--font-mono); font-weight: 500;
          padding: 10px 16px; min-height: 40px; white-space: nowrap;
          transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out);
          display: inline-flex; align-items: center;
        }
        .btn-demo:hover { border-color: var(--border-strong); color: var(--fg); background: var(--surface-raised); }
        .btn-demo:active { transform: scale(0.97); }
        .btn-demo:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }

        /* ── Results Screen ── */
        .results-screen { max-width: 900px; margin: 0 auto; padding: 32px 24px 100px; position: relative; }
        .results-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
        }
        .results-heading {
          font-family: var(--font-display); font-weight: 900;
          font-size: clamp(28px, 5vw, 44px); letter-spacing: -0.025em; line-height: 1.05; color: var(--fg);
        }
        .results-heading span { color: var(--accent); }
        .results-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .btn-util {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-body); font-weight: 600; font-size: 12px; color: var(--muted);
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-full);
          padding: 7px 14px; min-height: 36px; cursor: pointer; white-space: nowrap;
          transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out);
        }
        .btn-util:hover { border-color: var(--border-strong); color: var(--fg); background: var(--surface-raised); }
        .btn-util:active { transform: scale(0.97); }
        .btn-util:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }

        /* ── Stats Strip ── */
        .stats-strip {
          display: flex; align-items: stretch;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; margin-bottom: 16px; overflow: hidden;
          box-shadow: inset 0 1px 0 oklch(100% 0 0 / 0.05);
        }
        .strip-seg {
          flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 14px 12px; cursor: pointer; gap: 2px;
          transition: background var(--dur-fast) var(--ease-out);
        }
        .strip-seg:hover { background: var(--surface-raised); }
        .strip-seg:active { transform: scale(0.98); }
        .strip-seg.active { background: var(--accent-subtle); }
        .strip-seg.active-warn { background: var(--warn-subtle); }
        .strip-seg.active-success { background: var(--success-subtle); }
        .strip-seg:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--accent); }
        .strip-div {
          width: 1px; background: var(--border); flex-shrink: 0; margin: 10px 0;
        }
        .strip-num {
          font-family: var(--font-display); font-weight: 900;
          font-size: clamp(28px, 5vw, 40px); letter-spacing: -0.03em; line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .strip-num.c-accent { color: var(--accent); }
        .strip-num.c-success { color: var(--success); }
        .strip-num.c-warn { color: var(--warn); }
        .strip-lbl {
          font-family: var(--font-mono); font-size: 10px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted);
        }

        /* ── List Header ── */
        .list-header {
          display: flex; align-items: center; gap: 10px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-xl); padding: 6px; margin-bottom: 8px;
          position: sticky; top: 56px; z-index: 100;
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
        }
        .seg-tabs {
          display: flex; flex: 1; gap: 2px;
        }
        .seg-tab {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 8px 12px; min-height: 40px;
          border-radius: var(--radius-lg); font-family: var(--font-body);
          font-size: 13px; font-weight: 600; color: var(--muted);
          cursor: pointer; border: none; background: none;
          transition: color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out);
          white-space: nowrap;
        }
        .seg-tab:hover { color: var(--fg); background: var(--bg); }
        .seg-tab.active {
          background: var(--surface-raised); color: var(--fg);
          box-shadow: var(--shadow-sm);
        }
        .seg-tab:active { transform: scale(0.97); }
        .seg-tab:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--accent); }
        .seg-tab.active .tab-count { background: var(--accent); color: var(--accent-fg); border-color: transparent; }
        .tab-count {
          font-family: var(--font-mono); font-size: 10px; font-weight: 500;
          background: var(--bg); border: 1px solid var(--border); color: var(--muted);
          padding: 1px 6px; border-radius: var(--radius-full);
          transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out);
        }
        .search-trigger {
          width: 40px; height: 40px; border-radius: var(--radius-full);
          border: 1px solid var(--border); background: var(--surface-raised);
          color: var(--muted); cursor: pointer;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
        }
        .search-trigger:hover { border-color: var(--border-strong); color: var(--fg); }
        .search-trigger:active { transform: scale(0.94); }
        .search-trigger:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
        .search-inline {
          display: flex; align-items: center; gap: 8px; flex: 1;
          padding: 2px 8px 2px 12px;
        }
        .search-icon-inline {
          color: var(--muted); display: flex; align-items: center; flex-shrink: 0;
        }
        .search-input {
          flex: 1; padding: 8px 0; font-family: var(--font-body);
          font-size: 14px; color: var(--fg); background: transparent;
          border: none; outline: none;
        }
        .search-input::placeholder { color: var(--muted); opacity: 0.65; }
        .search-clear {
          width: 36px; height: 36px; border-radius: var(--radius-full);
          border: none; background: var(--surface-raised);
          color: var(--muted); cursor: pointer; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
        }
        .search-clear:hover { background: var(--bg); color: var(--fg); }
        .search-clear:active { transform: scale(0.94); }
        .search-clear:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }

        /* ── User List ── */
        .user-list-wrap {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius-xl); overflow: hidden;
        }
        .user-list-inner { overflow-y: auto; max-height: 520px; }
        .user-row {
          display: flex; align-items: center; gap: 12px; padding: 12px 18px;
          background: var(--surface); position: relative;
          transition: background var(--dur-fast) var(--ease-out);
        }
        .user-row::after {
          content: ''; position: absolute;
          bottom: 0; left: 18px; right: 18px;
          height: 1px; background: var(--border);
        }
        .user-row.entering { animation: row-in 280ms var(--ease-out) both; }
        .user-row:last-child::after { display: none; }
        .user-row:hover { background: var(--surface-raised); }
        .user-row.is-dismissed { opacity: 0.38; }
        .user-avatar {
          width: 38px; height: 38px; border-radius: 14px;
          background: var(--accent-subtle); border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono); font-size: 11px; font-weight: 500;
          color: var(--accent); flex-shrink: 0; user-select: none;
        }
        .user-info { flex: 1; min-width: 0; }
        .user-handle { font-family: var(--font-mono); font-size: 13px; font-weight: 500; color: var(--fg); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-meta { font-size: 11px; color: var(--muted); }
        .user-actions { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }
        .btn-ig {
          display: inline-flex; align-items: center; gap: 4px;
          font-family: var(--font-body); font-size: 12px; font-weight: 600;
          color: var(--accent); border: 1px solid var(--accent);
          border-radius: var(--radius-full); padding: 5px 12px;
          background: none; cursor: pointer; transition: background var(--dur-fast) var(--ease-out);
          text-decoration: none; white-space: nowrap;
        }
        .btn-ig:hover { background: var(--accent-subtle); text-decoration: none; }
        .btn-ig:active { transform: scale(0.97); }
        .btn-ig:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
        .icon-action {
          width: 44px; height: 44px; border-radius: var(--radius-full);
          border: 1px solid var(--border); background: none; color: var(--muted);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out);
          flex-shrink: 0;
        }
        .icon-action:hover { background: var(--surface-raised); color: var(--fg); border-color: var(--border-strong); }
        .icon-action:active { transform: scale(0.94); }
        .icon-action:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent); }
        .icon-action.dismiss:hover { background: var(--danger-subtle); color: var(--danger); border-color: var(--danger); }
        .icon-action.restore:hover { background: var(--success-subtle); color: var(--success); border-color: var(--success); }
        .dismissed-footer {
          padding: 12px 18px; border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between; background: var(--bg);
        }
        .dismissed-info { font-size: 12px; color: var(--muted); }
        .btn-restore-all {
          font-size: 12px; font-weight: 600; color: var(--success);
          background: none; border: none; cursor: pointer; padding: 10px 12px; min-height: 44px;
          border-radius: var(--radius-full); transition: background var(--dur-fast) var(--ease-out);
        }
        .btn-restore-all:hover { background: var(--success-subtle); }
        .btn-restore-all:active { transform: scale(0.97); }
        .btn-restore-all:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--success); }

        /* ── Export done flash on btn-util ── */
        .btn-util.done { background: var(--success-subtle); border-color: var(--success); color: var(--success); }

        /* ── Empty State ── */
        .empty-state {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 56px 24px;
        }
        .empty-glyph {
          font-family: var(--font-display); font-weight: 900; font-size: 72px;
          color: var(--border-strong); letter-spacing: -0.04em; line-height: 1; margin-bottom: 20px;
        }
        .empty-title { font-family: var(--font-display); font-weight: 700; font-size: 22px; letter-spacing: -0.01em; color: var(--fg); margin-bottom: 8px; }
        .empty-desc { font-size: 14px; color: var(--muted); max-width: 300px; line-height: 1.65; }
        .empty-wit { font-size: 12px; font-family: var(--font-mono); color: var(--accent); margin-top: 10px; opacity: 0.85; }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .panels-grid { grid-template-columns: 1fr; }
          .privacy-badge { display: none; }
          .results-top { flex-direction: column; align-items: flex-start; gap: 10px; }
          .results-actions { gap: 6px; }
          .input-screen { padding: 32px 16px 140px; }
          .action-bar-inner { gap: 10px; }
          .action-hint { display: none; }
          .action-btns { flex: 1; justify-content: space-between; }
          .btn-compare { flex: 1; justify-content: center; }
          .user-list-inner { max-height: none; overflow-y: visible; }
          .guide-drag-handle { display: block; }
          .guide-overlay { align-items: flex-end; padding: 0; }
          .guide-modal {
            border-radius: 28px 28px 0 0; max-height: 94vh;
            animation: sheet-up 280ms var(--ease-out) both;
          }
          .guide-body {
            grid-template-columns: 1fr 1fr; overflow: hidden; max-height: calc(94vh - 100px);
          }
          .guide-right {
            padding: 12px; overflow: hidden;
          }
          .guide-screenshot {
            max-height: calc(94vh - 120px); max-width: 100%;
            border-radius: 18px;
          }
          .guide-left { padding: 20px 16px; overflow-y: auto; }
          .guide-step-num { font-size: 44px; margin-bottom: 10px; }
          .guide-step-text { font-size: 14px; }
          .ob-logo { font-size: 44px; }
          .ob-desc { font-size: 15px; }
          .ob-cta-primary { font-size: 18px; padding: 14px 20px; }
          .onboarding-card { border-radius: 24px; padding: 32px 24px 28px; }
          .list-header { top: 48px; }
        }
        @media (max-width: 400px) {
          .seg-tabs { gap: 0; }
          .seg-tab { font-size: 12px; padding: 8px 6px; }
        }
      `}</style>
    </>
  );
}
