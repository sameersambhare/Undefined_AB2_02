'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { FiHome, FiEdit, FiInfo, FiMail, FiLogIn, FiUserPlus, FiUser, FiLogOut, FiGrid, FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/app/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        setMobileMenuOpen(false);
        window.location.href = '/';
    };
    
    // Get initials for avatar
    const getInitials = (name: string) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getLinkClassName = (href: string) => {
        const isActive = pathname === href;
        return `flex items-center space-x-2 ${
            isActive 
                ? 'text-orange-500 dark:text-orange-400' 
                : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400'
        } px-3 lg:px-4 py-2 rounded-lg transition-colors`;
    };
    
    return (
        <nav className="fixed w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border-b border-gray-100 dark:border-zinc-800 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="relative w-48 h-12">
                            <Image
                                src="/logo_dark.png"
                                alt="SnapUI Logo"
                                fill
                                className="object-contain hidden dark:block"
                            />
                            <Image
                                src="/logo_white.png"
                                alt="SnapUI Logo"
                                fill
                                className="object-contain dark:hidden"
                            />
                        </Link>
                        
                        <div className="hidden md:flex items-center space-x-4">
                            <Link href="/" className={getLinkClassName('/')}>
                                <FiHome className="w-4 h-4" />
                                <span>Home</span>
                            </Link>
                            <Link href="/createui" className={getLinkClassName('/createui')}>
                                <FiEdit className="w-4 h-4" />
                                <span>Create UI</span>
                            </Link>
                            <Link href="/layouts" className={getLinkClassName('/layouts')}>
                                <FiGrid className="w-4 h-4" />
                                <span>My Layouts</span>
                            </Link>
                            <Link href="/about" className={getLinkClassName('/about')}>
                                <FiInfo className="w-4 h-4" />
                                <span>About Us</span>
                            </Link>
                            <Link href="/contact" className={getLinkClassName('/contact')}>
                                <FiMail className="w-4 h-4" />
                                <span>Contact Us</span>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <ThemeToggle />
                        
                        {/* Mobile menu button */}
                        <button 
                            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <FiX className="h-6 w-6" />
                            ) : (
                                <FiMenu className="h-6 w-6" />
                            )}
                        </button>
                        
                        {/* Auth buttons */}
                        <div className="hidden md:flex items-center space-x-2">
                            {!isLoading && !user ? (
                                <>
                                    <Link href="/signin" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-4 py-2 rounded-lg transition-colors">
                                        <FiLogIn className="w-4 h-4" />
                                        <span>Sign In</span>
                                    </Link>
                                    <Link href="/signup" className="flex items-center space-x-2 bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors">
                                        <FiUserPlus className="w-4 h-4" />
                                        <span>Sign Up</span>
                                    </Link>
                                </>
                            ) : !isLoading && user ? (
                                <div className="relative">
                                    <button 
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-2 py-2 rounded-full transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                                            {getInitials(user.name)}
                                        </div>
                                    </button>
                                    
                                    {menuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-md shadow-lg py-1 z-50 border border-gray-100 dark:border-zinc-700">
                                            <Link 
                                                href="/profile" 
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                <FiUser className="mr-2" /> Profile
                                            </Link>
                                            <Link 
                                                href="/layouts" 
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                <FiGrid className="mr-2" /> My Layouts
                                            </Link>
                                            <button 
                                                onClick={handleLogout}
                                                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                                            >
                                                <FiLogOut className="mr-2" /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Mobile menu, show/hide based on menu state */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link href="/" className={getLinkClassName('/')} onClick={() => setMobileMenuOpen(false)}>
                            <FiHome className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <Link href="/createui" className={getLinkClassName('/createui')} onClick={() => setMobileMenuOpen(false)}>
                            <FiEdit className="w-4 h-4" />
                            <span>Create UI</span>
                        </Link>
                        <Link href="/layouts" className={getLinkClassName('/layouts')} onClick={() => setMobileMenuOpen(false)}>
                            <FiGrid className="w-4 h-4" />
                            <span>My Layouts</span>
                        </Link>
                        <Link href="/about" className={getLinkClassName('/about')} onClick={() => setMobileMenuOpen(false)}>
                            <FiInfo className="w-4 h-4" />
                            <span>About Us</span>
                        </Link>
                        <Link href="/contact" className={getLinkClassName('/contact')} onClick={() => setMobileMenuOpen(false)}>
                            <FiMail className="w-4 h-4" />
                            <span>Contact Us</span>
                        </Link>
                        
                        {/* Mobile auth buttons */}
                        {!isLoading && !user ? (
                            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                                <Link 
                                    href="/signin" 
                                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-lg transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <FiLogIn className="w-4 h-4" />
                                    <span>Sign In</span>
                                </Link>
                                <Link 
                                    href="/signup" 
                                    className="flex items-center space-x-2 bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 px-3 py-2 rounded-lg transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <FiUserPlus className="w-4 h-4" />
                                    <span>Sign Up</span>
                                </Link>
                            </div>
                        ) : !isLoading && user ? (
                            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                                <Link 
                                    href="/profile" 
                                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-lg transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <FiUser className="w-4 h-4" />
                                    <span>Profile</span>
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 px-3 py-2 rounded-lg transition-colors text-left"
                                >
                                    <FiLogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 