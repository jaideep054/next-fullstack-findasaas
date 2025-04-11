// app/components/Navbar.tsx or app/Navbar.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Replace these with actual implementations
const user = {
  email: 'demo@example.com',
  profile_picture: '',
};
const loading = false;
const alreadyListed = false;

const replaceS3WithCloudFront = (url: string): string => {
  return url.replace("https://fysassets.s3.ap-south-1.amazonaws.com", "https://d123.cloudfront.net");
};

const BadgeModal = ({ user }: { user: typeof user }) => null;
const loginWithGoogle = () => console.log("Login clicked");
const logoutUser = () => console.log("Logout clicked");

const Navbar: React.FC = () => {
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDesktopDropdown(false);
    setShowMobileDropdown(false);
    router.push('/profile');
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logoutUser();
    setShowDesktopDropdown(false);
    setShowMobileDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDesktopDropdown(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMobileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cloudFrontLogo = replaceS3WithCloudFront(
    'https://fysassets.s3.ap-south-1.amazonaws.com/fys-high-resolution-logo-transparent.png'
  );

  if (loading) {
    return (
      <nav className="px-6 py-3 flex justify-between items-center max-w-7xl mx-auto relative z-50">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold mr-8">FYS</Link>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="px-6 py-3 flex justify-between items-center max-w-7xl mx-auto relative z-50">
      <BadgeModal user={user} />
      <div className="flex items-center">
        {/* <Image
          title="Logo"
          loading="lazy"
          src={cloudFrontLogo}
          alt="FYS Logo"
          className="h-8 mr-2"
          height={32}
          width={32}
        /> */}
        <Link href="/" className="text-2xl font-bold mr-8">FYS</Link>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center space-x-4">
        <Link href="/pricing" className="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 border border-indigo-600 rounded-lg transition-colors">
          Pricing
        </Link>
        <Link href={alreadyListed ? "/profile" : "/pricing"} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center font-medium">
          {alreadyListed ? "Your Listing" : "List your SaaS"}
        </Link>
        {user ? (
          <div className="relative mr-4" ref={desktopDropdownRef}>
            <button
              onClick={() => setShowDesktopDropdown(!showDesktopDropdown)}
              className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg"
            >
              {user.profile_picture ? (
                <Image
                  src={user.profile_picture}
                  title={user.email}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                  height={40}
                  width={40}
                />
              ) : (
                <span>{user.email?.[0]?.toUpperCase() || "U"}</span>
              )}
            </button>
            <AnimatePresence>
              {showDesktopDropdown && (
                <motion.div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="font-medium text-gray-800">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleProfileClick}>
                      Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button className="mr-4 text-gray-800 font-medium hover:text-gray-600" onClick={loginWithGoogle}>
            Sign In
          </button>
        )}
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center space-x-4">
        {user ? (
          <div className="relative mr-4" ref={mobileDropdownRef}>
            <button
              onClick={() => setShowMobileDropdown(!showMobileDropdown)}
              className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg"
            >
              {user.profile_picture ? (
                <Image
                  src={user.profile_picture}
                  title={user.email}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                  height={40}
                  width={40}
                />
              ) : (
                <span>{user.email?.[0]?.toUpperCase() || "U"}</span>
              )}
            </button>
            <AnimatePresence>
              {showMobileDropdown && (
                <motion.div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="font-medium text-gray-800">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleProfileClick}>
                      Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button className="mr-4 text-gray-800 font-medium hover:text-gray-600" onClick={loginWithGoogle}>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
