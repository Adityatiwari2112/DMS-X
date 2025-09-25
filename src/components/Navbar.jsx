// import { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import UserEntry from "./UserEntry"; // import your popup component

// const Navbar = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showUserEntry, setShowUserEntry] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [showProfile, setShowProfile] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);

//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setShowDropdown(false);
//     setUserName("");
//     localStorage.removeItem("user");
//   };

//   // Helper to get initials
//   const getInitials = (name) => {
//     if (!name) return "U";
//     const parts = name.trim().split(" ");
//     if (parts.length === 1) return parts[0][0].toUpperCase();
//     return (
//       parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase()
//     );
//   };

//   return (
//     <nav className="bg-white shadow-md font-sans relative">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <span className="bg-blue-600 text-white rounded-md px-2 py-1 font-bold"></span>
//             <span className="text-lg font-bold tracking-tight text-gray-900">
//               DMS<span className="text-blue-600">-X</span>
//             </span>
//           </div>

//           {/* Links */}
//           <div className="hidden md:flex space-x-10 items-center relative">
//             <NavLink
//               to="/"
//               end
//               className={({ isActive }) =>
//                 `text-sm font-medium tracking-wide ${
//                   isActive
//                     ? "text-blue-600 underline underline-offset-4"
//                     : "text-gray-700 hover:text-blue-600"
//                 }`
//               }
//             >
//               Home
//             </NavLink>
//             <NavLink
//               to="/modules"
//               className={({ isActive }) =>
//                 `text-sm font-medium tracking-wide ${
//                   isActive
//                     ? "text-blue-600 underline underline-offset-4"
//                     : "text-gray-700 hover:text-blue-600"
//                 }`
//               }
//             >
//               Modules
//             </NavLink>
//             <NavLink
//               to="/emergency"
//               className={({ isActive }) =>
//                 `text-sm font-medium tracking-wide ${
//                   isActive
//                     ? "text-blue-600 underline underline-offset-4"
//                     : "text-gray-700 hover:text-blue-600"
//                 }`
//               }
//             >
//               Emergency
//             </NavLink>
//             <NavLink
//               to="/school"
//               className={({ isActive }) =>
//                 `text-sm font-medium tracking-wide ${
//                   isActive
//                     ? "text-blue-600 underline underline-offset-4"
//                     : "text-gray-700 hover:text-blue-600"
//                 }`
//               }
//             >
//               School Panel
//             </NavLink>
//             <NavLink
//               to="/about"
//               className={({ isActive }) =>
//                 `text-sm font-medium tracking-wide ${
//                   isActive
//                     ? "text-blue-600 underline underline-offset-4"
//                     : "text-gray-700 hover:text-blue-600"
//                 }`
//               }
//             >
//               About
//             </NavLink>

//             {/* Profile Section */}
//             {isLoggedIn ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setShowDropdown((prev) => !prev)}
//                   className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
//                 >
//                   <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
//                     {getInitials(userName)}
//                   </div>
//                 </button>

//                 {showDropdown && (
//                   <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
//                     <button
//                       onClick={() => {
//                         setShowDropdown(false);
//                         setShowProfile(true);
//                       }}
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Profile
//                     </button>
//                     <button
//                       onClick={() => {
//                         setShowDropdown(false);
//                         setShowSettings(true);
//                       }}
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Settings
//                     </button>
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <button
//                 onClick={() => setShowUserEntry(true)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Login
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* User Entry Modal */}
//       {showUserEntry && (
//         <UserEntry
//           onClose={() => setShowUserEntry(false)}
//           setUser={(user) => {
//             setUserName(user.name);
//             setIsLoggedIn(true);
//             setShowUserEntry(false);
//           }}
//         />
//       )}

//       {/* Profile Modal */}
//       {showProfile && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">My Profile</h2>
//             <div className="flex items-center space-x-4">
//               <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl font-bold">
//                 {getInitials(userName)}
//               </div>
//               <div>
//                 <p className="text-lg font-semibold">{userName || "User"}</p>
//                 <p className="text-gray-600">user@email.com</p>
//               </div>
//             </div>
//             <p className="mt-4 text-gray-700">
//               Welcome to your profile dashboard. Here you can manage your
//               personal information and activity.
//             </p>
//             <button
//               onClick={() => setShowProfile(false)}
//               className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Settings Modal */}
//       {showSettings && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">Settings</h2>
//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-semibold">Account</h3>
//                 <p className="text-gray-600 text-sm">
//                   Update your username, email, or password.
//                 </p>
//               </div>
//               <div>
//                 <h3 className="font-semibold">Privacy</h3>
//                 <p className="text-gray-600 text-sm">
//                   Manage who can see your profile and activity.
//                 </p>
//               </div>
//               <div>
//                 <h3 className="font-semibold">Notifications</h3>
//                 <p className="text-gray-600 text-sm">
//                   Control your notification preferences.
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowSettings(false)}
//               className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;



import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserEntry from "./UserEntry"; // import your popup component

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserEntry, setShowUserEntry] = useState(false);
  const [userName, setUserName] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowDropdown(false);
    setUserName("");
    localStorage.removeItem("user");
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="bg-white shadow-md font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-600 to-fuchsia-600 flex items-center justify-center text-white font-bold shadow-lg">
              D
            </div>
            <div className="text-lg font-bold tracking-tight text-gray-900">
              DMS<span className="text-blue-600">-X</span>
            </div>
            <div className="ml-4 text-xs text-gray-500 hidden sm:inline">Disaster Management System</div>
          </div>

          {/* Links */}
          <div className="hidden md:flex space-x-8 items-center relative">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide ${
                  isActive ? "text-indigo-600 underline underline-offset-4" : "text-gray-700 hover:text-indigo-600"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/modules"
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide ${
                  isActive ? "text-indigo-600 underline underline-offset-4" : "text-gray-700 hover:text-indigo-600"
                }`
              }
            >
              Modules
            </NavLink>
            <NavLink
              to="/emergency"
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide ${
                  isActive ? "text-red-600 underline underline-offset-4" : "text-gray-700 hover:text-red-600"
                }`
              }
            >
              Emergency
            </NavLink>
            <NavLink
              to="/school"
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide ${
                  isActive ? "text-indigo-600 underline underline-offset-4" : "text-gray-700 hover:text-indigo-600"
                }`
              }
            >
              School Panel
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide ${
                  isActive ? "text-indigo-600 underline underline-offset-4" : "text-gray-700 hover:text-indigo-600"
                }`
              }
            >
              About
            </NavLink>

            {/* Profile Section */}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
                  aria-haspopup="true"
                  aria-expanded={showDropdown}
                >
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-sky-500 text-white font-bold shadow-sm">
                    {getInitials(userName)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-800">{userName || "User"}</div>
                    <div className="text-xs text-gray-500">Member</div>
                  </div>
                </button>

                {/* Small dropdown menu (kept) */}
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-md border z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowProfile(true);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowSettings(true);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Settings
                    </button>
                    <div className="border-t" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowUserEntry(true)}
                className="px-4 py-2 bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white rounded-md hover:scale-105 transform transition shadow"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User Entry Modal */}
      {showUserEntry && (
        <UserEntry
          onClose={() => setShowUserEntry(false)}
          setUser={(user) => {
            setUserName(user.name);
            setIsLoggedIn(true);
            setShowUserEntry(false);
            // persist to localStorage for convenience (this doesn't change modal logic)
            try {
              localStorage.setItem("user", JSON.stringify(user));
            } catch {}
          }}
        />
      )}

      {/* Profile Dashboard Modal (bigger and richer) */}
      {showProfile && (
        <div className="fixed inset-0 flex items-start justify-center pt-20 bg-black/40 z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 overflow-auto">
            <div className="flex items-start justify-between gap-6">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-sky-500 text-white flex items-center justify-center text-2xl font-bold">
                  {getInitials(userName)}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{userName || "User"}</h2>
                  <p className="text-sm text-gray-500">Member since 2025 • Volunteer</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowProfile(false)} className="px-4 py-2 rounded-md border">Close</button>
                <button
                  onClick={() => {
                    // quick action - edit profile (demo)
                    const newName = prompt("Update display name:", userName);
                    if (newName !== null) setUserName(newName);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Edit
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left - summary */}
              <div className="col-span-1 bg-indigo-50 p-4 rounded-xl">
                <h4 className="font-semibold mb-3">Quick Summary</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li><strong>Reports submitted:</strong> 3</li>
                  <li><strong>Modules completed:</strong> 2</li>
                  <li><strong>Last login:</strong> {new Date().toLocaleString()}</li>
                </ul>
              </div>

              {/* Middle - activity */}
              <div className="col-span-1 md:col-span-1 bg-white p-4 rounded-xl shadow-sm">
                <h4 className="font-semibold mb-3">Recent Activity</h4>
                <div className="text-sm text-gray-700 space-y-3">
                  <div className="flex justify-between">
                    <div>Submitted a Flood report</div>
                    <div className="text-xs text-gray-400">2d ago</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Completed Module: Basic First Aid</div>
                    <div className="text-xs text-gray-400">6d ago</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Edited profile</div>
                    <div className="text-xs text-gray-400">1mo ago</div>
                  </div>
                </div>
              </div>

              {/* Right - quick actions */}
              <div className="col-span-1 bg-white p-4 rounded-xl shadow-sm">
                <h4 className="font-semibold mb-3">Quick Actions</h4>
                <div className="flex flex-col gap-2">
                  <button onClick={() => navigate("/modules")} className="px-3 py-2 bg-indigo-600 text-white rounded">Go to Modules</button>
                  <button onClick={() => navigate("/emergency")} className="px-3 py-2 bg-rose-600 text-white rounded">Open Emergency Hub</button>
                  <button onClick={handleLogout} className="px-3 py-2 border rounded text-red-600">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Dashboard Modal (larger, with tabs-like layout) */}
      {showSettings && (
        <div className="fixed inset-0 flex items-start justify-center pt-16 bg-black/40 z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Settings</h2>
              <div className="flex gap-2">
                <button onClick={() => setShowSettings(false)} className="px-4 py-2 rounded-md border">Close</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <aside className="space-y-3">
                <button className="w-full text-left px-4 py-2 rounded-md bg-indigo-50 font-medium">Account</button>
                <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50">Privacy</button>
                <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50">Notifications</button>
                <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50">Appearance</button>
              </aside>

              <main className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm">
                <section className="mb-4">
                  <h3 className="font-semibold mb-2">Account</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600">Display name</label>
                      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full p-2 border rounded mt-1" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <input type="email" defaultValue="user@email.com" className="w-full p-2 border rounded mt-1" />
                    </div>
                  </div>
                </section>

                <section className="mb-4">
                  <h3 className="font-semibold mb-2">Privacy</h3>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Share reports anonymously</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">Show profile publicly</span>
                    </label>
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Email notifications</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">SMS alerts for emergencies</span>
                    </label>
                  </div>
                </section>
              </main>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
