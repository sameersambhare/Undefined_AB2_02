'use client';

import React from 'react';
import Link from 'next/link';
import { FiMail, FiLock } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SignIn: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm">
                    <div>
                        <Link href="/" className="flex justify-center text-2xl font-bold text-orange-600 dark:text-orange-500 mb-2">
                            <span className="bg-orange-600 dark:bg-gradient-to-br dark:from-orange-600 dark:to-orange-700 text-white w-8 h-8 rounded flex items-center justify-center mr-2 text-lg">UI</span>
                            Designer
                        </Link>
                        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-zinc-50">
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-zinc-400">
                            Or{' '}
                            <Link href="/signup" className="font-medium text-orange-600 dark:text-orange-500 hover:text-orange-500 dark:hover:text-orange-400">
                                create a new account
                            </Link>
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST">
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-zinc-700 placeholder-gray-500 dark:placeholder-zinc-500 text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 focus:border-orange-500 dark:focus:border-orange-600 focus:z-10 sm:text-sm"
                                        placeholder="Email address"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-zinc-700 placeholder-gray-500 dark:placeholder-zinc-500 text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-600 focus:border-orange-500 dark:focus:border-orange-600 focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-orange-600 dark:text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-600 border-gray-300 dark:border-zinc-700 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-zinc-300">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-orange-600 dark:text-orange-500 hover:text-orange-500 dark:hover:text-orange-400">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 dark:bg-gradient-to-r dark:from-orange-700 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-orange-600 transition-all"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SignIn;