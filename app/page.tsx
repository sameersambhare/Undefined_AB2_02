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
        <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="inline-block px-3 py-1 text-sm font-medium text-orange-600 dark:text-orange-500 bg-orange-100 dark:bg-zinc-800 rounded-full mb-4 sm:mb-6">
                Now with AI Integration
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-zinc-50 mb-4 sm:mb-6 leading-tight">
                Design Beautiful UI Components <span className="text-orange-600 dark:text-orange-500">with AI</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-zinc-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Create stunning user interfaces effortlessly using our AI-powered design tools. 
                Transform your ideas into reality in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center sm:space-x-4">
                <Link href="/signup" 
                  className="bg-orange-600 text-white hover:bg-orange-700 dark:bg-gradient-to-r dark:from-orange-700 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-500 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all w-full sm:w-auto text-center">
                  Get Started Free
                </Link>
                <Link href="#features" 
                  className="bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors w-full sm:w-auto text-center">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 sm:py-20 bg-white dark:bg-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-3 sm:mb-4">
                Built for designers and developers
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto">
                Our platform provides everything you need to create beautiful interfaces quickly and efficiently.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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

        <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-3 sm:mb-4">
                Why choose SnapUI?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto">
                Our platform is designed to make UI development faster, easier, and more accessible.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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

        <section className="py-16 sm:py-20 bg-white dark:bg-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-3 sm:mb-4">
                What our users say
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto">
                Join thousands of satisfied designers and developers who use SnapUI every day.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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

        <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-3 sm:mb-4">
                Frequently asked questions
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto">
                Have questions? We've got answers.
              </p>
            </div>
            <div className="max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-zinc-800">
              <div className="py-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">
                  What is SnapUI?
                </h3>
                <p className="text-gray-600 dark:text-zinc-300">
                  SnapUI is an AI-powered UI design tool that helps designers and developers build stunning user interfaces with drag-and-drop simplicity.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">
                  How much does SnapUI cost?
                </h3>
                <p className="text-gray-600 dark:text-zinc-300">
                  SnapUI is free to use.
                </p>
              </div>
              <div className="py-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">
                  How long does it take to create a design?
                </h3>
                <p className="text-gray-600 dark:text-zinc-300">
                  The time it takes to create a design depends on the complexity of the design. For simple designs, it may take a few minutes, while more complex designs may take longer.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-white dark:bg-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-orange-600 dark:bg-gradient-to-r dark:from-orange-700 dark:to-orange-600 rounded-2xl overflow-hidden">
              <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Ready to start designing?
                  </h2>
                  <p className="mt-2 text-lg text-orange-100 max-w-3xl">
                    Sign up for free and start creating beautiful interfaces with our AI-powered design tools.
                  </p>
                </div>
                <div className="mt-8 lg:mt-0 lg:ml-8 flex flex-col sm:flex-row gap-4">
                  <Link href="/signup" 
                    className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg text-base font-semibold transition-colors w-full sm:w-auto text-center">
                    Get Started Free
                  </Link>
                  <Link href="/contact" 
                    className="bg-orange-700 text-white hover:bg-orange-800 px-6 py-3 rounded-lg text-base font-semibold transition-colors w-full sm:w-auto text-center">
                    Contact Sales
                  </Link>
                </div>
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