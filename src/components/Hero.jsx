import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat h-[500px] flex items-center justify-center"
      style={{
        backgroundImage: "url('/heropic/heroimgx.jpg')", // put your image in public/
      }}
    >
      {/* Overlay for dark effect */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-3">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Knowledge is Safety, Action is Survival
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Learn disaster management through interactive training and access
          emergency support when you need it most.
        </p>

        {/* Buttons with routing */}
        <div className="flex justify-center space-x-6">
          <Link
            to="/modules"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md"
          >
            Start Learning Now
          </Link>
          <Link
            to="/emergency"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md"
          >
            Emergency Support
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
