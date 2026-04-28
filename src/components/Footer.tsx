import Container from "./ui/Container";
import fonts from "@/config/fonts";
import Link from "next/link";
import { FaInstagram, FaYoutube, FaXTwitter } from "react-icons/fa6";
import { SiLinktree } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-[#27190B] text-primaryBeige py-16">
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Contact Section */}
        <div>
          <h3 className={`text-xl font-semibold mb-4 ${fonts.playfair}`}>
            Contact Us
          </h3>
          {/* <p className={`text-base ${fonts.mulish}`}>support@aakaura.in</p> */}
          <p className={`text-base ${fonts.mulish}`}>+91 8619029656</p>
          <p className={`text-base ${fonts.mulish}`}>Jaipur, Rajasthan</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className={`text-xl font-semibold mb-4 ${fonts.playfair}`}>
            Quick Links
          </h3>
          <ul className={`space-y-3 ${fonts.merriweather}`}>
            <li>
              <Link href="/" className="hover:text-primaryRed transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primaryRed transition">
                Know Us :)
              </Link>
            </li>
            <li>
              <Link href="/blogs" className="hover:text-primaryRed transition">
                Aakaura Speaks
              </Link>
            </li>
            <li>
              <Link
                href="/policies/terms"
                className="hover:text-primaryRed transition"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/policies/privacy"
                className="hover:text-primaryRed transition"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/policies/refunds"
                className="hover:text-primaryRed transition"
              >
                Refunds & Cancellations
              </Link>
            </li>
            <li>
              <Link
                href="/policies/shipping"
                className="hover:text-primaryRed transition"
              >
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link
                href="/policies/disclaimers"
                className="hover:text-primaryRed transition"
              >
                Disclaimers
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className={`text-xl font-semibold mb-4 ${fonts.playfair}`}>
            Follow Us
          </h3>
          <div className="flex items-center space-x-6">
            <a
              href="https://www.instagram.com/aakaura.in?igsh=ZjY3aTc0dzJ2czN6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primaryBeige hover:text-primaryRed transition"
              title="Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.youtube.com/@TheAakauraStudio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primaryBeige hover:text-primaryRed transition"
              title="YouTube"
            >
              <FaYoutube size={24} />
            </a>
            <a
              href="https://x.com/_Aakaura_?s=20"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primaryBeige hover:text-primaryRed transition"
              title="X (Twitter)"
            >
              <FaXTwitter size={24} />
            </a>
            <a
              href="https://linktr.ee/aakaura0508"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primaryBeige hover:text-primaryRed transition"
              title="LinkTree"
            >
              <SiLinktree size={24} />
            </a>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="mt-16 border-t border-primaryBeige/30 pt-6 text-center text-sm flex flex-col items-center gap-2">
        <p className={`${fonts.specialElite}`}>
          &copy; {new Date().getFullYear()} Aakaura&trade;. All rights reserved.
        </p>
        <p
          className={`text-xs text-primaryBeige/70 ${fonts.mulish} max-w-2xl mx-auto px-4`}
        >
          The &quot;Aakaura&quot; name and logo are trademarks of Aakaura.
          Unauthorized copying, reproduction, or use is strictly prohibited.
        </p>
      </div>
    </footer>
  );
}
