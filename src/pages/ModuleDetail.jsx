// client/src/pages/ModuleDetail.jsx
import React, { useEffect, useState } from "react";
import EarthquakeEscape from "../components/games/EarthquakeEscape";
import QuickDecisionQuiz from "../components/games/QuickDecisionQuiz";

const CATEGORY_TABS = [
  "Articles",
  "Videos",
  "Animations",
  "Virtual Reality",
  "Games",
  "Historic Events",
  "Future Disasters",
  "Quizzes",
  "Podcasts",
  "Live Tutoring",
  "Workshops",
  "Simulations",
  "Case Studies",
  "Challenges",
  "Expert Talks"
];

const TAB_META = {
  Articles: { icon: "📄", hint: "Read time & summaries" },
  Videos: { icon: "🎬", hint: "Watch tutorials" },
  Animations: { icon: "🧩", hint: "Explainers" },
  "Virtual Reality": { icon: "🕶️", hint: "Immersive practice" },
  Games: { icon: "🎮", hint: "Interactive scenarios" },
  "Historic Events": { icon: "📜", hint: "Past incidents" },
  "Future Disasters": { icon: "🔮", hint: "Scenario planning" },
  Quizzes: { icon: "❓", hint: "Test knowledge" },
  Podcasts: { icon: "🎧", hint: "Audio guides" },
  "Live Tutoring": { icon: "🧑‍🏫", hint: "1-on-1 or group sessions" },
  Workshops: { icon: "🤝", hint: "Hands-on group learning" },
  Simulations: { icon: "🧪", hint: "Practice realistic drills" },
  "Case Studies": { icon: "📂", hint: "Real-world examples" },
  Challenges: { icon: "🏆", hint: "Tasks & problem-solving" },
  "Expert Talks": { icon: "🎤", hint: "Insights from professionals" }
};

const pillClasses = (active) =>
  `px-4 py-2 rounded-full text-sm font-semibold transition-transform duration-200 flex items-center gap-3 shadow-md select-none focus:outline-none focus:ring-2 focus:ring-offset-2 ` +
  (active
    ? "bg-gradient-to-r from-pink-500 via-indigo-600 to-blue-500 text-white transform scale-105 ring-4 ring-indigo-200"
    : "bg-white hover:bg-gray-50 text-gray-700");

// Vite-friendly resolver for public assets
const resolvePublicPath = (p) => {
  if (!p) return null;
  if (typeof p !== "string") return null;
  if (p.startsWith("/") || p.startsWith("http")) return p;
  return `${import.meta.env.BASE_URL || "/"}${p}`;
};

const ModuleDetail = ({ module, onBack }) => {
  const [contentData, setContentData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Articles");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let mounted = true;

    const normalizeType = (s) => (s || "").toString().trim().toLowerCase();

    const findModuleList = (obj, title) => {
      if (!obj || typeof obj !== "object") return null;
      if (!title) return null;
      const exact = obj[title];
      if (Array.isArray(exact)) return exact;
      const lower = title.trim().toLowerCase();
      for (const k of Object.keys(obj)) {
        if (k && k.toString().trim().toLowerCase() === lower && Array.isArray(obj[k])) return obj[k];
      }
      return null;
    };

    const loadData = async () => {
      try {
        const candidatePaths = [
          "/data/contentData.json",
          "/data/ContentData.json",
          "/data/content.json",
          "/data/contentdata.json"
        ];

        let foundList = null;
        const fetchedObjects = [];

        for (const p of candidatePaths) {
          try {
            // log which path we try
            // eslint-disable-next-line no-console
            console.debug("[ModuleDetail] Trying fetch:", p);
            const r = await fetch(p);
            if (!r) {
              // eslint-disable-next-line no-console
              console.debug("[ModuleDetail] fetch returned falsy response for", p);
              continue;
            }
            // eslint-disable-next-line no-console
            console.debug(`[ModuleDetail] ${p} status:`, r.status, "content-type:", r.headers.get("content-type"));
            if (!r.ok) continue;

            // read text first so we can diagnose HTML vs JSON
            const text = await r.text();

            let parsed = null;
            try {
              parsed = JSON.parse(text);
            } catch (parseErr) {
              // show the start of the response so you can see if it's index.html
              // eslint-disable-next-line no-console
              console.warn(`[ModuleDetail] Failed to parse JSON from ${p}. Response (first 300 chars):\n`, text.slice(0, 300));
              // store the raw text for debugging and continue to next candidate
              continue;
            }

            fetchedObjects.push({ path: p, parsed });
            // eslint-disable-next-line no-console
            console.debug("[ModuleDetail] keys in parsed:", Object.keys(parsed).slice(0, 10));
            const list = findModuleList(parsed, module && module.title ? module.title : "");
            if (list && list.length) {
              foundList = list;
              // eslint-disable-next-line no-console
              console.debug("[ModuleDetail] Found module list at", p);
              break;
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn("[ModuleDetail] fetch error for", p, e);
            // ignore and continue
          }
        }

        // if not found, try case-insensitive search across fetched objects
        if (!foundList && fetchedObjects.length) {
          for (const o of fetchedObjects) {
            const list = findModuleList(o.parsed, module && module.title ? module.title : "");
            if (list && list.length) {
              foundList = list;
              // eslint-disable-next-line no-console
              console.debug("[ModuleDetail] Found module list during second pass at", o.path);
              break;
            }
          }
        }

        // fallback: if module.title missing or still no match, pick the first array value found in any fetched object
        if (!foundList && fetchedObjects.length) {
          // eslint-disable-next-line no-console
          console.debug("[ModuleDetail] No exact module match. Attempting fallback to first array found.");
          for (const o of fetchedObjects) {
            const parsed = o.parsed;
            if (Array.isArray(parsed)) {
              foundList = parsed;
              // eslint-disable-next-line no-console
              console.debug("[ModuleDetail] Fallback: JSON root is an array (using it).");
              break;
            }
            for (const k of Object.keys(parsed)) {
              if (Array.isArray(parsed[k])) {
                foundList = parsed[k];
                // eslint-disable-next-line no-console
                console.debug("[ModuleDetail] Fallback: using first array under key:", k);
                break;
              }
            }
            if (foundList) break;
          }
        }

        if (mounted) {
          setContentData(foundList || []);
          setSelectedItem(null);
          // eslint-disable-next-line no-console
          console.debug("[ModuleDetail] Final contentData length:", (foundList && foundList.length) || 0);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error loading content:", err);
        if (mounted) setContentData([]);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [module && module.title]);

  const normalizeType = (s) => (s || "").toString().trim().toLowerCase();

  const filteredContent = contentData.filter(
    (item) => normalizeType(item.type) === normalizeType(activeCategory)
  );

  const renderMultiline = (text) => {
    if (!text) return null;

    const normalized = text.replace(/\r\n/g, "\n").trim();

    const blocks = normalized
      .split(/\n\s*\n/)
      .map((b) => b.trim())
      .filter(Boolean);

    return blocks.map((block, idx) => {
      const headingMatch = block.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const content = headingMatch[2];
        const Tag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
        const sizeClass =
          level === 1 ? "text-3xl" : level === 2 ? "text-2xl" : "text-xl";
        return (
          <Tag
            key={idx}
            className={`mt-6 mb-3 font-semibold leading-tight ${sizeClass} text-gray-900`}
          >
            {content}
          </Tag>
        );
      }

      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

      if (lines.every((l) => /^(-|\*)\s+/.test(l))) {
        return (
          <ul key={idx} className="list-disc ml-6 mb-4 space-y-1 text-gray-700">
            {lines.map((l, i) => (
              <li key={i} className="leading-7">
                {l.replace(/^(-|\*)\s+/, "")}
              </li>
            ))}
          </ul>
        );
      }

      if (lines.every((l) => /^\d+\.\s+/.test(l))) {
        return (
          <ol key={idx} className="list-decimal ml-6 mb-4 space-y-1 text-gray-700">
            {lines.map((l, i) => (
              <li key={i} className="leading-7">
                {l.replace(/^\d+\.\s+/, "")}
              </li>
            ))}
          </ol>
        );
      }

      const inlineParts = block.split("\n").map((p, i) => (
        <React.Fragment key={i}>
          {p}
          {i < block.split("\n").length - 1 && <br />}
        </React.Fragment>
      ));

      return (
        <p key={idx} className="mb-4 text-gray-700 leading-8">
          {inlineParts}
        </p>
      );
    });
  };

  const renderGameComponent = (name, props) => {
    if (name === "EarthquakeEscape") return <EarthquakeEscape {...props} />;
    if (name === "QuickDecisionQuiz") return <QuickDecisionQuiz {...props} />;
    return <div className="p-6 bg-red-50 rounded">Game component &quot;{name}&quot; not found.</div>;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900 space-x-2"
        onClick={onBack}
      >
        <span className="text-2xl">←</span>
        <span>Back to Modules</span>
      </button>

      {/* header */}
      <header className="mb-6 rounded-3xl overflow-hidden shadow-lg">
        <div className="p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:flex md:items-center md:space-x-4">
              <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center text-4xl font-bold shadow-md">
                🌍
              </div>
              <div>
                <h2 className="text-4xl font-extrabold leading-tight">{module && module.title}</h2>
                <p className="mt-1 text-sm opacity-90">{module && module.description}</p>
                <div className="mt-3 flex gap-3 items-center">
                  <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm">{contentData.length} resources</span>
                  <span className="inline-block bg-white/10 px-3 py-1 rounded-full text-sm">{(module && module.level) || 'All levels'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:flex md:items-center md:space-x-3">
              <button className="px-4 py-2 bg-white text-indigo-700 rounded-lg font-semibold shadow hover:scale-105 transform transition">Start Learning</button>
              <button className="px-4 py-2 bg-transparent border border-white/30 text-white rounded-lg font-medium shadow-sm">Download PDF</button>
            </div>
          </div>
        </div>

        <div className="sticky top-4 z-20 bg-white/95 backdrop-blur-sm px-4 py-3 border-t border-b border-gray-100">
          <div className="flex gap-3 overflow-auto pb-2">
            {CATEGORY_TABS.map((tab) => {
              const meta = TAB_META[tab] || {};
              const active = activeCategory === tab;
              return (
                <button
                  key={tab}
                  className={pillClasses(active)}
                  onClick={() => {
                    setActiveCategory(tab);
                    setSelectedItem(null);
                  }}
                  aria-pressed={active}
                  title={meta.hint || ''}
                >
                  <span className="text-lg">{meta.icon || '•'}</span>
                  <span>{tab}</span>
                  <span className="ml-2 text-xs opacity-80 bg-white/20 px-2 py-0.5 rounded-full">{contentData.filter(i => normalizeType(i.type) === normalizeType(tab)).length}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-xs text-gray-500 flex items-center gap-4">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-pink-500 inline-block" /> <span>Popular</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> <span>Recommended</span></div>
            <div className="flex-1 text-right">Showing <strong>{filteredContent.length}</strong> items in <em>{activeCategory}</em></div>
          </div>
        </div>
      </header>

      {activeCategory !== "Games" &&
        activeCategory !== "Virtual Reality" &&
        activeCategory !== "Quizzes" && (
          <div className="mb-4 text-sm text-gray-500">
            Personalized content suggestions appear here based on your progress.
          </div>
        )}

      {selectedItem ? (
        selectedItem.isGame && selectedItem.component ? (
          <div className="mb-8">
            {renderGameComponent(selectedItem.component, { onExit: () => setSelectedItem(null) })}
          </div>
        ) : (
          <article className="bg-gradient-to-b from-white to-indigo-50 rounded-2xl shadow-2xl p-6 mb-8 border-l-4 border-indigo-300 overflow-hidden">
            <button
              className="mb-4 inline-flex items-center text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedItem(null)}
            >
              <span className="text-xl mr-2">←</span>
              <span>Back to {activeCategory}</span>
            </button>

            <div className="md:flex md:items-start md:space-x-6">
              {selectedItem.image && (
                <img
                  src={resolvePublicPath(selectedItem.image)}
                  alt={selectedItem.title}
                  className="w-full md:w-1/3 h-52 object-cover rounded-lg mb-4 md:mb-0 border border-gray-200"
                />
              )}

              <div className="md:flex-1">
                <h3 className="text-3xl font-bold mb-2 text-gray-900">{selectedItem.title}</h3>
                {selectedItem.summary && (
                  <p className="text-sm text-gray-600 italic mb-4">{selectedItem.summary}</p>
                )}

                <div className="flex items-center text-xs text-gray-500 mb-4 space-x-3">
                  {selectedItem.duration && <span className="px-2 py-1 bg-white/60 rounded">{selectedItem.duration}</span>}
                  {selectedItem.level && <span className="px-2 py-1 bg-white/60 rounded">• {selectedItem.level} Level</span>}
                  {selectedItem.points !== undefined && (
                    <span className="ml-auto bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">+{selectedItem.points} pts</span>
                  )}
                </div>

                <div className="prose max-w-none mt-4">
                  {selectedItem.videoUrl ? (
                    <div className="mb-6" style={{ paddingTop: "56.25%", position: "relative" }}>
                      <iframe
                        title={selectedItem.title}
                        src={selectedItem.videoUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                      />
                    </div>
                  ) : (
                    <div className="text-gray-700">
                      {selectedItem.content
                        ? renderMultiline(selectedItem.content)
                        : selectedItem.summary && <p className="mb-4">{selectedItem.summary}</p>}
                    </div>
                  )}

                  {selectedItem.link && (
                    <a
                      href={selectedItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 mt-4 shadow"
                    >
                      Open Resource
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        )
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transform transition hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={resolvePublicPath(item.image)}
                    alt={item.title}
                    className="h-40 w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/40 text-white px-2 py-1 rounded text-xs">{item.type}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-1 line-clamp-3">{item.summary}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    {item.duration} • {item.level} Level
                  </p>
                  <button
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 mb-2"
                    onClick={() => {
                      if (item.type === "Games" && item.component) {
                        setSelectedItem({ ...item, isGame: true });
                      } else {
                        setSelectedItem(item);
                      }
                    }}
                  >
                    View {item.type}
                  </button>
                  <div className="flex space-x-2 mt-2">
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                      +{item.points} pts
                    </span>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                      Badge Unlock
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              <p>No {activeCategory} available yet for this module.</p>
              <img
                src="/images/empty-state.jpg"
                alt="Empty"
                className="mx-auto mt-4 w-48 opacity-70"
              />
            </div>
          )}
        </>
      )}

      {(activeCategory === "Games" || activeCategory === "Virtual Reality") && (
        <div className="mt-8 p-6 bg-indigo-100 rounded-xl">
          <h3 className="text-lg font-bold mb-2">
            {activeCategory} Feature Highlights
          </h3>
          <ul className="list-disc list-inside text-gray-700">
            {activeCategory === "Games" && (
              <>
                <li>
                  Interactive disaster-scenario quests with dynamic branching
                  outcomes — learn by doing and see consequences in real-time.
                </li>
                <li>
                  Leaderboards and collaborative multiplayer scenarios to
                  enhance engagement through competitive learning.
                </li>
              </>
            )}
            {activeCategory === "Virtual Reality" && (
              <>
                <li>
                  Immersive VR simulations replicating disaster environments —
                  practice safely in VR rooms like first responders.
                </li>
                <li>
                  Scenario replay and debrief tools for reviewing actions and
                  decision-making process post-session.
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      <div className="mt-12 p-6 bg-gradient-to-r from-white to-pink-50 rounded-xl shadow-inner">
        <h3 className="text-lg font-bold mb-3">More titles like this</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-lg shadow text-sm">
            🌍 Climate Change & Community Resilience
          </div>
          <div className="bg-white p-3 rounded-lg shadow text-sm">
            🏥 Emergency First Aid Basics
          </div>
          <div className="bg-white p-3 rounded-lg shadow text-sm">
            🚨 Urban Disaster Risk Management
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
