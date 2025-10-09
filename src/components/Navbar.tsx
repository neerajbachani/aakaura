"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import fonts from "@/config/fonts";
import Image from "next/image";
import { CartIcon } from "@/components/cart/CartIcon";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import { ProfileMenu } from "@/components/user/ProfileMenu";
import { useAuthStatus } from "@/hooks/useAuth";

interface NavItemProps {
  title: string;
  submenuItems: { name: string; href: string }[];
}

const NavItem = ({ title, submenuItems }: NavItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {title.toLowerCase() === "aakaura" ? (
        <button className="px-4 py-2 text-2xl text-primaryBrown hover:text-primaryRed transition-colors inline-flex items-center gap-1">
          <span
            className={`${fonts.dekko} flex items-center decoration-primaryRed decoration-wavy underline underline-offset-[6px]`}
          >
            आक<span className={`${fonts.specialElite}`}>aura</span>
          </span>
          <IoIosArrowDown
            className={`transition-transform duration-300 ${
              isHovered ? "rotate-180" : ""
            }`}
          />
        </button>
      ) : (
        <button
          className={`px-4 py-2 text-[22px] text-primaryBrown hover:text-primaryRed transition-colors inline-flex items-center gap-1 ${fonts.specialElite} tracking-wide`}
        >
          {title}
          <IoIosArrowDown
            className={`transition-transform duration-300 ${
              isHovered ? "rotate-180" : ""
            }`}
          />
        </button>
      )}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute  mt-2 py-2 bg-primaryBeige/95 backdrop-blur-sm rounded-md shadow-lg text-nowrap  border border-primaryBrown/10"
          >
            {submenuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-2.5 text-xl text-primaryBrown hover:text-primaryRed hover:bg-primaryBeige/80 transition-colors ${fonts.mulish}`}
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileNavItem = ({ title, submenuItems }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 text-lg text-primaryBrown flex items-center justify-between ${fonts.specialElite}`}
      >
        {title.toLowerCase() === "aakaura" ? (
          <span
            className={`${fonts.dekko} flex items-center text-xl decoration-primaryRed decoration-wavy underline`}
          >
            आक<span className={`${fonts.specialElite}`}>aura</span>
          </span>
        ) : (
          title
        )}
        <IoIosArrowDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-primaryBrown/5"
          >
            {submenuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-6 py-3 text-base text-primaryBrown hover:text-primaryRed transition-colors ${fonts.specialElite}`}
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, isLoading } = useAuthStatus();

  const navItems = [
    {
      title: "Hi!",
      submenuItems: [{ name: "Know us :)", href: "/about" }],
    },
    {
      title: "Read On",
      submenuItems: [{ name: "Our Thoughts", href: "/blogs" }],
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 bg-primaryBeige backdrop-blur-sm shadow ${fonts.playfair}`}
    >
      <div className="flex items-center justify-center h-20">
        {/* Desktop Navigation */}
        <div className="hidden md:flex w-full items-center justify-center">
          <div className="w-full max-w-4xl flex justify-between items-center px-4">
            <NavItem
              title={navItems[0].title}
              submenuItems={navItems[0].submenuItems}
            />
            <Link href={"/"} className="flex justify-center items-center">
              <Image
                quality={100}
                priority
                src={"/logo.png"}
                alt="Aakaura"
                width={200}
                height={100}
              />
            </Link>
            <div className="flex items-center gap-4">
              <NavItem
                title={navItems[1].title}
                submenuItems={navItems[1].submenuItems}
              />
              <CartIcon onClick={() => setIsCartOpen(true)} />
              
              {/* Auth Section */}
              {isLoading ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              ) : isAuthenticated ? (
                <ProfileMenu />
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="text-primaryBrown hover:text-primaryRed transition-colors px-3 py-2 text-sm font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setIsAuthModalOpen(true);
                    }}
                    className="bg-primaryBrown text-white hover:bg-primaryBrown/90 transition-colors px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Mobile Navigation Button */}
        <div className="md:hidden w-full flex items-center justify-between px-4">
          <Link href={"/"} className="w-36 h-14 relative">
            <Image
              src="/logo.png"
              alt="Aakaura"
              fill
              className="object-contain"
            />
          </Link>
          <div className="flex items-center gap-2">
            <CartIcon onClick={() => setIsCartOpen(true)} />
            
            {/* Mobile Auth */}
            {!isLoading && !isAuthenticated && (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="text-primaryBrown hover:text-primaryRed transition-colors p-2"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}
            
            {!isLoading && isAuthenticated && <ProfileMenu />}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primaryBrown p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="py-2 divide-y divide-primaryBrown/10">
              {navItems.map((item) => (
                <MobileNavItem key={item.title} {...item} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </nav>
  );
}
