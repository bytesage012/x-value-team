import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white/20 backdrop-blur-lg border-t border-white/10 text-gray-700 mt-8">
      <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            {/* Brand */}
            <h2 className="text-lg font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              xValue
            </h2>
            {/* Links */}
            <div className="flex items-center gap-4 text-sm">
              <Link to="/privacy" className="text-gray-600 hover:text-indigo-500 transition">
                Privacy
              </Link>
              <span className="text-gray-400">·</span>
              <Link to="/terms" className="text-gray-600 hover:text-indigo-500 transition">
                Terms
              </Link>
              <span className="text-gray-400">·</span>
              <Link to="/contact" className="text-gray-600 hover:text-indigo-500 transition">
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Social Icons */}
            <div className="flex gap-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-indigo-500 transition"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-indigo-500 transition"
              >
                <Github size={16} />
              </a>
              <a
                href="mailto:support@xvalue.com"
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-indigo-500 transition"
              >
                <Mail size={16} />
              </a>
            </div>
            {/* Copyright */}
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} xValue
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
