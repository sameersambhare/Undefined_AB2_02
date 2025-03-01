import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiUsers } from 'react-icons/fi';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <main>
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                About <span className="text-indigo-600">UI Designer</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                We're on a mission to make UI design accessible to everyone through the power of AI and intuitive design tools.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We are third year Computer Engineering students at PCCOE, Pune. This project was developed for the Alphabyte hackathon organised by the Anantya2k25 event.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sameer Sambhare</h3>
                <p className="text-gray-600">
                  Computer Engineering Student
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Pranit Sarode</h3>
                <p className="text-gray-600">
                  Computer Engineering Student
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Krushna Salbande</h3>
                <p className="text-gray-600">
                  Computer Engineering Student
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sanket Shende</h3>
                <p className="text-gray-600">
                  Computer Engineering Student
                </p>
              </div>
            </div>
            
            <div className="mt-16 bg-indigo-50 p-8 rounded-xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-indigo-900 mb-4">Alphabyte Hackathon</h3>
                <p className="text-lg text-indigo-700 mb-6">
                  This project was developed as part of the Alphabyte hackathon organised by the Anantya2k25 event.
                </p>
                <div className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium">
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