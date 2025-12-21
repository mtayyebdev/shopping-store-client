import { Link } from "react-router-dom";
import {
  LuFacebook,
  LuTwitter,
  LuInstagram,
  LuLinkedin,
  LuMail,
  LuPhone,
  LuMapPin,
  LuSend,
} from "react-icons/lu";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Handle newsletter subscription here
      console.log("Subscribing email:", email);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">
              Shopping store
            </h3>
            <p className="text-sm mb-4 leading-relaxed">
              Your one-stop destination for quality products at the best prices.
              Shop with confidence and enjoy seamless shopping experience.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 transform hover:scale-110"
              >
                <LuFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors duration-300 transform hover:scale-110"
              >
                <LuTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors duration-300 transform hover:scale-110"
              >
                <LuInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300 transform hover:scale-110"
              >
                <LuLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-400 transition-colors duration-300 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-blue-400 transition-colors duration-300 text-sm"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="hover:text-blue-400 transition-colors duration-300 text-sm"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/deals"
                  className="hover:text-blue-400 transition-colors duration-300 text-sm"
                >
                  Special Deals
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-blue-400 transition-colors duration-300 text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-400 transition-colors duration-300 text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-blue-400 transition-colors duration-300 text-sm"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-blue-400 transition-colors duration-300 text-sm"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-blue-400 transition-colors duration-300 text-sm"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="hover:text-blue-400 transition-colors duration-300 text-sm"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">
              Newsletter
            </h4>
            <p className="text-sm mb-4">
              Subscribe to get special offers, free giveaways, and updates.
            </p>

            {subscribed ? (
              <div className="bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium animate-fadeIn">
                ✓ Successfully subscribed!
              </div>
            ) : (
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubscribe(e)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 pr-12 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 outline-none text-sm"
                />
                <button
                  onClick={handleSubscribe}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors duration-300"
                >
                  <LuSend className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start space-x-3 text-sm">
                <LuMapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>123 Shopping Street, City, Country</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <LuPhone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>+1 234 567 8900</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <LuMail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>support@shoppingstore.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-gray-400 font-medium">We Accept</p>
            <img src="/payments.svg" alt="payment methods" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} Shopping store. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center space-x-6">
              <Link
                to="/privacy"
                className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </footer>
  );
}
