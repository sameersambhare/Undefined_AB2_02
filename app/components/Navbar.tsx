'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { FiMenu, FiX } from 'react-icons/fi';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ href, children, className = '' }: NavLinkProps) => (
  <Link 
    href={href} 
    className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-4 py-2 rounded-lg transition-colors ${className}`}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed w-full bg-white/90 dark:bg-gradient-to-r dark:from-zinc-950 dark:to-zinc-900 backdrop-blur-sm border-b border-gray-100 dark:border-zinc-800 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-orange-600 dark:text-orange-500 flex items-center">
              <span className="bg-orange-600 dark:bg-gradient-to-br dark:from-orange-600 dark:to-orange-700 text-white w-8 h-8 rounded flex items-center justify-center mr-2 text-lg">UI</span>
              Designer
            </Link>
            
            {/* Main navigation links - hidden on mobile */}
            <div className="hidden md:flex space-x-2">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/createui">Create UI</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>
          </div>
          
          {/* Auth links */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <NavLink href="/signin" className="text-gray-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-500">
              Sign In
            </NavLink>
            <Link 
              href="/signup" 
              className="bg-orange-600 text-white hover:bg-orange-700 dark:bg-gradient-to-r dark:from-orange-700 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-500 px-4 py-2 rounded-lg transition-all"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <ThemeToggle />
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gradient-to-b dark:from-zinc-900 dark:to-zinc-950 border-b border-gray-100 dark:border-zinc-800">
          <div className="px-4 py-3 space-y-1">
            <NavLink href="/" className="text-gray-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-500">Home</NavLink>
            <NavLink href="/createui" className="text-gray-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-500">Create UI</NavLink>
            <NavLink href="/about" className="text-gray-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-500">About</NavLink>
            <NavLink href="/contact" className="text-gray-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-500">Contact</NavLink>
            <div className="border-t border-gray-100 dark:border-zinc-800 my-2 pt-2">
              <NavLink href="/signin" className="text-gray-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-500">Sign In</NavLink>
              <Link 
                href="/signup" 
                className="block mt-2 bg-orange-600 text-white hover:bg-orange-700 dark:bg-gradient-to-r dark:from-orange-700 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-500 px-4 py-2 rounded-lg transition-all text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 