'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { FiLayout, FiCode, FiZap, FiBox, FiFeather, FiShield, FiUsers, FiStar, FiTrendingUp, FiCpu, FiGlobe, FiSmartphone } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';

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

const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
  <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-600 dark:text-zinc-300 italic mb-6">"{quote}"</p>
    <div>
      <p className="font-semibold text-gray-900 dark:text-zinc-100">{author}</p>
      <p className="text-sm text-gray-500 dark:text-zinc-400">{role}</p>
    </div>
  </div>
);

const Home = () => {
  // Add structured data for SEO
  useEffect(() => {
    // This will only run on the client side
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'SnapUI',
      'applicationCategory': 'DesignApplication',
      'operatingSystem': 'Web',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'description': 'AI-powered UI design tool that helps designers and developers build stunning user interfaces with drag-and-drop simplicity',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'ratingCount': '1024'
      },
      'screenshot': 'https://snapuiux.vercel.app/screenshots/dashboard.jpg',
      'featureList': 'AI-powered design, Drag-and-drop interface, Component library, Code export',
      'downloadUrl': 'https://snapuiux.vercel.app/signup',
      'author': {
        '@type': 'Organization',
        'name': 'SnapUI Team',
        'url': 'https://snapuiux.vercel.app'
      }
    });
    document.head.appendChild(script);

    return () => {
      // Clean up
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />

      {/* Add structured data for organization */}
      <Script id="organization-schema" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "SnapUI",
            "url": "https://snapuiux.vercel.app",
            "logo": "https://snapuiux.vercel.app/logo.png",
            "sameAs": [
              "https://twitter.com/snapui",
              "https://github.com/snapui",
              "https://linkedin.com/company/snapui"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-555-555-5555",
              "contactType": "customer service",
              "availableLanguage": "English"
            }
          }
        `}
      </Script>

      {/* Add structured data for website */}
      <Script id="website-schema" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SnapUI",
            "url": "https://snapuiux.vercel.app",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://snapuiux.vercel.app/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        `}
      </Script>

      <main className="page-content">
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

        <section className="py-20 bg-gray-50 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-4">
                Why choose SnapUI?
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

        <section className="py-20 bg-white dark:bg-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-4">
                Powerful AI Features
              </h2>
              <p className="text-xl text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto">
                Leverage the power of artificial intelligence to enhance your design workflow.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<FiCpu className="w-6 h-6 text-orange-600 dark:text-orange-500" />}
                title="Smart Suggestions"
                description="Get intelligent design suggestions based on your content and brand guidelines."
              />
              <FeatureCard 
                icon={<FiTrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-500" />}
                title="Design Analysis"
                description="Receive feedback on your designs with accessibility and usability insights."
              />
              <FeatureCard 
                icon={<FiUsers className="w-6 h-6 text-orange-600 dark:text-orange-500" />}
                title="User-Centric Design"
                description="AI helps optimize your interfaces for the best possible user experience."
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-4">
                Responsive Across All Devices
              </h2>
              <p className="text-xl text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto">
                Create interfaces that look great on any screen size, from desktop to mobile.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<FiGlobe className="w-6 h-6 text-orange-600 dark:text-orange-500" />}
                title="Desktop Optimized"
                description="Create powerful interfaces for desktop applications with advanced components."
              />
              <FeatureCard 
                icon={<FiSmartphone className="w-6 h-6 text-orange-600 dark:text-orange-500" />}
                title="Mobile Friendly"
                description="Design interfaces that work perfectly on mobile devices with touch-friendly controls."
              />
              <FeatureCard 
                icon={<FiLayout className="w-6 h-6 text-orange-600 dark:text-orange-500" />}
                title="Adaptive Layouts"
                description="Use flexible grid systems that automatically adapt to different screen sizes."
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto">
                Don't just take our word for it - hear from designers and developers who use SnapUI.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard 
                quote="SnapUI has completely transformed how I approach UI design. The AI suggestions are incredibly helpful and save me hours of work."
                author="Omkar Shinde"
                role="CS Student at PCCOE"
              />
              <TestimonialCard 
                quote="As a developer, I appreciate how clean the code output is. It's well-structured and follows best practices, making it easy to integrate."
                author="Sujit Shaha"
                role="CS Student at PCCOE"
              />
              <TestimonialCard 
                quote="The component library is extensive and the customization options are exactly what I needed. SnapUI has become an essential tool in my workflow."
                author="Pratik Sukale"
                role="CS Student at PCCOE"
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-700 dark:to-orange-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to transform your UI design process?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join thousands of designers and developers who are creating beautiful interfaces with SnapUI.
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