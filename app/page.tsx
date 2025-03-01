import Link from 'next/link';
import React from 'react';
import { FiLayout, FiCode, FiZap } from 'react-icons/fi';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Navbar />

            {/* Hero Section */}
            <main>
                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <h1 className="text-5xl font-bold text-gray-900 mb-6">
                                Design Beautiful UI Components
                                <span className="text-indigo-600"> with AI</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                Create stunning user interfaces effortlessly using our AI-powered design tools. 
                                Transform your ideas into reality in minutes.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Link href="/signup" 
                                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                                    Get Started Free
                                </Link>
                                <Link href="#features" 
                                    className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <section id="features" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Why Choose Our Platform?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                    <FiLayout className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Intuitive Design
                                </h3>
                                <p className="text-gray-600">
                                    Create beautiful interfaces with our drag-and-drop editor and AI-powered suggestions.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                    <FiCode className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Clean Code Output
                                </h3>
                                <p className="text-gray-600">
                                    Generate production-ready code that follows best practices and modern standards.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                    <FiZap className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    AI-Powered
                                </h3>
                                <p className="text-gray-600">
                                    Let AI help you make design decisions and suggest improvements to your interfaces.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            
            <Footer />
        </div>
    );
};

export default Home;