import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Flame,
  Droplet,
  Wind,
  Shield,
  Lock,
  Car,
  GraduationCap,
  Users,
  Star,
  Search,
  Tag,
  Heart,
  CheckCircle,
  Download,
  Share2,
} from "lucide-react";
import ModuleDetail from "./ModuleDetail";

const icons = {
  BookOpen: <BookOpen className="text-orange-600" />,
  Flame: <Flame className="text-red-600" />,
  Droplet: <Droplet className="text-sky-600" />,
  Wind: <Wind className="text-violet-600" />,
  Shield: <Shield className="text-emerald-600" />,
  Lock: <Lock className="text-teal-600" />,
  Car: <Car className="text-yellow-500" />,
  GraduationCap: <GraduationCap className="text-indigo-600" />,
  Users: <Users className="text-gray-600" />,
};

// fallback renderer
const renderIcon = (name) => icons[name] || <BookOpen className="text-gray-400" />;

const getProgressColor = (value) => {
  if (value >= 80) return "#f97316"; // orange
  if (value >= 60) return "#ef4444"; // red
  if (value >= 40) return "#3b82f6"; // blue
  if (value >= 20) return "#22c55e"; // green
  return "#a855f7"; // purple
};

const ProgressBar = ({ value }) => (
  <div className="w-full bg-gray-200/50 rounded-full h-2.5 overflow-hidden">
    <div
      className="h-2.5 rounded-full transition-all duration-500"
      style={{
        width: `${value}%`,
        backgroundColor: getProgressColor(value),
      }}
    />
  </div>
);

const Modules = () => {
  const [modulesData, setModulesData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All Modules");
  const [selectedModule, setSelectedModule] = useState(null);

  // UI extras
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [activeTags, setActiveTags] = useState([]);
  const [bookmarks, setBookmarks] = useState({}); // store bookmarked module ids

  // --- CARD COLORS (10 colors) ---
  const cardColors = [
    "#FFEDD5", // warm amber
    "#FEE2E2", // soft red
    "#E0F2FE", // light sky
    "#EDE9FE", // light violet
    "#ECFDF5", // mint
    "#FFF7ED", // peach
    "#FEF3C7", // pale yellow
    "#FCE7F3", // blush
    "#EFF6FF", // pale blue
    "#F0FDF4", // pale green
  ];

  useEffect(() => {
    // load bookmarks from localStorage
    try {
      const raw = localStorage.getItem("moduleBookmarks");
      if (raw) setBookmarks(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    fetch("/data/modules.json")
      .then((res) => res.json())
      .then((data) => {
        // Ensure last 3 modules are completed (preserve original behaviour)
        const updated = data.map((mod, i) =>
          i >= data.length - 3 ? { ...mod, progress: 100 } : mod
        );
        // ensure modules have tags array and placeholder image space
        const normalized = updated.map((m) => ({
          tags: m.tags || ["safety"],
          image: m.image || "/images/module-placeholder.jpg",
          level: m.level || "Beginner",
          lessons: m.lessons || "6 lessons",
          ...m,
        }));
        setModulesData(normalized);
      })
      .catch((err) => console.error("Error loading modules:", err));
  }, []);

  // derived tags list (for tag filter pills)
  const allTags = Array.from(
    new Set(modulesData.flatMap((m) => (m.tags || []).map((t) => t.toLowerCase())))
  );

  // Filtering pipeline: filter by tab, by tags, by search
  const filteredModules = modulesData
    .filter((m) => {
      if (activeFilter === "All Modules") return true;
      if (activeFilter === "Completed") return m.progress === 100;
      if (activeFilter === "In Progress") return m.progress > 0 && m.progress < 100;
      if (activeFilter === "Not Started") return m.progress === 0;
      return true;
    })
    .filter((m) => {
      if (activeTags.length === 0) return true;
      // case-insensitive tag match
      const lowerTags = (m.tags || []).map((t) => t.toLowerCase());
      return activeTags.every((t) => lowerTags.includes(t));
    })
    .filter((m) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (m.title || "").toLowerCase().includes(q) ||
        (m.description || "").toLowerCase().includes(q) ||
        (m.tags || []).join(" ").toLowerCase().includes(q)
      );
    });

  // sorting
  const sortedModules = [...filteredModules].sort((a, b) => {
    if (sortBy === "progress") return b.progress - a.progress;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    // recommended: show in-progress first, then not-started, then completed
    if (sortBy === "recommended") {
      const score = (m) => {
        if (m.progress === 100) return 3;
        if (m.progress > 0) return 1;
        return 2;
      };
      return score(a) - score(b);
    }
    return 0;
  });

  // actions: bookmark, enroll, mark complete, share, download
  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      try {
        localStorage.setItem("moduleBookmarks", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const enroll = (id) => {
    setModulesData((prev) => prev.map((m) => (m.id === id ? { ...m, progress: Math.max(m.progress, 5) } : m)));
    alert("Enrolled locally — progress started. (This is local demo behaviour)");
  };

  const markComplete = (id) => {
    setModulesData((prev) => prev.map((m) => (m.id === id ? { ...m, progress: 100 } : m)));
    alert("Marked complete. Nice work!");
  };

  const shareModule = (m) => {
    const text = `${m.title} — ${m.description}\nCheck this module on DMS-X.`;
    if (navigator.share) {
      navigator
        .share({
          title: m.title,
          text,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      alert("Module details copied to clipboard.");
    }
  };

  const downloadCertificate = (m) => {
    // mock a certificate download (client-only)
    const blob = new Blob([`Certificate of Completion\nModule: ${m.title}\nIssued to: [Your Name]`], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${m.title.replace(/\s+/g, "_")}_certificate.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // UI: small helper to show badges
  const getBadge = (m) => {
    if (m.progress === 100) return { text: "Completed", color: "bg-green-100 text-green-800 ring-1 ring-green-200" };
    if (m.progress > 0) return { text: "In Progress", color: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200" };
    if (m.level && m.level.toLowerCase() === "advanced") return { text: "Advanced", color: "bg-red-100 text-red-800 ring-1 ring-red-200" };
    return { text: "New", color: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200" };
  };

  if (selectedModule) {
    return <ModuleDetail module={selectedModule} onBack={() => setSelectedModule(null)} />;
  }

  return (
    // top-level uses inline gradient background to ensure visible color
    <div
      className="min-h-screen p-6"
      style={{
        background: "linear-gradient(135deg,#eef2ff 0%, #ffffff 50%, #ecfeff 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-3xl font-extrabold"
              style={{
                background: "linear-gradient(90deg,#4f46e5,#06b6d4)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Learning Modules
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Interactive courses, videos, quizzes and simulations — practical, engaging and India-friendly.
            </p>
          </div>

          {/* Search / Sort */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2 text-gray-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search modules, tags, lessons..."
                className="pl-10 pr-3 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm bg-white/90"
              />
            </div>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="py-2 px-3 border rounded-lg bg-white/90 shadow-sm">
              <option value="recommended">Recommended</option>
              <option value="progress">Most Complete</option>
              <option value="title">A → Z</option>
            </select>

            <button
              onClick={() => {
                setActiveFilter("In Progress");
                if (!modulesData.some((m) => m.progress > 0 && m.progress < 100)) {
                  alert("No in-progress modules yet — start a module to see it here.");
                }
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white px-3 py-2 rounded-lg shadow-lg"
            >
              <Star size={14} /> My Learning
            </button>
          </div>
        </div>

        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 text-center rounded-xl shadow-md bg-white/80 border border-white/60">
            <h3 className="text-gray-500 text-sm">Total Modules</h3>
            <p className="text-2xl font-bold text-gray-900">{modulesData.length}</p>
          </div>

          <div className="p-4 text-center rounded-xl shadow-md bg-white/80 border border-white/60">
            <h3 className="text-gray-500 text-sm">Completed</h3>
            <p className="text-2xl font-bold text-gray-900">{modulesData.filter((m) => m.progress === 100).length}</p>
          </div>

          <div className="p-4 text-center rounded-xl shadow-md bg-white/80 border border-white/60">
            <h3 className="text-gray-500 text-sm">In Progress</h3>
            <p className="text-2xl font-bold text-gray-900">{modulesData.filter((m) => m.progress > 0 && m.progress < 100).length}</p>
          </div>

          <div className="p-4 text-center rounded-xl shadow-md bg-white/80 border border-white/60">
            <h3 className="text-gray-500 text-sm">Points Earned</h3>
            <p className="text-2xl font-bold text-gray-900">1,250</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {["All Modules", "In Progress", "Completed", "Not Started"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full font-medium transition ${
                activeFilter === tab ? "bg-indigo-600 text-white shadow-lg" : "bg-white/90 border hover:bg-indigo-50"
              }`}
              onClick={() => setActiveFilter(tab)}
            >
              {tab}
            </button>
          ))}

          {/* Tag pills */}
          <div className="ml-auto flex items-center gap-2">
            <div className="text-xs text-gray-500 mr-2 hidden md:inline">Filter tags:</div>
            <div className="flex gap-2 flex-wrap">
              {allTags.slice(0, 8).map((t) => {
                const active = activeTags.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => {
                      setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
                    }}
                    className={`px-3 py-1 rounded-full text-sm border transition ${
                      active ? "bg-indigo-600 text-white shadow" : "bg-white/90 hover:bg-indigo-50"
                    }`}
                  >
                    <Tag size={14} className="inline-block mr-1" /> {t}
                  </button>
                );
              })}
              {allTags.length === 0 && <div className="text-xs text-gray-400">No tags yet</div>}
            </div>
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {sortedModules.map((mod, idx) => {
            const btnColor = getProgressColor(mod.progress);
            const badge = getBadge(mod);
            const isBookmarked = !!bookmarks[mod.id];

            // pick color for this card (10-color palette)
            const accentColor = cardColors[idx % cardColors.length];

            return (
              <div
                key={mod.id}
                className="rounded-2xl overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all"
                style={{
                  boxShadow: "0 10px 30px rgba(13, 16, 30, 0.06)",
                }}
              >
                {/* Card background with subtle glass effect (inline to force visible color) */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245,250,255,0.98))",
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.6)",
                  }}
                >
                  {/* Top accent bar for color */}
                  <div style={{ height: 6, background: accentColor }} />

                  {/* Image area */}
                  <div className="relative h-44 bg-gray-50">
                    <img src={mod.image} alt={mod.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                      <div className={`px-2 py-1 text-xs rounded-full font-semibold ${badge.color}`}>{badge.text}</div>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(mod.id);
                        }}
                        className={`p-2 rounded-full bg-white/80 backdrop-blur hover:scale-105 transition`}
                      >
                        <Heart size={16} className={`${isBookmarked ? "text-rose-500" : "text-gray-500"}`} />
                      </button>
                      <button
                        title="Quick share"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareModule(mod);
                        }}
                        className="p-2 rounded-full bg-white/80 backdrop-blur hover:scale-105 transition"
                      >
                        <Share2 size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4" onClick={() => setSelectedModule(mod)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {renderIcon(mod.icon)}
                          <h3 className="font-semibold text-lg text-gray-900">{mod.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{mod.description}</p>
                        <div className="text-xs text-gray-500 mb-2">{mod.lessons}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-gray-500">Level</div>
                        <div className="font-semibold text-gray-900">{mod.level}</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <ProgressBar value={mod.progress} />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-xs text-gray-500">{mod.progress}% complete</div>

                      <div className="flex items-center gap-2">
                        <button
                          title="Enroll / Resume"
                          onClick={(e) => {
                            e.stopPropagation();
                            enroll(mod.id);
                          }}
                          className="text-xs px-3 py-1 rounded-md border bg-white/90"
                        >
                          {mod.progress === 0 ? "Enroll" : "Resume"}
                        </button>

                        <button
                          title="Mark complete"
                          onClick={(e) => {
                            e.stopPropagation();
                            markComplete(mod.id);
                          }}
                          className="text-xs px-3 py-1 rounded-md text-white"
                          style={{ backgroundColor: btnColor }}
                        >
                          {mod.progress === 100 ? (
                            <span className="flex items-center gap-1"><CheckCircle size={14} /> Completed</span>
                          ) : (
                            "Mark Complete"
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(mod.tags || []).slice(0, 4).map((t) => (
                        <span key={t} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Footer quick actions */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-gray-500">Earn points & badges</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadCertificate(mod);
                          }}
                          title="Download (mock) certificate"
                          className="px-2 py-1 rounded-md border text-xs flex items-center gap-2 bg-white/90"
                        >
                          <Download size={14} /> Certificate
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Previewing: quick glance (demo).");
                          }}
                          className="px-2 py-1 rounded-md bg-indigo-600 text-white text-xs shadow"
                        >
                          Quick Preview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No modules / empty state */}
        {sortedModules.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <p>No modules match your filters. Try removing tags or clearing search.</p>
            <div className="mt-4">
              <button
                onClick={() => {
                  setSearch("");
                  setActiveTags([]);
                  setActiveFilter("All Modules");
                }}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modules;
