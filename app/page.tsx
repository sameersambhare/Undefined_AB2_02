'use client';
import Room from './Room';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { FiLayout, FiCode, FiZap, FiBox, FiFeather, FiShield, FiUsers, FiStar, FiTrendingUp, FiCpu, FiGlobe, FiSmartphone } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white dark:bg-zinc-800 p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full">
    <div className="w-12 h-12 bg-orange-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">
      {title}
    </h3>
    <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-300">
      {description}
    </p>
  </div>
);

const StatCard = ({ number, label }: { number: string, label: string }) => (
  <div className="text-center px-2 sm:px-4">
    <div className="text-3xl sm:text-4xl font-bold text-orange-500 dark:text-orange-500">{number}</div>
    <div className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-1">{label}</div>
  </div>
);

const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
  <div className="bg-white dark:bg-zinc-800 p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 h-full">
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-300 italic mb-6">"{quote}"</p>
    <div>
      <p className="font-semibold text-gray-900 dark:text-zinc-100">{author}</p>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">{role}</p>
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
    <Room roomId="home-page">
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
          <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900 pt-24 pb-16 sm:pt-32 sm:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Design Beautiful UIs <br className="hidden sm:block" />
                  <span className="text-orange-500 dark:text-orange-400">Faster Than Ever</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto mb-8">
                  Create stunning user interfaces with our AI-powered design tool. Drag, drop, and customize components to build the perfect UI for your next project.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                  <Link href="/createui" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Start Designing
                  </Link>
                  <Link href="/about" className="bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg border border-gray-200 dark:border-zinc-700 transition-colors">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500 opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
            </div>
          </section>

          <section className="py-16 sm:py-24 bg-gray-50 dark:bg-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Powerful Features</h2>
                <p className="text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto">
                  Everything you need to create beautiful user interfaces quickly and efficiently.
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

          <section className="py-16 sm:py-24 bg-white dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">By the Numbers</h2>
                <p className="text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto">
                  Join thousands of designers and developers who trust our platform.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatCard number="1024" label="Designs Created" />
                <StatCard number="4.8" label="Average Rating" />
                <StatCard number="100+" label="Components Available" />
                <StatCard number="100+" label="Designers Using" />
              </div>
            </div>
          </section>

          <section className="py-16 sm:py-24 bg-gray-50 dark:bg-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Users Say</h2>
                <p className="text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto">
                  Don't just take our word for it. Here's what designers and developers think about SnapUI.
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

          <section className="py-16 sm:py-24 bg-white dark:bg-zinc-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="bg-orange-500 dark:bg-orange-600 rounded-2xl p-8 sm:p-12 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
                <div className="mb-6 sm:mb-0 sm:mr-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Ready to start designing?</h2>
                  <p className="text-orange-100 max-w-xl">
                    Create your first UI design in minutes with our intuitive drag-and-drop editor.
                  </p>
                </div>
                <Link href="/createui" className="inline-block bg-white text-orange-500 hover:bg-orange-50 font-semibold py-3 px-6 rounded-lg transition-colors whitespace-nowrap">
                  Get Started Free
                </Link>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-500 opacity-10 rounded-full blur-3xl"></div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </Room>
  );
};

export default Home;