// src/pages/SchoolPanel.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const SchoolPanel = () => {
  const [step, setStep] = useState("choose"); // choose | login | dashboard
  const [role, setRole] = useState(null); // "student" | "admin"
  const [form, setForm] = useState({ email: "", password: "" });

  // UI / features states
  const [searchStudent, setSearchStudent] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [leaderboardSort, setLeaderboardSort] = useState("points"); // points | name
  const [notifications, setNotifications] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // --- Sample Data (Indian names and details) ---
  const lineData = [
    { month: "Jan", students: 45 },
    { month: "Feb", students: 50 },
    { month: "Mar", students: 48 },
    { month: "Apr", students: 60 },
    { month: "May", students: 55 },
    { month: "Jun", students: 65 },
  ];

  const pieData = [
    { name: "Grade 6A", value: 20, color: "#3B82F6" },
    { name: "Grade 6B", value: 25, color: "#22C55E" },
    { name: "Grade 7A", value: 15, color: "#FACC15" },
    { name: "Grade 7B", value: 10, color: "#EF4444" },
    { name: "Grade 8A", value: 30, color: "#8B5CF6" },
  ];

  const barData = [
    { module: "Earthquake", Completed: 80, "In Progress": 25, "Not Started": 15 },
    { module: "Fire Safety", Completed: 75, "In Progress": 20, "Not Started": 25 },
    { module: "Flood", Completed: 70, "In Progress": 30, "Not Started": 20 },
    { module: "Cyclone", Completed: 65, "In Progress": 25, "Not Started": 30 },
    { module: "Pandemic", Completed: 60, "In Progress": 35, "Not Started": 25 },
  ];

  const studentsInitial = [
    { id: 1, name: "Adarsh Tiwari", grade: "8A", points: 950, avatarColor: "#F97316" },
    { id: 2, name: "Neha Sharma", grade: "7B", points: 920, avatarColor: "#EF4444" },
    { id: 3, name: "Anurag Giri", grade: "8A", points: 885, avatarColor: "#6366F1" },
    { id: 4, name: "Aksh Sharma", grade: "7A", points: 860, avatarColor: "#22C55E" },
    { id: 5, name: "Abhishek Singh", grade: "6B", points: 840, avatarColor: "#8B5CF6" },
    { id: 6, name: "Priya Verma", grade: "6A", points: 820, avatarColor: "#F59E0B" },
    { id: 7, name: "Rohit Patel", grade: "8A", points: 800, avatarColor: "#06B6D4" },
    { id: 8, name: "Sakshi Gupta", grade: "7B", points: 780, avatarColor: "#DB2777" },
    { id: 9, name: "Vikram Yadav", grade: "6A", points: 760, avatarColor: "#10B981" },
    { id: 10, name: "Meera Jain", grade: "7A", points: 740, avatarColor: "#7C3AED" },
  ];

  const activityInitial = [
    { name: "Adarsh Tiwari", action: "Completed Fire Safety Module", time: "2 hours ago" },
    { name: "Neha Sharma", action: "Started Earthquake Module", time: "4 hours ago" },
    { name: "Anurag Giri", action: "Achieved 90% in Flood Quiz", time: "6 hours ago" },
    { name: "Aksh Sharma", action: "Downloaded Certificate", time: "1 day ago" },
    { name: "Abhishek Singh", action: "Completed Pandemic Module", time: "1 day ago" },
  ];

  const [students, setStudents] = useState(studentsInitial);
  const [activity, setActivity] = useState(activityInitial);

  // --- Student Modules (mini Module list inside student dashboard) ---
  const initialModules = [
    {
      id: "m1",
      title: "Earthquake Preparedness",
      description: "Basics of earthquake safety, drop-cover-hold, evacuation routes.",
      progress: 20,
      lessons: "4 lessons",
      level: "Beginner",
      tags: ["earthquake", "safety"],
      image: "/images/module-earthquake.jpg",
    },
    {
      id: "m2",
      title: "Fire Safety & Evacuation",
      description: "How to use fire extinguishers, fire drills, and safe exits.",
      progress: 60,
      lessons: "5 lessons",
      level: "Intermediate",
      tags: ["fire", "safety"],
      image: "/images/module-fire.jpg",
    },
    {
      id: "m3",
      title: "Flood Awareness",
      description: "Flood warnings, safe higher ground and first-aid basics.",
      progress: 0,
      lessons: "3 lessons",
      level: "Beginner",
      tags: ["flood", "awareness"],
      image: "/images/module-flood.jpg",
    },
    {
      id: "m4",
      title: "Cyclone Preparedness",
      description: "Securing windows, emergency kits and evacuation planning.",
      progress: 100,
      lessons: "4 lessons",
      level: "Advanced",
      tags: ["cyclone", "prep"],
      image: "/images/module-cyclone.jpg",
    },
    {
      id: "m5",
      title: "Pandemic Safety",
      description: "Hygiene, isolation protocols and mental health tips.",
      progress: 40,
      lessons: "6 lessons",
      level: "Intermediate",
      tags: ["pandemic", "health"],
      image: "/images/module-pandemic.jpg",
    },
    {
      id: "m6",
      title: "Basic First Aid",
      description: "CPR basics, bandaging, and treating minor injuries.",
      progress: 10,
      lessons: "3 lessons",
      level: "Beginner",
      tags: ["first-aid"],
      image: "/images/module-firstaid.jpg",
    },
  ];
  const [studentModules, setStudentModules] = useState(initialModules);

  // refs
  const announcementRef = useRef(null);

  // helper: color for progress
  const getProgressColor = (value) => {
    if (value >= 80) return "#f97316"; // orange
    if (value >= 60) return "#ef4444"; // red
    if (value >= 40) return "#3b82f6"; // blue
    if (value >= 20) return "#22c55e"; // green
    return "#a855f7"; // purple
  };

  const ProgressBarSmall = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div style={{ width: `${value}%`, background: getProgressColor(value) }} className="h-2.5 rounded-full" />
    </div>
  );

  // --- Handlers (FIXED) ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert("Please enter valid details!");
      return;
    }

    // FIX: Respect role selected on the 'choose' screen.
    // If a role was chosen (role !== null), keep it. Otherwise infer from email.
    if (!role) {
      const email = form.email.toLowerCase();
      // simple heuristics:
      if (email.includes("@student") || email.includes("student")) {
        setRole("student");
      } else {
        setRole("admin");
      }
    }
    setStep("dashboard");
    // a small notification
    const who = role || (form.email.toLowerCase().includes("student") ? "student" : "admin");
    pushNotification(`Welcome ${form.email.split("@")[0]} — logged in as ${who}`);
  };

  const handleLogout = () => {
    setStep("choose");
    setRole(null);
    setForm({ email: "", password: "" });
  };

  const pushNotification = (text) => {
    const id = Date.now();
    setNotifications((prev) => [{ id, text, time: new Date().toLocaleString("en-IN") }, ...prev].slice(0, 6));
  };

  useEffect(() => {
    // simulate periodic activity updates (demo only)
    const t = setInterval(() => {
      const randomStudent = studentsInitial[Math.floor(Math.random() * studentsInitial.length)];
      const newAct = { name: randomStudent.name, action: "Reviewed module", time: "just now" };
      setActivity((a) => [newAct, ...a].slice(0, 10));
    }, 90000); // every 90s
    return () => clearInterval(t);
  }, []);

  // --- Utility features ---
  const exportLeaderboardCSV = () => {
    const rows = [["Name", "Grade", "Points"], ...sortedStudents.map((s) => [s.name, s.grade, s.points])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leaderboard_india_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    pushNotification("Leaderboard exported (CSV).");
  };

  const downloadReportJSON = () => {
    const report = {
      generated: new Date().toISOString(),
      students,
      activity,
      stats: {
        totalStudents: students.length,
        avgPoints: Math.round(students.reduce((s, x) => s + x.points, 0) / students.length),
      },
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `school_report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushNotification("School report downloaded (JSON).");
  };

  const sendAnnouncement = () => {
    const text = announcementRef.current?.value?.trim();
    if (!text) {
      alert("Write a short announcement to send.");
      return;
    }
    setActivity((a) => [{ name: "School Admin", action: `Announcement: ${text}`, time: "just now" }, ...a].slice(0, 10));
    pushNotification("Announcement sent to students (mock).");
    announcementRef.current.value = "";
  };

  const viewStudent = (s) => {
    setSelectedStudent(s);
    setShowStudentModal(true);
  };

  const promoteStudent = (id) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, points: s.points + 50 } : s)));
    pushNotification("Student promoted (mock): +50 points");
  };

  const resetStudent = (id) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, points: 0 } : s)));
    pushNotification("Student points reset (mock).");
  };

  // --- Student module actions ---
  const enrollModule = (id) => {
    setStudentModules((prev) => prev.map((m) => (m.id === id ? { ...m, progress: Math.max(m.progress, 5) } : m)));
    pushNotification("Enrolled in module (mock).");
  };

  const completeModule = (id) => {
    setStudentModules((prev) => prev.map((m) => (m.id === id ? { ...m, progress: 100 } : m)));
    pushNotification("Module marked complete. Good job!");
  };

  // derived lists & filters
  const grades = useMemo(() => ["All", ...Array.from(new Set(students.map((s) => s.grade)))], [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (gradeFilter !== "All" && s.grade !== gradeFilter) return false;
      if (!searchStudent) return true;
      return s.name.toLowerCase().includes(searchStudent.toLowerCase()) || s.grade.toLowerCase().includes(searchStudent.toLowerCase());
    });
  }, [students, searchStudent, gradeFilter]);

  const sortedStudents = useMemo(() => {
    const arr = [...filteredStudents];
    if (leaderboardSort === "points") return arr.sort((a, b) => b.points - a.points);
    return arr.sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredStudents, leaderboardSort]);

  // --- STEP 1: Role Selection ---
  if (step === "choose") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-yellow-50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
          <div
            className="bg-white shadow-2xl p-8 rounded-2xl text-center cursor-pointer hover:scale-105 hover:shadow-3xl transition transform duration-300 border-t-8 border-gradient-to-r"
            onClick={() => {
              setRole("student");
              setStep("login");
            }}
            style={{ borderTopColor: "#6366F1", borderTopWidth: 6 }}
          >
            <div className="w-full h-36 bg-gradient-to-tr from-indigo-100 to-indigo-50 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-indigo-700 font-semibold">🎒 Student Portal</div>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-indigo-700">Student Login</h2>
            <p className="text-gray-600">
              Track your learning journey, earn badges, and access certificates — tailored for Indian schools.
            </p>
            <div className="mt-4 text-sm text-indigo-600">Use emails like <span className="font-mono">@student.in</span> for demo</div>
          </div>

          <div
            className="bg-white shadow-2xl p-8 rounded-2xl text-center cursor-pointer hover:scale-105 hover:shadow-3xl transition transform duration-300"
            onClick={() => {
              setRole("admin");
              setStep("login");
            }}
            style={{ borderTopColor: "#F97316", borderTopWidth: 6, borderStyle: "solid" }}
          >
            <div className="w-full h-36 bg-gradient-to-tr from-amber-50 to-amber-100 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-amber-700 font-semibold">🏫 Admin Portal</div>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-amber-700">School Admin Login</h2>
            <p className="text-gray-600">
              Manage student performance, generate reports, and communicate with parents — India-ready.
            </p>
            <div className="mt-4 text-sm text-amber-600">Use emails like <span className="font-mono">@school.edu</span> for demo</div>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 2: Login Form ---
  if (step === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border-t-4" style={{ borderTopColor: role === "student" ? "#6366F1" : "#F97316" }}>
          <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: role === "student" ? "#4F46E5" : "#D97706" }}>
            {role === "student" ? "Student Login" : "Admin Login"}
          </h2>
          <p className="text-center text-sm text-gray-500 mb-4">
            Demo credentials accepted. This is a client-only mock for UI preview.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="you@school.edu or you@student.in"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${role === "student" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-amber-600 hover:bg-amber-700"}`}
            >
              Login
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  // quick demo fill uses selected role to pick sample email
                  setForm({ email: role === "student" ? "me@student.in" : "admin@school.edu", password: "demo123" });
                }}
                className="w-1/2 bg-gray-100 py-2 rounded-lg hover:bg-gray-200"
              >
                Quick Fill
              </button>
              <button
                type="button"
                onClick={() => setStep("choose")}
                className="w-1/2 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
              >
                Back
              </button>
            </div>
          </form>

          <div className="mt-4 text-xs text-gray-500">
            Helpful links:{" "}
            <a className="text-indigo-600" href="https://ncert.nic.in" target="_blank" rel="noreferrer">
              NCERT
            </a>{" "}
            •{" "}
            <a className="text-indigo-600" href="https://www.india.gov.in" target="_blank" rel="noreferrer">
              India.gov.in
            </a>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 3: Dashboards ---
  if (step === "dashboard" && role === "student") {
    // quick student view: pick student by email (demo) else default first
    const currentStudent = students.find((s) => form.email && form.email.split("@")[0].toLowerCase().includes(s.name.split(" ")[0].toLowerCase())) || students[0];

    const modulesCompleted = studentModules.filter((m) => m.progress === 100).length;
    const classRanking = 3;
    const totalPoints = currentStudent.points || 0;
    const loginStreak = 7;

    return (
      <div className="p-6 bg-gradient-to-br from-indigo-50 to-white min-h-screen space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-700">Welcome Back, {currentStudent.name.split(" ")[0]}!</h1>
            <p className="text-sm text-gray-600 mt-1">Keep up the great work — here's your personalized learning snapshot.</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => pushNotification("Profile settings clicked")} className="px-4 py-2 rounded-lg bg-white shadow hover:shadow-md">
              Profile
            </button>
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
              Logout
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl shadow-md bg-gradient-to-tr from-white to-indigo-50 border">
            <p className="text-sm text-gray-500">Modules Completed</p>
            <p className="text-3xl font-bold text-indigo-600">{modulesCompleted}/6</p>
          </div>

          <div className="p-6 rounded-xl shadow-md bg-gradient-to-tr from-white to-emerald-50 border">
            <p className="text-sm text-gray-500">Class Ranking</p>
            <p className="text-3xl font-bold text-emerald-600">#{classRanking}</p>
          </div>

          <div className="p-6 rounded-xl shadow-md bg-gradient-to-tr from-white to-amber-50 border">
            <p className="text-sm text-gray-500">Total Points</p>
            <p className="text-3xl font-bold text-amber-600">{totalPoints}</p>
          </div>

          <div className="p-6 rounded-xl shadow-md bg-gradient-to-tr from-white to-pink-50 border">
            <p className="text-sm text-gray-500">Login Streak</p>
            <p className="text-3xl font-bold text-pink-600">{loginStreak} days</p>
          </div>
        </div>

        {/* Progress Chart + Upcoming */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Your Learning Progress</h2>
              <div className="text-sm text-gray-500">Last 6 months</div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4 text-lg">Certificates & Achievements</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="text-2xl">🏅</div>
                <div>
                  <div className="font-medium">Gold Badge in Fire Safety</div>
                  <div className="text-xs text-gray-500">Issued by School Safety Cell</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-2xl">🎖️</div>
                <div>
                  <div className="font-medium">Top 3 — Earthquake Preparedness Quiz</div>
                  <div className="text-xs text-gray-500">Score: 92%</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-2xl">📜</div>
                <div>
                  <div className="font-medium">Certificate — Pandemic Safety</div>
                  <div className="text-xs text-gray-500">Downloadable in Profile</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Modules area (added) */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Disaster Management Modules</h2>
            <div className="text-sm text-gray-500">Interactive lessons, videos & quizzes</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {studentModules.map((m) => (
              <div key={m.id} className="bg-gradient-to-tr from-white to-gray-50 p-4 rounded-xl shadow hover:shadow-md">
                <div className="h-36 bg-gray-100 rounded-md mb-3 overflow-hidden">
                  <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                </div>
                <div className="mb-2">
                  <div className="font-semibold text-gray-900">{m.title}</div>
                  <div className="text-xs text-gray-500">{m.lessons} • {m.level}</div>
                </div>
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">{m.progress}% complete</div>
                  <ProgressBarSmall value={m.progress} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {(m.tags || []).slice(0, 3).map((t) => (
                    <span key={t} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => enrollModule(m.id)} className="flex-1 px-3 py-2 rounded-md border text-sm">Enroll</button>
                  <button onClick={() => completeModule(m.id)} className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">Mark Complete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Modules + Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Upcoming Modules</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <div>
                  <div className="font-medium">Flood Awareness</div>
                  <div className="text-sm text-gray-500">Interactive video + quiz</div>
                </div>
                <div className="text-sm text-gray-500">Due in 3 days</div>
              </li>
              <li className="flex justify-between">
                <div>
                  <div className="font-medium">Cyclone Preparedness</div>
                  <div className="text-sm text-gray-500">Simulation module</div>
                </div>
                <div className="text-sm text-gray-500">Due in 1 week</div>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Resources (India)</h3>
            <ul className="text-sm space-y-2">
              <li><a href="https://ncert.nic.in" className="text-indigo-600" target="_blank" rel="noreferrer">NCERT — Textbooks & Resources</a></li>
              <li><a href="https://www.india.gov.in" className="text-indigo-600" target="_blank" rel="noreferrer">India.gov.in — Government Resources</a></li>
              <li><a href="https://ndma.gov.in" className="text-indigo-600" target="_blank" rel="noreferrer">NDMA — Disaster Management</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // --- Admin Dashboard ---
  if (step === "dashboard" && role === "admin") {
    return (
      <div className="p-6 bg-gradient-to-br from-yellow-50 to-white min-h-screen space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-amber-700">School Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Manage students, modules and reports — India-ready interface.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={exportLeaderboardCSV} className="px-4 py-2 rounded-lg bg-white shadow hover:shadow-md">
              Export Leaderboard
            </button>
            <button onClick={downloadReportJSON} className="px-4 py-2 rounded-lg bg-white shadow hover:shadow-md">
              Download Report
            </button>
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700">
              Logout
            </button>
          </div>
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl shadow-md bg-white border-l-4 border-amber-400">
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{students.length}</p>
          </div>

          <div className="p-6 rounded-xl shadow-md bg-white border-l-4 border-indigo-400">
            <p className="text-sm text-gray-500">Avg Points</p>
            <p className="text-2xl font-bold text-gray-900">{Math.round(students.reduce((s, x) => s + x.points, 0) / students.length)}</p>
          </div>

          <div className="p-6 rounded-xl shadow-md bg-white border-l-4 border-emerald-400">
            <p className="text-sm text-gray-500">Modules (Active)</p>
            <p className="text-2xl font-bold text-gray-900">5</p>
          </div>

          <div className="p-6 rounded-xl shadow-md bg-white border-l-4 border-pink-400">
            <p className="text-sm text-gray-500">Recent Notifications</p>
            <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie */}
          <div className="bg-white p-6 shadow rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Class Distribution</h2>
              <div className="text-sm text-gray-500">Live snapshot</div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 flex gap-3 flex-wrap">
              {pieData.map((p) => (
                <div key={p.name} className="text-xs bg-gray-50 px-3 py-1 rounded-full shadow-sm flex items-center gap-2">
                  <span style={{ width: 10, height: 10, background: p.color, borderRadius: 4, display: "inline-block" }} />
                  {p.name} • {p.value}
                </div>
              ))}
            </div>
          </div>

          {/* Bar */}
          <div className="bg-white p-6 shadow rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Module Progress</h2>
              <div className="text-sm text-gray-500">Stacked view</div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="module" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Completed" stackId="a" fill="#22C55E" />
                <Bar dataKey="In Progress" stackId="a" fill="#FACC15" />
                <Bar dataKey="Not Started" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard & Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Top Performing Students</h2>
              <div className="flex items-center gap-2">
                <input
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  placeholder="Search name or grade..."
                  className="px-3 py-2 border rounded-lg"
                />
                <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="px-3 py-2 border rounded-lg">
                  {grades.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <select value={leaderboardSort} onChange={(e) => setLeaderboardSort(e.target.value)} className="px-3 py-2 border rounded-lg">
                  <option value="points">Sort by Points</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 text-left">Student</th>
                    <th className="p-2 text-left">Grade</th>
                    <th className="p-2 text-left">Points</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 flex items-center gap-3">
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: s.avatarColor }} className="flex items-center justify-center text-white font-medium">
                          {s.name.split(" ").map((n) => n[0]).slice(0,2).join("")}
                        </div>
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-gray-500">ID: SCH{1000 + s.id}</div>
                        </div>
                      </td>
                      <td className="p-2">{s.grade}</td>
                      <td className="p-2">{s.points}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button onClick={() => viewStudent(s)} className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs">View</button>
                          <button onClick={() => promoteStudent(s.id)} className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs">Promote</button>
                          <button onClick={() => resetStudent(s.id)} className="px-3 py-1 rounded-lg bg-red-50 text-red-700 text-xs">Reset</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">Showing {sortedStudents.length} students</div>
              <div className="flex gap-2">
                <button onClick={exportLeaderboardCSV} className="px-3 py-2 rounded-lg bg-white border">Export CSV</button>
                <button onClick={() => { setStudents((prev) => [...prev, { id: Date.now(), name: "New Student", grade: "6A", points: 0, avatarColor: "#60A5FA" }]); pushNotification("New student added (mock)"); }} className="px-3 py-2 rounded-lg bg-indigo-600 text-white">Add Student</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Recent Activity</h2>
            <ul className="space-y-3 max-h-64 overflow-auto">
              {activity.map((a, i) => (
                <li key={i} className="flex justify-between items-start gap-3">
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-sm text-gray-600">{a.action}</div>
                  </div>
                  <div className="text-xs text-gray-500">{a.time}</div>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Send Announcement</h3>
              <textarea ref={announcementRef} rows={3} className="w-full border rounded-lg px-3 py-2" placeholder="Write announcement for students / parents..." />
              <div className="mt-2 flex gap-2">
                <button onClick={sendAnnouncement} className="px-3 py-2 rounded-lg bg-amber-600 text-white">Send</button>
                <button onClick={() => { announcementRef.current.value = ""; }} className="px-3 py-2 rounded-lg bg-gray-100">Clear</button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications + Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl shadow col-span-1 md:col-span-1">
            <h3 className="font-semibold mb-2">Notifications</h3>
            <ul className="space-y-2">
              {notifications.length === 0 && <div className="text-sm text-gray-500">No notifications yet</div>}
              {notifications.map((n) => (
                <li key={n.id} className="text-sm bg-gray-50 p-2 rounded-lg">
                  <div className="font-medium">{n.text}</div>
                  <div className="text-xs text-gray-500">{n.time}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-xl shadow col-span-2 md:col-span-2">
            <h3 className="font-semibold mb-2">Resources & Links (India)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <a href="https://ncert.nic.in" target="_blank" rel="noreferrer" className="p-3 border rounded-lg text-sm hover:shadow">NCERT</a>
              <a href="https://ndma.gov.in" target="_blank" rel="noreferrer" className="p-3 border rounded-lg text-sm hover:shadow">NDMA</a>
              <a href="https://www.india.gov.in" target="_blank" rel="noreferrer" className="p-3 border rounded-lg text-sm hover:shadow">India.gov.in</a>
              <a href="https://mhrd.gov.in" target="_blank" rel="noreferrer" className="p-3 border rounded-lg text-sm hover:shadow">Ministry of Education</a>
              <a href="https://www.careers360.com" target="_blank" rel="noreferrer" className="p-3 border rounded-lg text-sm hover:shadow">Careers360</a>
              <a href="https://www.indiatoday.in/education-today" target="_blank" rel="noreferrer" className="p-3 border rounded-lg text-sm hover:shadow">Education News</a>
            </div>
          </div>
        </div>

        {/* Student detail modal */}
        {showStudentModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 relative">
              <button onClick={() => setShowStudentModal(false)} className="absolute top-3 right-3 text-gray-500">&times;</button>
              <div className="flex items-center gap-4">
                <div style={{ width: 64, height: 64, borderRadius: 12, background: selectedStudent.avatarColor }} className="flex items-center justify-center text-white font-bold text-lg">
                  {selectedStudent.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                  <div className="text-sm text-gray-600">Grade {selectedStudent.grade} • ID: SCH{1000 + selectedStudent.id}</div>
                  <div className="text-sm text-gray-700 mt-2">Points: {selectedStudent.points}</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <button onClick={() => { promoteStudent(selectedStudent.id); setShowStudentModal(false); }} className="px-3 py-2 rounded-lg bg-emerald-600 text-white">Award +50 points</button>
                <button onClick={() => { resetStudent(selectedStudent.id); setShowStudentModal(false); }} className="px-3 py-2 rounded-lg bg-red-50 text-red-700">Reset points</button>
                <a href={`https://www.india.gov.in`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg bg-gray-100 text-sm">View School Portal</a>
                <button onClick={() => { pushNotification(`Sent message to ${selectedStudent.name} (mock)`); setShowStudentModal(false); }} className="px-3 py-2 rounded-lg bg-indigo-600 text-white">Message Student</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default SchoolPanel;
