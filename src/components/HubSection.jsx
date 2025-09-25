// import { Link } from "react-router-dom";
// import {
//   AcademicCapIcon,
//   BoltIcon,
//   PlayCircleIcon,
//   LifebuoyIcon,
//   BuildingLibraryIcon,
// } from "@heroicons/react/24/solid"; // Import icons

// const HubSection = () => {
//   return (
//     <section className="max-w-6xl mx-auto px-6 py-12 text-center">
//       {/* Title */}
//       <h2 className="text-2xl md:text-3xl font-bold mb-2">
//         Your Disaster Management Hub
//       </h2>
//       <p className="text-gray-600 mb-10 text-sm md:text-base">
//         Choose your path: Learn essential disaster management skills or get
//         immediate emergency assistance.
//       </p>

//       {/* Cards Grid */}
//       <div className="grid md:grid-cols-2 gap-8">
//         {/* E-Learning Hub */}
//         <div className="bg-white shadow-lg hover:shadow-2xl rounded-xl p-6 text-center transition duration-300">
//           {/* Image placeholder */}
//           <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
//             <img
//               src="/hubsectionpic/hubsectionLearning.jpg"
//               alt="E-Learning Hub"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
//             <AcademicCapIcon className="w-6 h-6 text-blue-600" />
//             E-Learning Hub
//           </h3>
//           <p className="text-gray-600 text-sm mb-4">
//             Interactive disaster management training with simulations, quizzes,
//             and certifications. Learn at your own pace.
//           </p>
//           <ul className="text-gray-700 text-sm mb-6 space-y-1 text-left max-w-xs mx-auto">
//             <li>✔ 5 comprehensive disaster modules</li>
//             <li>✔ Scenario-based simulations</li>
//             <li>✔ Gamified progress tracking</li>
//           </ul>
//           <Link
//             to="/modules"
//             className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
//           >
//             Start Learning
//           </Link>
//         </div>

//         {/* Emergency Hub */}
//         <div className="bg-white shadow-lg hover:shadow-2xl rounded-xl p-6 text-center transition duration-300">
//           {/* Image placeholder */}
//           <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
//             <img
//               src="/hubsectionpic/hubsectionEMRG.jpg"
//               alt="Emergency Hub"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
//             <BoltIcon className="w-6 h-6 text-red-600" />
//             Emergency Hub
//           </h3>
//           <p className="text-gray-600 text-sm mb-4">
//             Immediate access to emergency services, real-time alerts, and nearby
//             relief centers. Help is just one click away.
//           </p>
//           <ul className="text-gray-700 text-sm mb-6 space-y-1 text-left max-w-xs mx-auto">
//             <li>✔ One-click SOS emergency button</li>
//             <li>✔ Quick access to emergency services</li>
//             <li>✔ Real-time disaster alerts</li>
//           </ul>
//           <Link
//             to="/emergency"
//             className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
//           >
//             Emergency Support
//           </Link>
//         </div>
//       </div>

//       {/* Why Choose Us */}
//       <div className="mt-20">
//         <h3 className="text-xl md:text-2xl font-semibold mb-6 text-blue-600">
//           Why Choose Us?
//         </h3>
//         <div className="grid md:grid-cols-3 gap-6">
//           {/* Interactive Learning */}
//           <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
//             <PlayCircleIcon className="w-10 h-10 text-blue-600 mx-auto mb-3" />
//             <h4 className="font-medium text-lg mb-2">Interactive Learning</h4>
//             <p className="text-gray-600 text-sm">
//               Engaging disaster management training with real-life scenarios and
//               gamified progress.
//             </p>
//           </div>

//           {/* 24/7 Emergency Support */}
//           <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
//             <LifebuoyIcon className="w-10 h-10 text-red-600 mx-auto mb-3" />
//             <h4 className="font-medium text-lg mb-2">24/7 Emergency Support</h4>
//             <p className="text-gray-600 text-sm">
//               Instant access to emergency services anytime, anywhere, with just
//               one click.
//             </p>
//           </div>

//           {/* School Integration */}
//           <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
//             <BuildingLibraryIcon className="w-10 h-10 text-green-600 mx-auto mb-3" />
//             <h4 className="font-medium text-lg mb-2">School Integration</h4>
//             <p className="text-gray-600 text-sm">
//               Seamless integration with schools to ensure students are trained
//               and prepared for any disaster.
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HubSection;



import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  BoltIcon,
  PlayCircleIcon,
  LifebuoyIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/solid"; // Import icons

const HubSection = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12 text-center">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900">
        Your Disaster Management Hub
      </h2>
      <p className="text-gray-600 mb-10 text-sm md:text-base max-w-2xl mx-auto">
        Choose your path: learn essential disaster management skills or get immediate emergency assistance — beautiful UI, bite-sized content, and clear calls to action.
      </p>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* E-Learning Hub */}
        <div className="rounded-xl p-6 text-center transition-transform transform hover:-translate-y-2 shadow-xl bg-gradient-to-br from-sky-50 to-indigo-50 border">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-indigo-200 to-sky-100 flex items-center justify-center">
            <img
              src="/hubsectionpic/hubsectionLearning.jpg"
              alt="E-Learning Hub"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2 text-indigo-800">
            <AcademicCapIcon className="w-6 h-6 text-indigo-600" />
            E-Learning Hub
          </h3>
          <p className="text-indigo-700 text-sm mb-4 max-w-xl mx-auto">
            Interactive disaster management training with simulations, quizzes, and certifications. Learn at your own pace with clear progress tracking.
          </p>
          <ul className="text-indigo-800 text-sm mb-6 space-y-1 text-left max-w-xs mx-auto">
            <li>✔ 5 comprehensive disaster modules</li>
            <li>✔ Scenario-based simulations</li>
            <li>✔ Gamified progress & certificates</li>
          </ul>
          <Link
            to="/modules"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium shadow-md"
          >
            Start Learning
          </Link>
        </div>

        {/* Emergency Hub */}
        <div className="rounded-xl p-6 text-center transition-transform transform hover:-translate-y-2 shadow-xl bg-gradient-to-br from-rose-50 to-red-50 border">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-red-200 to-rose-100 flex items-center justify-center">
            <img
              src="/hubsectionpic/hubsectionEMRG.jpg"
              alt="Emergency Hub"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2 text-red-700">
            <BoltIcon className="w-6 h-6 text-red-600" />
            Emergency Hub
          </h3>
          <p className="text-red-700 text-sm mb-4 max-w-xl mx-auto">
            Immediate access to emergency services, real-time alerts, and nearby relief centers. Help is just one click away — clear, fast and reliable.
          </p>
          <ul className="text-red-800 text-sm mb-6 space-y-1 text-left max-w-xs mx-auto">
            <li>✔ One-click SOS emergency button</li>
            <li>✔ Quick access to emergency services</li>
            <li>✔ Real-time disaster alerts</li>
          </ul>
          <Link
            to="/emergency"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-medium shadow-md"
          >
            Emergency Support
          </Link>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mt-20">
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
          Why Choose Us?
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Interactive Learning */}
          <div className="p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 bg-gradient-to-br from-white to-sky-50">
            <PlayCircleIcon className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
            <h4 className="font-medium text-lg mb-2">Interactive Learning</h4>
            <p className="text-gray-700 text-sm">
              Engaging disaster management training with real-life scenarios and gamified progress.
            </p>
          </div>

          {/* 24/7 Emergency Support */}
          <div className="p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 bg-gradient-to-br from-white to-rose-50">
            <LifebuoyIcon className="w-10 h-10 text-red-600 mx-auto mb-3" />
            <h4 className="font-medium text-lg mb-2">24/7 Emergency Support</h4>
            <p className="text-gray-700 text-sm">
              Instant access to emergency services anytime, anywhere — immediate help with one click.
            </p>
          </div>

          {/* School Integration */}
          <div className="p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 bg-gradient-to-br from-white to-green-50">
            <BuildingLibraryIcon className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-medium text-lg mb-2">School Integration</h4>
            <p className="text-gray-700 text-sm">
              Seamless integration with schools to ensure students are trained and prepared for any disaster.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HubSection;
