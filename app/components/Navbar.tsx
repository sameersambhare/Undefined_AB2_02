import Link from 'next/link';
import React from 'react';
import { FiHome } from 'react-icons/fi';

const Navbar: React.FC = () => {
    return (
        <nav className="fixed w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-2xl font-bold text-indigo-600">
                            UI Designer
                        </Link>
                        <div className="hidden sm:flex space-x-4">
                            <Link 
                                href="/" 
                                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-lg transition-colors"
                            >
                                <span>Home</span>
                            </Link>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <Link href="/signin" className="text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-lg transition-colors">
                            Sign In
                        </Link>
                        <Link href="/signup" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 