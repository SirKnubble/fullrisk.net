import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { SkinRenderer } from "@noriskclient/nrc-skin-renderer/react";
import "./style.css";

type NewsPost = {
  id: number;
  yoast_head_json?: {
    title?: string;
    og_url?: string;
    og_image?: Array<{ url?: string }>;
  };
};

const navItems = [
  ["SKINS", "#skins"],
  ["DOCS", "#docs"],
  ["SERVERS", "#servers"],
  ["HOME", "#home"],
  ["PROFILES", "#profiles"],
  ["ADDONS", "#addons"],
  ["SETTINGS", "#settings"],
];

const skinUrl = "/skins/SirKnubble.png";
const avatarUrl = "/avatars/SirKnubble.png";
const calmIdleAnimations = [
  "/emotes/launcheridle.animation.json",
  "/emotes/launcheridle2.animation.json",
];

function Svg({
  children,
  size = 20,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function App() {
  const [animated, setAnimated] = useState(true);
  const [idleAnimationUrl] = useState(() =>
    Math.random() < 0.1
      ? "/emotes/launcheridle3.animation.json"
      : calmIdleAnimations[
          Math.floor(Math.random() * calmIdleAnimations.length)
        ],
  );
  const [playerCount, setPlayerCount] = useState("--");
  const [news, setNews] = useState<NewsPost[]>([]);
  const [newsWidth, setNewsWidth] = useState(
    Math.min(300, window.innerWidth * 0.22),
  );
  const [newsHeight, setNewsHeight] = useState(
    Math.min(580, window.innerHeight * 0.62),
  );
  const resizeRef = useRef<{
    axis: "x" | "y";
    x: number;
    y: number;
    value: number;
  } | null>(null);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const drag = resizeRef.current;
      if (!drag) return;
      if (drag.axis === "x")
        setNewsWidth(
          Math.max(160, Math.min(520, drag.value - (event.clientX - drag.x))),
        );
      else
        setNewsHeight(
          Math.max(
            220,
            Math.min(
              window.innerHeight - 140,
              drag.value - (event.clientY - drag.y),
            ),
          ),
        );
    };
    const stop = () => {
      resizeRef.current = null;
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, []);

  const beginResize = (
    axis: "x" | "y",
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    resizeRef.current = {
      axis,
      x: event.clientX,
      y: event.clientY,
      value: axis === "x" ? newsWidth : newsHeight,
    };
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      try {
        const response = await fetch("/api/public-stats");
        if (!response.ok) throw new Error("Stats request failed");
        const data: { count: number } = await response.json();
        if (active) setPlayerCount(new Intl.NumberFormat().format(data.count));
      } catch {
        if (active) setPlayerCount("—");
      }
    };
    const loadNews = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) throw new Error("News request failed");
        const posts: NewsPost[] = await response.json();
        if (active) setNews(posts);
      } catch {
        if (active) setNews([]);
      }
    };
    void loadStats();
    void loadNews();
    const statsTimer = window.setInterval(loadStats, 5 * 60 * 1000);
    const newsTimer = window.setInterval(loadNews, 5 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(statsTimer);
      window.clearInterval(newsTimer);
    };
  }, []);

  const newsItems = news
    .map((post) => {
      const meta = post.yoast_head_json;
      const image = meta?.og_image?.[0]?.url;
      if (!image) return null;
      return {
        id: post.id,
        image,
        url: meta?.og_url || "#",
        title: (meta?.title || "News").replace(" - NoRisk Client Blog", ""),
      };
    })
    .filter((post): post is NonNullable<typeof post> => post !== null);

  return (
    <div className="website-shell">
      <header className="window-header">
        <div className="brand-block">
          <div className="brand-title">FULLRISKCLIENT</div>
          <div className="player-count">
            <span className="online-dot" />
            {playerCount}
          </div>
        </div>
        <div className="header-actions">
          <button className="account-button" type="button">
            <img src={avatarUrl} alt="" />
            <span>SIRKNUBBLE</span>
            <Svg size={16}>
              <path d="m7 10 5 5 5-5" />
            </Svg>
          </button>
          <button className="header-icon" aria-label="Friends" type="button">
            <Svg size={22}>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </Svg>
          </button>
          <button
            className="header-icon"
            aria-label="Social links"
            type="button"
          >
            <Svg size={21}>
              <path d="M10 13a5 5 0 0 0 7.07 0l3-3A5 5 0 0 0 13 2.93l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.07 0l-3 3A5 5 0 0 0 11 21.07l1.71-1.71" />
            </Svg>
          </button>
          <div className="window-controls" aria-hidden="true">
            <span className="minimize" />
            <span className="maximize" />
            <span className="close">×</span>
          </div>
        </div>
      </header>

      <nav className="main-nav" aria-label="Main navigation">
        <div className="nav-items">
          {navItems.map(([label, href], index) => (
            <React.Fragment key={label}>
              <a className={label === "HOME" ? "active" : ""} href={href}>
                {label}
              </a>
              {index < navItems.length - 1 && (
                <span className="nav-divider">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <button
          className="notification-button"
          type="button"
          aria-label="Notifications"
        >
          <Svg size={21}>
            <path
              fill="currentColor"
              stroke="none"
              d="M12 22a2.4 2.4 0 0 0 2.35-2h-4.7A2.4 2.4 0 0 0 12 22Zm7-5-1.7-2.1V10a5.3 5.3 0 0 0-4.3-5.2V4a1 1 0 0 0-2 0v.8A5.3 5.3 0 0 0 6.7 10v4.9L5 17v1h14v-1Z"
            />
          </Svg>
        </button>
      </nav>

      <main className="play-stage" id="home">
        <div className="retro-grid" aria-hidden="true" />
        <label className="skin-toggle">
          <span>Skin Animation</span>
          <input
            type="checkbox"
            checked={animated}
            onChange={(event) => setAnimated(event.target.checked)}
          />
          <i />
        </label>
        <section className="player-frame" aria-label="PlayTab preview">
          <SkinRenderer
            textureUrl={skinUrl}
            variant="auto"
            zoom={1.3}
            cosmetics={[]}
            emote={animated ? { animation: idleAnimationUrl } : null}
            emoteLoop
            nametag={{ text: "SirKnubble", iconUrl: avatarUrl }}
            outline={{ strength: 4, thickness: 3, sensitivity: 0.1 }}
            dragAxis="yaw"
            fps={60}
            maxDpr={1.5}
            skeletonColor="#8958e8"
            className="skin-renderer"
            unsupportedFallback={
              <img
                className="skin-fallback"
                src="/body/SirKnubble.png"
                alt="SirKnubble Minecraft skin"
              />
            }
          />
          <button
            className="launch-button"
            type="button"
            aria-label="Launch FTB StoneBlock 4"
          >
            <img src="/images/ftb4.png" alt="" />
            <span className="launch-label">
              <strong>LAUNCH</strong>
              <small>FTB StoneBlock 4</small>
            </span>
            <span className="launch-dropdown">
              <Svg size={26}>
                <path d="m6 9 6 6 6-6" />
              </Svg>
            </span>
          </button>
        </section>
        <aside
          className="news-panel"
          aria-label="News"
          style={{ width: newsWidth, height: newsHeight }}
        >
          <div
            className="news-resize-y"
            role="separator"
            aria-label="Resize news height"
            onPointerDown={(event) => beginResize("y", event)}
          />
          <div
            className="news-resize-x"
            role="separator"
            aria-label="Resize news width"
            onPointerDown={(event) => beginResize("x", event)}
          />
          <div className="news-header">
            <span className="news-heading">
              <Svg size={23}>
                <path d="M4 4h16v16H4z" />
                <path d="M7 8h10M7 12h10M7 16h6" />
              </Svg>
              NEWS
            </span>
          </div>
          <div className="news-list">
            {newsItems.length ? (
              newsItems.map((post) => (
                <a
                  className="news-card"
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  key={post.id}
                >
                  <span>{post.title}</span>
                  <img src={post.image} alt={post.title} loading="lazy" />
                </a>
              ))
            ) : (
              <div className="news-empty">
                {news.length ? "No news available" : ""}
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
