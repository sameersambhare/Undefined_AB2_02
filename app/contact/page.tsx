import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiMail, FiMapPin } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Custom Textarea component
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm ring-offset-white dark:ring-offset-zinc-950 placeholder:text-gray-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:focus-visible:ring-orange-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-100 ${className || ''}`}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <Navbar />

      {/* Hero Section */}
      <main>
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-gray-900 dark:text-zinc-50 mb-6">
                Contact <span className="text-orange-600 dark:text-orange-500">Us</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-zinc-300 mb-8 max-w-3xl mx-auto">
                Have questions or feedback? We'd love to hear from you. Get in touch with our team.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <section className="py-16 bg-white dark:bg-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-50 dark:bg-zinc-800 p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mb-6">Get in Touch</h2>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      className="w-full dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="Enter subject"
                      className="w-full dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Enter your message"
                      className="w-full min-h-[150px]"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-gradient-to-r dark:from-orange-700 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-500">
                    Send Message
                  </Button>
                </form>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mb-6">Contact Information</h2>
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center mr-4">
                      <FiMail className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-1">Email Us</h3>
                      <p className="text-gray-600 dark:text-zinc-300">
                        <a href="mailto:sameersambhare@gmail.com" className="text-orange-600 dark:text-orange-500 hover:underline">
                          sameersambhare@gmail.com
                        </a>
                      </p>
                      <p className="text-gray-600 dark:text-zinc-400 mt-1">
                        We'll respond to your inquiry within 24 hours.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center mr-4">
                      <FiMapPin className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-1">Visit Us</h3>
                      <p className="text-gray-600 dark:text-zinc-300">
                        Pimpri Chinchwad College of Engineering (PCCOE)<br />
                        Sector 26, Pradhikaran, Nigdi<br />
                        Pune, Maharashtra 411044
                      </p>
                    </div>
                  </div>
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

export default ContactPage; 