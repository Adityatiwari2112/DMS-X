// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-10">
      {/* Call-to-Action Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-center py-12 text-white">
        <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
        <p className="mb-6 text-lg max-w-2xl mx-auto">
          Join thousands of users who are already better prepared for disasters. Start your journey today.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/modules"
            className="bg-white text-indigo-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 shadow"
          >
            Explore Learning Modules
          </Link>
          <Link
            to="/school"
            className="border border-white px-6 py-2 rounded-md font-medium hover:bg-white/10"
          >
            School Admin Panel
          </Link>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
        {/* Left Side */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            <span className="text-indigo-600">DMS</span>-X
          </h3>
          <p className="mb-4 text-sm">
            Empowering communities with disaster preparedness training and emergency response tools. Learn, prepare, and stay safe.
          </p>
          <div className="flex gap-4 text-indigo-600">
            <a href="#"><FaFacebookF size={20} /></a>
            <a href="#"><FaTwitter size={20} /></a>
            <a href="#"><FaInstagram size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/modules" className="hover:text-indigo-600">Learning Modules</Link></li>
            <li><Link to="/emergency" className="hover:text-indigo-600">Emergency Hub</Link></li>
            <li><Link to="/school" className="hover:text-indigo-600">School Panel</Link></li>
            <li><Link to="/about" className="hover:text-indigo-600">About Us</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/help" className="hover:text-indigo-600">Help Center</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-600">Contact Us</Link></li>
            <li><Link to="/privacy" className="hover:text-indigo-600">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-indigo-600">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-gray-500 text-sm border-t py-4">
        © 2025 DisasterGuard. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
