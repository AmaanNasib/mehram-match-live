'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Home, 
  Users, 
  Phone, 
  Package, 
  BookOpen, 
  FileText,
  MapPin,
  Star,
  Calendar,
  Globe,
  ClipboardList
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      // Disable scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Enable scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const packageDropdownItems = [
    { name: 'Essential', href: '/essential', icon: Package },
    { name: 'Comfort', href: '/comfort', icon: Star },
    { name: 'Signature', href: '/signature', icon: Globe },
    // { name: 'Group Packages', href: '/packages/group', icon: Users },
    // { name: 'Ramadan Special', href: '/packages/ramadan', icon: Calendar },
  ];

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About Us', href: '/about', icon: Users },
    { name: 'Contact Us', href: '/contact', icon: Phone },
    { 
      name: 'Packages', 
      href: '/packages', 
      icon: Package,
      hasDropdown: true,
      dropdownItems: packageDropdownItems
    },
    // { name: 'Booking Process', href: '/booking-process', icon: ClipboardList },
    { name: 'Umrah Guide', href: '/guide', icon: MapPin },
    { name: 'Blogs', href: '/blog', icon: FileText },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled 
              ? 'bg-transparent backdrop-blur-[2px] shadow-2xl border-b border-[#EAB200]/20' 
              : 'bg-transparent backdrop-blur-[2px] shadow-lg'
          }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 flex-shrink-0"
          >
            <div className="relative">
            <Link href="/" onClick={() => setIsOpen(false)}>
                  <Image
                    src="/logo/Umrah Calling.svg"
                    alt="Umrah Calling Logo"
                    width={64}
                    height={64}
                    className="w-24 h-24 lg:w-28 lg:h-28"
                  />
                </Link>
                
            </div>
           
          </motion.div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-8">
            <div className="flex items-center space-x-1 p-2 backdrop-blur-sm ">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.hasDropdown ? (
                    <div
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="relative"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-black hover:text-[#EAB200] hover:bg-white hover:shadow-md transition-all duration-300 font-medium text-sm whitespace-nowrap"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      </motion.button>

                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-emerald-50 overflow-hidden"
                          >
                            <div className="p-2">
                              {item.dropdownItems?.map((dropItem, index) => (
                                <motion.div
                                  key={dropItem.name}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <Link
                                    href={dropItem.href}
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#EAB200] rounded-xl transition-colors duration-200 group"
                                  >
                                    <dropItem.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="font-medium">{dropItem.name}</span>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-black hover:text-[#EAB200] hover:bg-white hover:shadow-md transition-all duration-300 font-medium text-sm whitespace-nowrap"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </motion.div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          {/* <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(234, 179, 8, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <span className="relative z-10">Book Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </div> */}

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className="lg:hidden p-3 rounded-xl text-white bg-black/80 hover:bg-black hover:text-white transition-colors duration-200 shadow-md"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-[#EAB200]/20 shadow-2xl"
          >
            <div className="px-6 py-6 space-y-3 max-h-screen overflow-y-auto">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  {item.hasDropdown ? (
                    <div className="bg-gray-50/50 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => handleDropdownToggle(item.name)}
                        className="w-full flex items-center justify-between px-5 py-4 text-gray-700 hover:bg-[#EAB200]/10 hover:text-[#EAB200] transition-all duration-300 font-medium"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-[#EAB200] rounded-xl flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-black" />
                          </div>
                          <span className="text-base">{item.name}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                          activeDropdown === item.name ? 'rotate-180 text-[#EAB200]' : 'text-gray-400'
                        }`} />
                      </button>
                      
                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/80 border-t border-emerald-100"
                          >
                            <div className="px-4 py-3 space-y-2">
                              {item.dropdownItems?.map((dropItem, dropIndex) => (
                                <motion.div
                                  key={dropItem.name}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: dropIndex * 0.05 }}
                                >
                                  <Link
                                    href={dropItem.href}
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all duration-200 group"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <dropItem.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="font-medium">{dropItem.name}</span>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center space-x-4 px-5 py-4 text-gray-700 hover:bg-[#EAB200]/10 hover:text-[#EAB200] rounded-2xl transition-all duration-300 font-medium bg-gray-50/50 group"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="w-10 h-10 bg-[#EAB200] rounded-xl flex items-center justify-center group-hover:bg-[#EAB200]/80 transition-colors duration-300">
                        <item.icon className="w-5 h-5 text-black" />
                      </div>
                      <span className="text-base">{item.name}</span>
                    </Link>
                  )}
                </motion.div>
              ))}
              
              {/* Mobile CTA Button */}
              {/* <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="pt-6 border-t border-yellow-200"
              >
                <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-6 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg">
                  Book Now
                </button>
              </motion.div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
