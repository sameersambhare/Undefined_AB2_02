'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';

interface SocialLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
}

interface FooterLinkProps {
  href: string;
  text: string;
}

const SocialLink = ({ href, icon, label }: SocialLinkProps) => (
  <a href={href} className="text-gray-400 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-500 transition-colors">
    <span className="w-5 h-5">{icon}</span>
    <span className="sr-only">{label}</span>
  </a>
);

const FooterLink = ({ href, text }: FooterLinkProps) => (
  <li>
    <Link href={href} className="text-gray-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors">
      {text}
    </Link>
  </li>
);

const Footer = () => {
  const [currentYear, setCurrentYear] = useState('');
  
  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="bg-gray-50 dark:bg-gradient-to-t dark:from-zinc-950 dark:to-zinc-900 border-t border-gray-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-xl font-bold text-orange-600 dark:text-orange-500 flex items-center">
              <span className="bg-orange-600 dark:bg-gradient-to-br dark:from-orange-600 dark:to-orange-700 text-white w-8 h-8 rounded flex items-center justify-center mr-2 text-lg">UI</span>
              Designer
            </Link>
            <p className="mt-4 text-gray-600 dark:text-zinc-400 text-sm">
              Create beautiful user interfaces with AI-powered design tools.
            </p>
            <div className="mt-6 flex space-x-4">
              <SocialLink href="#" icon={<FiTwitter />} label="Twitter" />
              <SocialLink href="#" icon={<FiGithub />} label="GitHub" />
              <SocialLink href="#" icon={<FiLinkedin />} label="LinkedIn" />
              <SocialLink href="#" icon={<FiInstagram />} label="Instagram" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <FooterLink href="/" text="Home" />
              <FooterLink href="/about" text="About Us" />
              <FooterLink href="/contact" text="Contact Us" />
              <FooterLink href="/createui" text="Create UI" />
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              <FooterLink href="#" text="Documentation" />
              <FooterLink href="#" text="Tutorials" />
              <FooterLink href="#" text="Blog" />
              <FooterLink href="#" text="Support" />
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <FooterLink href="#" text="Privacy Policy" />
              <FooterLink href="#" text="Terms of Service" />
              <FooterLink href="#" text="Cookie Policy" />
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800">
          <p className="text-center text-gray-500 dark:text-zinc-500 text-sm">
            &copy; {currentYear || '2023'} UI Designer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;