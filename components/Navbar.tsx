
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signOut } from 'next-auth/react'
import { BadgeModal } from "./BadgeModal";


const replaceS3WithCloudFront = (url: string) => {
  if (url) {
    return url.replace("https://fysassets.s3.ap-south-1.amazonaws.com", "https://d2srfewv7t3ba1.cloudfront.net");
  }
};


const Navbar: React.FC = () => {


  const { user, logoutUser, alreadyListed, loading } = useAuth();


  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
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
    signOut()
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
          <Link href="/">
            <div className="text-2xl font-bold mr-8">FYS</div>
          </Link>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </nav>
    );
  }



  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const hamburgerLineVariants = {
    closed: {
      rotate: 0,
      y: 0,
    },
    open: (custom:number) => {
      switch (custom) {
        case 1:
          return { rotate: 45, y: 8 };
        case 2:
          return { opacity: 0 };
        case 3:
          return { rotate: -45, y: -8 };
        default:
          return {};
      }
    },
  };


  return (
    <nav className="px-6 py-3 flex justify-between items-center max-w-7xl mx-auto relative z-50">
      <BadgeModal user={user} />
      <div className="flex items-center">
        <Image
          title="Logo"
          loading="lazy"
          src={cloudFrontLogo || ""}
          alt="FYS Logo"
          className="h-8 mr-2"
          height={32}
          width={32}
        />
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
                    <button className="w-full  text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button className="mr-4 cursor-pointer text-gray-800 font-medium hover:text-gray-600" onClick={() => signIn('google')}>
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
          <button className="mr-4 text-gray-800 font-medium hover:text-gray-600" onClick={() => signIn('google')}>
            Sign In
          </button>
        )}

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="hamburger-icon flex flex-col justify-center items-center w-8 h-8 focus:outline-none" aria-label="Toggle menu">
          <motion.span custom={1} variants={hamburgerLineVariants} initial="closed" animate={mobileMenuOpen ? "open" : "closed"} className="w-6 h-0.5 bg-gray-800 mb-1.5 origin-center" />
          <motion.span custom={2} variants={hamburgerLineVariants} initial="closed" animate={mobileMenuOpen ? "open" : "closed"} className="w-6 h-0.5 bg-gray-800 mb-1.5 origin-center" />
          <motion.span custom={3} variants={hamburgerLineVariants} initial="closed" animate={mobileMenuOpen ? "open" : "closed"} className="w-6 h-0.5 bg-gray-800 origin-center" />
        </button>
      </div>


      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div ref={mobileMenuRef} variants={menuVariants} initial="closed" animate="open" exit="closed" className="absolute top-16 right-0 left-0 bg-white shadow-lg z-40 px-6 py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link href="/pricing" className="text-indigo-600 hover:text-indigo-800 font-medium py-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </Link>

              <Link href={alreadyListed ? "/profile" : "/pricing"} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center font-medium justify-center" onClick={() => setMobileMenuOpen(false)}>
                {alreadyListed ? "Your Listing" : "List your SaaS"}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
