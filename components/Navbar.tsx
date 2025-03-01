'use client';

import Link from 'next/link';
import React from 'react';
import { FiHome, FiEdit, FiInfo, FiMail, FiLogIn, FiUserPlus } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
    return (
        <nav className="fixed w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border-b border-gray-100 dark:border-zinc-800 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-2xl font-bold text-orange-500 dark:text-orange-400">
                            UI Designer
                        </Link>
                        <div className="hidden sm:flex space-x-4">
                            <Link 
                                href="/" 
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-4 py-2 rounded-lg transition-colors"
                            >
                                <FiHome className="w-4 h-4" />
                                <span>Home</span>
                            </Link>
                            <Link 
                                href="/createui" 
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-4 py-2 rounded-lg transition-colors"
                            >
                                <FiEdit className="w-4 h-4" />
                                <span>Create UI</span>
                            </Link>
                            <Link 
                                href="/about" 
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-4 py-2 rounded-lg transition-colors"
                            >
                                <FiInfo className="w-4 h-4" />
                                <span>About Us</span>
                            </Link>
                            <Link 
                                href="/contact" 
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-4 py-2 rounded-lg transition-colors"
                            >
                                <FiMail className="w-4 h-4" />
                                <span>Contact Us</span>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <Link href="/signin" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-4 py-2 rounded-lg transition-colors">
                            <FiLogIn className="w-4 h-4" />
                            <span>Sign In</span>
                        </Link>
                        <Link href="/signup" className="flex items-center space-x-2 bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors">
                            <FiUserPlus className="w-4 h-4" />
                            <span>Sign Up</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 