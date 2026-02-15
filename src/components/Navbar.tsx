"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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
  onNavigate?: () => void;
}

const SlideMenuNavItem = ({
  title,
  submenuItems,
  onNavigate,
}: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 text-xl md:text-2xl text-[#27190b] flex items-center justify-between`}
      >
        {title.toLowerCase() === "aakaura" ? (
          <span
            className={`${fonts.dekko} flex items-center text-2xl md:text-3xl decoration-primaryRed decoration-wavy underline`}
          >
            आक<span className={`${fonts.specialElite}`}>aura</span>
          </span>
        ) : (
          title
        )}
        <IoIosArrowDown
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
                onClick={onNavigate}
                className={`block px-8 py-3 md:py-4 text-lg md:text-xl text-[#27190b] hover:text-primaryRed transition-colors `}
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

export default function Navbar({
  className = "bg-[#27190b]",
  categories = [],
}: {
  className?: string;
  categories?: string[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { isAuthenticated, isLoading } = useAuthStatus();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [isMenuOpen]);

  const navItems = [
    {
      title: "Hi!",
      submenuItems: [{ name: "About us :)", href: "/about" }],
    },
    {
      title: "Read On",
      submenuItems: [{ name: "Our Thoughts", href: "/blogs" }],
    },
    // {
    //   title: "Journey",
    //   submenuItems: [
    //     { name: "Crown", href: "/journey/crown" },
    //     { name: "Third Eye", href: "/journey/third-eye" },
    //     { name: "Throat", href: "/journey/throat" },
    //     { name: "Heart", href: "/journey/heart" },
    //     { name: "Solar Plexus", href: "/journey/solar-plexus" },
    //     { name: "Sacral", href: "/journey/sacral" },
    //     { name: "Root", href: "/journey/root" },
    //   ],
    // },
    // },
    {
      title: "Product Categories",
      submenuItems:
        categories.length > 0
          ? categories.map((cat) => ({
              name: cat,
              // Convert "Wall Hanging" -> "wall-hanging"
              href: `/shop/category/${cat.toLowerCase().replace(/\s+/g, "-")}`,
            }))
          : [
              { name: "Mufflers", href: "/shop/category/muffler" },
              { name: "Wall Hangings", href: "/shop/category/wall-hanging" },
              { name: "Bonsai", href: "/shop/category/bonsai" },
              { name: "Jewelry", href: "/shop/category/jewelry" },
            ],
    },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Navbar */}
      <nav className={`${className} `}>
        <div className="flex items-center justify-between h-20 px-4 md:px-8">
          <Link href="/" className="w-36 md:w-44 h-14 relative">
            <Image
              src="/images/logo.png"
              alt="Aakaura"
              fill
              className="object-contain"
              quality={100}
              priority
            />
          </Link>
        </div>
      </nav>

      {/* Fixed Menu Button */}
      <motion.button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed -top-2 -right-3 w-12 h-12 md:w-14 md:h-14 rounded-full bg-primaryBeige text-white flex items-center justify-center z-[60] shadow-[0_0_110px] transition-all duration-500 cursor-pointer overflow-hidden hover:scale-110"
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 0 0px rgba(255, 255, 255, 0.6)",
              "0 0 0 25px rgba(255, 255, 255, 0)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.button>

      {/* Menu Overlay & Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop with fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeMenu}
            />

            {/* Circular Expansion Background */}
            <motion.div
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: 3.5,
                opacity: 1,
              }}
              exit={{
                scale: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.5,
                ease: [0.32, 0.72, 0, 1],
              }}
              className="absolute -top-2 -right-3 w-12 h-12 md:w-14 md:h-14 rounded-full bg-primaryBeige"
              style={{
                transformOrigin: "center center",
              }}
            />

            {/* Sliding Menu Panel with staggered content */}
            <motion.div
              initial={{
                x: "100%",
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: "100%",
                opacity: 0,
              }}
              transition={{
                type: "spring",
                bounce: 0,
                duration: 0.5,
                delay: 0.1,
              }}
              className="absolute top-0 right-0 h-full w-[85%] max-w-md md:max-w-lg bg-primaryBeige shadow-2xl overflow-y-scroll"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              onWheel={(e) => e.stopPropagation()}
            >
              {/* Hide scrollbar */}
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {/* Menu Header with staggered animation */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="sticky top-0 bg-primaryBeige z-20 flex items-center justify-between p-6 md:p-8 border-b border-primaryBrown/10"
              >
                <h2 className={`text-2xl md:text-3xl text-[#27190b]`}>Menu</h2>
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => setIsCartOpen(true)}
                    className="p-2 rounded-md hover:bg-primaryBrown/5 transition-colors cursor-pointer"
                  >
                    <CartIcon />
                  </div>
                  {!isLoading && isAuthenticated ? (
                    <ProfileMenu />
                  ) : (
                    <button
                      onClick={() => {
                        setAuthMode("login");
                        setIsAuthModalOpen(true);
                        closeMenu();
                      }}
                      className="p-2 rounded-md hover:bg-primaryBrown/5 transition-colors"
                    >
                      <svg
                        className="h-6 w-6 text-[#27190b]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Menu Content with staggered children */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="py-4 md:py-6 divide-y divide-primaryBrown/10"
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: 0.35 + index * 0.05, duration: 0.3 }}
                  >
                    <SlideMenuNavItem {...item} onNavigate={closeMenu} />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="px-6 py-4 space-y-2"
                >
                  <Link
                    href="/journey"
                    onClick={closeMenu}
                    className={`block py-2 text-[#27190b] text-lg hover:text-primaryRed`}
                  >
                    Not sure which journey you're on? Don't worry, we've got you
                    covered
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => {
                      setIsCartOpen(true);
                      closeMenu();
                    }}
                    className={`block py-2  text-[#27190b] text-lg hover:text-primaryRed`}
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className={`block py-2 text-lg text-[#27190b] hover:text-primaryRed`}
                  >
                    Your Aakaura
                  </Link>
                </motion.div>
              </motion.div>

              {/* Auth Buttons with fade-in */}
              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.55, duration: 0.3 }}
                  className="p-6 md:p-8 border-t border-primaryBrown/10 space-y-3"
                >
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      setIsAuthModalOpen(true);
                      closeMenu();
                    }}
                    className="w-full bg-[#27190b] text-white hover:bg-primaryBrown/90 transition-colors px-4 py-3 md:py-4 rounded-md text-base md:text-lg font-medium"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setIsAuthModalOpen(true);
                      closeMenu();
                    }}
                    className="w-full border-2 border-primaryBrown text-[#27190b] hover:bg-primaryBrown/5 transition-colors px-4 py-3 md:py-4 rounded-md text-base md:text-lg font-medium"
                  >
                    Sign In
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
}
