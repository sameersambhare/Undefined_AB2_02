'use client';

import Link from 'next/link';
import React from 'react';
import { FiLayout, FiCode, FiZap, FiBox, FiFeather, FiShield } from 'react-icons/fi';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-orange-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-zinc-300">
      {description}
    </p>
  </div>
);

const StatCard = ({ number, label }: { number: string, label: string }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-orange-500 dark:text-orange-500">{number}</div>
    <div className="text-sm text-gray-600 dark:text-zinc-400 mt-1">{label}</div>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="inline-block px-3 py-1 text-sm font-medium text-orange-600 dark:text-orange-500 bg-orange-100 dark:bg-zinc-800 rounded-full mb-6">
                Now with AI Integration
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-zinc-50 mb-6 leading-tight">
                Design Beautiful UI Components <span className="text-orange-600 dark:text-orange-500">with AI</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-zinc-300 mb-8 max-w-2xl mx-auto">
                Create stunning user interfaces effortlessly using our AI-powered design tools. 
                Transform your ideas into reality in minutes.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/signup" 
                  className="bg-orange-600 text-white hover:bg-orange-700 dark:bg-gradient-to-r dark:from-orange-700 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-500 px-8 py-4 rounded-lg text-lg font-semibold transition-all">
                  Get Started Free
                </Link>
                <Link href="#features" 
                  className="bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-4">
                Built for designers and developers
              </h2>
              <p className="text-xl text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto">
                Our platform provides everything you need to create beautiful interfaces quickly and efficiently.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<FiLayout className="w-6 h-6 text-orange-600 dark:text-orange-500" />}
                title="Intuitive Design"
                description="Create beautiful interfaces with our drag-and-drop editor and AI-powered suggestions."
              />
              <FeatureCard 
                icon={<FiCode className="w-6 h-6 text-orange-600 dark:text-orange-500" />}
                title="Clean Code Output"
                description="Generate production-ready code that follows best practices and modern standards."
              />
              <FeatureCard 
                icon={<FiZap className="w-6 h-6 text-orange-600 dark:text-orange-500" />}
                title="AI-Powered"
                description="Let AI help you make design decisions and suggest improvements to your interfaces."
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-4">
                Why choose UI Designer?
              </h2>
              <p className="text-xl text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto">
                Our platform is designed to make UI development faster, easier, and more accessible.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<FiBox className="w-6 h-6 text-orange-600 dark:text-orange-500" />}
                title="Component-Based"
                description="Build your UI with reusable components that can be customized to fit your needs."
              />
              <FeatureCard 
                icon={<FiFeather className="w-6 h-6 text-orange-600 dark:text-orange-500" />}
                title="Lightweight"
                description="Our platform is optimized for performance, ensuring your UI is fast and responsive."
              />
              <FeatureCard 
                icon={<FiShield className="w-6 h-6 text-orange-600 dark:text-orange-500" />}
                title="Accessible"
                description="All components follow WAI-ARIA standards, ensuring your UI is accessible to everyone."
              />
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-700 dark:to-orange-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to transform your UI design process?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join thousands of designers and developers who are creating beautiful interfaces with UI Designer.
            </p>
            <Link href="/signup" 
              className="bg-white text-orange-600 hover:bg-gray-100 dark:bg-zinc-800 dark:text-orange-500 dark:hover:bg-zinc-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block">
              Get Started Free
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;