
import React, { useEffect, useState } from "react";
import {
  Phone,
  Shield,
  Flame,
  Droplet,
  AlertCircle,
  X,
  Loader2,
  MapPin,
  Share2,
  Globe,
  Moon,
  Sun,
  FileText,
  ClipboardCheck,
  Bell,
  DownloadCloud,
  Volume2,
} from "lucide-react";

const Emergency = () => {
  // original states
  const [showAlert, setShowAlert] = useState(true);
  const [loadingSOS, setLoadingSOS] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // new states
  const [darkMode, setDarkMode] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapQuery, setMapQuery] = useState("new+delhi+india");
  const [reports, setReports] = useState([]);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ type: "Accident", desc: "", name: "" });
  const [language, setLanguage] = useState("en"); // en | hi
  const [availability, setAvailability] = useState([
    { name: "AIIMS - Emergency Beds", available: 2 },
    { name: "Safdarjung - ICU Beds", available: 0 },
    { name: "Metro Hospital - Oxygen Cylinders", available: 5 },
  ]);
  const [autoShare, setAutoShare] = useState(true);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { label: "Police", number: "100" },
    { label: "Fire", number: "101" },
    { label: "Ambulance", number: "102" },
  ]);

  // utility classes for contrast
  const subtleText = "text-gray-600 dark:text-gray-300";
  const linkText = "text-blue-600 dark:text-blue-300";

  // notifications
  const addNotification = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 4000);
  };

  // toggle dark mode effect on document
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // share location (browser geolocation)
  const shareLocation = () => {
    if (!navigator.geolocation) {
      addNotification("Geolocation not supported by your browser.", "info");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setMapQuery(`${latitude},${longitude}`);
        addNotification("📍 Location captured. Map updated.", "success");
      },
      () => addNotification("Unable to fetch location. Please allow location access.", "info"),
      { enableHighAccuracy: true }
    );
  };

  // copy coords
  const copyCoords = async () => {
    if (!userLocation) return addNotification("No location to copy.", "info");
    try {
      await navigator.clipboard.writeText(`${userLocation.lat}, ${userLocation.lng}`);
      addNotification("Coordinates copied to clipboard.", "success");
    } catch {
      addNotification("Unable to copy coordinates.", "info");
    }
  };

  // SOS handler (enhanced auto-share behavior)
  const handleSOS = async () => {
    setLoadingSOS(true);

    if (autoShare && userLocation) {
      try {
        if (navigator.share) {
          await navigator.share({
            title: "Emergency - Need Help",
            text: `I need help. My location: ${userLocation.lat}, ${userLocation.lng}`,
            url: `https://maps.google.com?q=${userLocation.lat},${userLocation.lng}`,
          });
          addNotification("Location shared via native share.", "success");
        } else {
          await navigator.clipboard.writeText(`${userLocation.lat}, ${userLocation.lng}`);
          addNotification("Location copied to clipboard for sharing.", "info");
        }
      } catch {
        addNotification("Unable to auto-share location.", "info");
      }
    }

    setTimeout(() => {
      setLoadingSOS(false);
      addNotification("🚨 SOS sent successfully! Emergency services notified.", "success");
      if (autoShare && emergencyContacts.length)
        addNotification(`Shared with emergency contact: ${emergencyContacts[0].label} (${emergencyContacts[0].number})`, "info");
    }, 2500);
  };

  // quick call (opens tel:)
  const handleCall = (service, number) => {
    addNotification(`📞 Calling ${service} (${number})...`, "info");
    window.location.href = `tel:${number}`;
  };

  // submit report (client-side)
  const submitReport = (e) => {
    e.preventDefault();
    const id = Date.now() + Math.random();
    setReports((prev) => [{ id, ...reportForm, time: new Date().toLocaleString() }, ...prev]);
    setReportForm({ type: "Accident", desc: "", name: "" });
    setReportOpen(false);
    addNotification("Report submitted. Authorities notified.", "success");
  };

  // edit emergency contact via prompt (simple)
  const editContact = (index) => {
    const current = emergencyContacts[index];
    const newNumber = prompt(`Enter phone number for ${current.label}:`, current.number);
    if (newNumber) {
      const copy = [...emergencyContacts];
      copy[index] = { ...copy[index], number: newNumber };
      setEmergencyContacts(copy);
      addNotification(`${copy[index].label} updated to ${newNumber}`, "success");
    }
  };

  // siren test using WebAudio
  const playSiren = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(600, audioCtx.currentTime);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
      setTimeout(() => {
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3);
        o.stop(audioCtx.currentTime + 3);
        audioCtx.close();
      }, 3000);
      addNotification("Siren test played.", "info");
    } catch {
      addNotification("Unable to play siren in this browser.", "info");
    }
  };

  // export reports CSV - FIXED: uses "\n" properly
  const exportReportsCSV = () => {
    if (!reports.length) return addNotification("No reports to export.", "info");
    const headers = ["id", "type", "name", "desc", "time"];
    const rows = reports.map((r) =>
      headers.map((h) => `"${(r[h] || "").toString().replace(/"/g, '""')}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification("Reports exported as CSV.", "success");
  };

  // demo schedule SOS
  const scheduleSOSTest = (seconds = 10) => {
    addNotification(`SOS test scheduled in ${seconds} seconds.`, "info");
    setTimeout(() => {
      addNotification("Running scheduled SOS test...", "info");
      handleSOS();
    }, seconds * 1000);
  };

  // data: Indian facilities
  const facilities = [
    { name: "AIIMS - All India Institute of Medical Sciences", type: "Hospital", distance: "2.3 km", link: "https://maps.google.com?q=AIIMS+New+Delhi" },
    { name: "Safdarjung Hospital", type: "Hospital", distance: "4.1 km", link: "https://maps.google.com?q=Safdarjung+Hospital+New+Delhi" },
    { name: "Fire Station I-8, Delhi", type: "Fire Station", distance: "1.8 km", link: "https://maps.google.com?q=Fire+Station+I-8+Delhi" },
    { name: "New Delhi Police Station", type: "Police Station", distance: "3.0 km", link: "https://maps.google.com?q=New+Delhi+Police+Station" },
  ];

  // tips (unchanged)
  const tips = [
    { title: "Stay Calm", desc: "Keep calm and speak clearly when calling emergency services" },
    { title: "Know Location", desc: "Always know your exact location and address" },
    { title: "First Aid", desc: "Learn basic first aid and CPR techniques" },
    { title: "Stay Connected", desc: "Keep your phone charged and have backup power" },
  ];

  // light localization helper
  const t = (en, hi) => (language === "hi" ? hi : en);

  return (
    <div className={`p-6 md:p-10 min-h-screen relative ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`} style={{ color: darkMode ? undefined : '#1f2937' }}>
      {/* top controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold flex items-center gap-2">
            <MapPin />
            <span>Emergency Hub — {t("India Edition", "भारत संस्करण")}</span>
          </div>
          <div className={`text-sm ${subtleText} hidden md:block`}>{t("Colorful, localized dashboard with quick actions", "रंगीन, स्थानीय डैशबोर्ड त्वरित क्रियाओं के साथ")}</div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setLanguage((l) => (l === "en" ? "hi" : "en"))} className="px-3 py-1 rounded-lg border" title="Toggle Language">
            {language === "en" ? "EN" : "हिंदी"}
          </button>

          <button onClick={() => setDarkMode((d) => !d)} className="px-3 py-1 rounded-lg border flex items-center gap-2" title="Toggle theme">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />} {darkMode ? t("Light", "प्रकाश") : t("Dark", "अंधेरा")}
          </button>
        </div>
      </div>

      {/* notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((n) => (
          <div key={n.id} className={`px-4 py-2 rounded-lg shadow-md flex items-center justify-between max-w-xs ${n.type === "success" ? "bg-green-100 text-green-700 border border-green-300" : "bg-blue-100 text-blue-700 border border-blue-300"}`}>
            <span className="text-sm">{n.message}</span>
            <button onClick={() => setNotifications((prev) => prev.filter((x) => x.id !== n.id))} className="ml-2">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* weather alert */}
      {showAlert && (
        <div className="bg-orange-100 border border-orange-300 text-orange-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-orange-600" />
            <span>
              <span className="font-medium">{t("Weather Alert:", "मौसम चेतावनी:")}</span> {t("Heavy rain and flooding expected in your area today. Stay indoors and avoid low-lying areas.", "आपके क्षेत्र में भारी बारिश और बाढ़ की संभावना है। घर के अंदर रहें और निचले क्षेत्रों से बचें।")}
            </span>
          </div>
          <button onClick={() => setShowAlert(false)}>
            <X size={18} className="text-orange-700" />
          </button>
        </div>
      )}

      {/* title */}
      <h1 className="text-3xl font-bold text-center mb-6">Emergency Hub</h1>

      {/* SOS */}
      <div className="text-center mb-12">
        <h2 className="text-xl font-semibold mb-2">{t("Emergency SOS", "आपातकालीन SOS")}</h2>
        <p className={`${subtleText} mb-6`}>{t("Press and hold the SOS button for immediate emergency assistance", "तुरंत आपातकालीन सहायता के लिए SOS बटन दबाए रखें")}</p>

        <div className="flex flex-col items-center gap-3">
          <button onClick={handleSOS} disabled={loadingSOS} className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white text-2xl font-bold flex items-center justify-center shadow-xl hover:from-red-600 hover:to-red-800 transition disabled:opacity-70">
            {loadingSOS ? <Loader2 className="animate-spin" size={32} /> : "SOS"}
          </button>

          <div className="flex gap-3 mt-2">
            <button onClick={() => scheduleSOSTest(10)} className="px-3 py-2 rounded bg-yellow-500 text-white flex items-center gap-2"><Bell /> Test SOS</button>
            <button onClick={() => setAutoShare((s) => !s)} className={`px-3 py-2 rounded border flex items-center gap-2 ${autoShare ? "bg-green-600 text-white" : ""}`}><Share2 /> {autoShare ? t("Auto-Share On", "स्वचालित साझा चालू") : t("Auto-Share Off", "स्वचालित साझा बंद")}</button>
            <button onClick={playSiren} className="px-3 py-2 rounded border flex items-center gap-2"><Volume2 /> Siren</button>
          </div>
        </div>

        <p className={`${subtleText} mt-4`}>{t("This will immediately contact emergency services with your location", "यह तुरंत आपातकालीन सेवाओं से आपके स्थान के साथ संपर्क करेगा")}</p>
      </div>

      {/* Quick Emergency Contacts (India numbers) */}
      <h2 className="text-xl font-semibold mb-4 text-center">{t("Quick Emergency Contacts", "त्वरित आपातकालीन संपर्क")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {emergencyContacts.map((c, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 text-center">
            {i === 0 && <Shield className="mx-auto text-blue-600 text-3xl mb-3 dark:text-blue-300" />}
            {i === 1 && <Flame className="mx-auto text-red-600 text-3xl mb-3 dark:text-red-400" />}
            {i === 2 && <Droplet className="mx-auto text-green-600 text-3xl mb-3 dark:text-green-400" />}
            <h3 className="font-semibold">{c.label}</h3>
            <p className={`${subtleText} text-sm mb-4`}>{c.label} emergencies and help</p>
            <div className="flex gap-2">
              <button onClick={() => handleCall(c.label, c.number)} className="btn bg-indigo-600 text-white w-full py-2 rounded-lg">Call {c.number}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Indian helplines + quick actions + reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-800 shadow-md rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Globe /> {t("Indian Helplines", "भारतीय हेल्पलाइन")}</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between items-center">
              <div>
                <div className="font-medium">112</div>
                <div className={`text-xs ${subtleText}`}>{t("All-in-one emergency number", "सभी आपातकालीन नंबर")}</div>
              </div>
              <a href="tel:112" className="px-3 py-1 rounded bg-indigo-600 text-white">Call</a>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <div className="font-medium">100</div>
                <div className={`text-xs ${subtleText}`}>{t("Police", "पुलिस")}</div>
              </div>
              <a href="tel:100" className="px-3 py-1 rounded bg-blue-600 text-white">Call</a>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <div className="font-medium">101</div>
                <div className={`text-xs ${subtleText}`}>{t("Fire", "अग्निशमन")}</div>
              </div>
              <a href="tel:101" className="px-3 py-1 rounded bg-red-600 text-white">Call</a>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <div className="font-medium">102</div>
                <div className={`text-xs ${subtleText}`}>{t("Ambulance", "एम्बुलेंस")}</div>
              </div>
              <a href="tel:102" className="px-3 py-1 rounded bg-green-600 text-white">Call</a>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Share2 /> {t("Quick Actions", "त्वरित क्रियाएँ")}</h3>
            <p className={`text-sm ${subtleText} mb-3`}>{t("Share your location with emergency services, copy coordinates, or open maps.", "अपना स्थान आपातकालीन सेवाओं के साथ साझा करें, निर्देशांक कॉपी करें, या मानचित्र खोलें।")}</p>
            <div className="flex gap-3">
              <button onClick={shareLocation} className="px-3 py-2 rounded bg-indigo-600 text-white flex items-center gap-2"><MapPin /> {t("Share Location", "स्थान साझा करें")}</button>
              <button onClick={copyCoords} className="px-3 py-2 rounded border flex items-center gap-2"><ClipboardCheck /> {t("Copy Coords", "निर्देशांक कॉपी करें")}</button>
              <a href={`https://maps.google.com?q=${mapQuery}`} target="_blank" rel="noreferrer" className="px-3 py-2 rounded border flex items-center gap-2">Open Maps</a>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 dark:text-gray-300">
            {userLocation ? <div>Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}</div> : <div>{t("Location not shared yet", "अभी तक स्थान साझा नहीं किया गया")}</div>}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2"><FileText /> {t("Reports & Incidents", "रिपोर्ट और घटनाएँ")}</h3>
          <p className={`text-sm ${subtleText} mb-3`}>{t("Submit a quick incident report to notify nearby responders", "नजदीकी प्रतिक्रिया देने वालों को सूचित करने के लिए एक त्वरित घटना रिपोर्ट सबमिट करें")}</p>
          <div className="flex gap-2">
            <button onClick={() => setReportOpen(true)} className="px-3 py-2 rounded bg-yellow-500 text-white">New Report</button>
            <button onClick={() => { setReports([]); addNotification("Reports cleared", "info"); }} className="px-3 py-2 rounded border">Clear</button>
            <button onClick={exportReportsCSV} className="px-3 py-2 rounded border flex items-center gap-2"><DownloadCloud /> Export</button>
          </div>

          <div className="mt-4 max-h-36 overflow-auto text-sm">
            {reports.length === 0 ? (<div className="text-gray-400 dark:text-gray-500">{t("No recent reports", "कोई हालिया रिपोर्ट नहीं")}</div>) :
              (reports.map((r) => (
                <div key={r.id} className="py-2 border-b last:border-b-0">
                  <div className="font-medium">{r.type} — {r.name || t("Anonymous", "गुमनाम")}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{r.time}</div>
                </div>
              )))
            }
          </div>
        </div>
      </div>

      {/* nearby facilities */}
      <h2 className="text-xl font-semibold mb-4 text-center">{t("Nearby Emergency Facilities", "नज़दीकी आपातकालीन सुविधाएँ")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4">
          <iframe title="map" src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`} className="w-full h-64 rounded-lg"></iframe>
          <div className="mt-3 flex items-center gap-3">
            <button onClick={() => setMapQuery("new+delhi+india")} className="px-3 py-1 rounded border">Delhi</button>
            <button onClick={() => setMapQuery("mumbai+india")} className="px-3 py-1 rounded border">Mumbai</button>
            <button onClick={() => setMapQuery("kolkata+india")} className="px-3 py-1 rounded border">Kolkata</button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
          <ul className="space-y-4">
            {facilities.map((facility, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <div>
                  <p className="font-medium dark:text-gray-100">{facility.name}</p>
                  <p className={`text-sm ${subtleText}`}>{facility.type}</p>
                </div>
                <div className="flex flex-col items-end">
                  <a href={facility.link} target="_blank" rel="noopener noreferrer" className={`${linkText} font-semibold mb-1`}>
                    {facility.distance} • Get Directions
                  </a>
                  <div className="text-xs text-gray-500 dark:text-gray-300">{availability[index] ? `${availability[index].available} beds` : "—"}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* tips */}
      <h2 className="text-xl font-semibold mb-4 text-center">{t("Emergency Tips", "आपातकालीन सुझाव")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tips.map((tip, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 text-center">
            <Phone className="mx-auto text-blue-500 text-2xl mb-3 dark:text-blue-300" />
            <h3 className="font-semibold">{tip.title}</h3>
            <p className={`text-sm ${subtleText}`}>{tip.desc}</p>
          </div>
        ))}
      </div>

      {/* resources */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
          <h3 className="font-semibold mb-3">{t("Resource Availability", "संसाधन उपलब्धता")}</h3>
          <ul className="space-y-2 text-sm">
            {availability.map((a, i) => (
              <li key={i} className="flex justify-between items-center">
                <div className="text-sm dark:text-gray-100">{a.name}</div>
                <div className={`px-2 py-1 rounded text-xs ${a.available > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {a.available > 0 ? `${a.available} available` : "Unavailable"}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
          <h3 className="font-semibold mb-3">{t("Quick Resources", "त्वरित संसाधन")}</h3>
          <p className={`text-sm ${subtleText} mb-3`}>{t("Useful links for responders, first aid, and shelters", "प्रतिक्रियाशीलों, प्राथमिक चिकित्सा और आश्रयों के लिए उपयोगी लिंक")}</p>
          <ul className="space-y-2 text-sm">
            <li><a href="https://nrc.nic.in/" target="_blank" rel="noreferrer" className="underline">National Remote Sensing / Disaster Resources</a></li>
            <li><a href="https://www.mohfw.gov.in/" target="_blank" rel="noreferrer" className="underline">Ministry of Health and Family Welfare</a></li>
            <li><a href="https://ndma.gov.in/" target="_blank" rel="noreferrer" className="underline">National Disaster Management Authority</a></li>
          </ul>
        </div>
      </div>

      {/* report modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setReportOpen(false)} />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-50 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{t("Submit Incident Report", "घटना रिपोर्ट सबमिट करें")}</h3>
              <button onClick={() => setReportOpen(false)}><X /></button>
            </div>
            <form onSubmit={submitReport} className="space-y-3">
              <div>
                <label className="text-sm block mb-1">Type</label>
                <select value={reportForm.type} onChange={(e) => setReportForm((p) => ({ ...p, type: e.target.value }))} className="w-full p-2 border rounded">
                  <option>Accident</option>
                  <option>Fire</option>
                  <option>Medical</option>
                  <option>Flood</option>
                </select>
              </div>
              <div>
                <label className="text-sm block mb-1">Name (optional)</label>
                <input value={reportForm.name} onChange={(e) => setReportForm((p) => ({ ...p, name: e.target.value }))} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="text-sm block mb-1">Description</label>
                <textarea value={reportForm.desc} onChange={(e) => setReportForm((p) => ({ ...p, desc: e.target.value }))} rows={4} className="w-full p-2 border rounded" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setReportOpen(false)} className="px-3 py-2 rounded border">Cancel</button>
                <button type="submit" className="px-3 py-2 rounded bg-green-600 text-white">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emergency;
