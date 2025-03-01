import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiUsers } from 'react-icons/fi';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <Navbar />

      <main className="page-content">
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-gray-900 dark:text-zinc-50 mb-6">
                About <span className="text-orange-600 dark:text-orange-500">UI Designer</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-zinc-300 mb-8 max-w-3xl mx-auto">
                We're on a mission to make UI design accessible to everyone through the power of AI and intuitive design tools.
              </p>
            </div>
          </div>
        </div>

        <section className="py-16 bg-white dark:bg-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-4">Our Team</h2>
              <p className="text-lg text-gray-600 dark:text-zinc-300 max-w-3xl mx-auto">
                We are third year Computer Engineering students at PCCOE, Pune. This project was developed for the Alphabyte hackathon organised by the Anantya2k25 event.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-orange-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-orange-600 dark:text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">Sameer Sambhare</h3>
                <p className="text-gray-600 dark:text-zinc-300">
                  Computer Engineering Student
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-orange-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-orange-600 dark:text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">Pranit Sarode</h3>
                <p className="text-gray-600 dark:text-zinc-300">
                  Computer Engineering Student
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-orange-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-orange-600 dark:text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">Krushna Salbande</h3>
                <p className="text-gray-600 dark:text-zinc-300">
                  Computer Engineering Student
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-orange-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-orange-600 dark:text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">Sanket Shende</h3>
                <p className="text-gray-600 dark:text-zinc-300">
                  Computer Engineering Student
                </p>
              </div>
            </div>

            <div className="mt-16 bg-orange-50 dark:bg-gradient-to-r dark:from-zinc-800 dark:to-zinc-900 p-8 rounded-xl shadow-sm">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-orange-900 dark:text-zinc-50 mb-4">Alphabyte Hackathon</h3>
                <p className="text-lg text-orange-700 dark:text-zinc-300 mb-6">
                  This project was developed as part of the Alphabyte hackathon organised by the Anantya2k25 event.
                </p>
                <div className="inline-block bg-orange-600 dark:bg-gradient-to-r dark:from-orange-700 dark:to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 dark:hover:from-orange-600 dark:hover:to-orange-500 transition-all">
                  PCCOE, Pune
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

export default AboutPage;