'use client';

import React from 'react';
import Link from 'next/link';
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram, FiHome, FiInfo, FiMail, FiEdit, FiBook, FiHelpCircle, FiFileText, FiShield, FiCoffee } from 'react-icons/fi';

const Footer: React.FC = () => {
  // Use state to store the year value
  const [year, setYear] = React.useState<number>(2023); // Default fallback year
  
  // Update the year on the client side after component mounts
  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-xl font-bold text-orange-500 dark:text-orange-400">
              SnapUI
            </Link>
            <p className="mt-4 text-gray-600 dark:text-zinc-400 text-sm">
              Create beautiful user interfaces with AI-powered design tools.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                <FiTwitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                <FiGithub className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                <FiLinkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                <FiInstagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="flex items-center space-x-2 text-gray-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiHome className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center space-x-2 text-gray-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiInfo className="w-4 h-4" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center space-x-2 text-gray-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiMail className="w-4 h-4" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link href="/createui" className="flex items-center space-x-2 text-gray-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiEdit className="w-4 h-4" />
                  <span>Create UI</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiFileText className="w-4 h-4" />
                  <span>Documentation</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiBook className="w-4 h-4" />
                  <span>Tutorials</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiCoffee className="w-4 h-4" />
                  <span>Blog</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiHelpCircle className="w-4 h-4" />
                  <span>Support</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiShield className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiFileText className="w-4 h-4" />
                  <span>Terms of Service</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  <FiFileText className="w-4 h-4" />
                  <span>Cookie Policy</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800">
          <p className="text-center text-gray-500 dark:text-zinc-500 text-sm">
            &copy; {year} SnapUI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 