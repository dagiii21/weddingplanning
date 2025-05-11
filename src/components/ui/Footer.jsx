
import React from "react";
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPaperPlane, 
  FaHeart 
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-300/10 via-purple-400/20 to-purple-300/10 py-12 px-4 md:px-16 lg:px-24 relative overflow-hidden shadow-lg">
      {/* Animated Sparkles Overlay */}

      <div className="absolute bottom-0 right-0 w-full h-12 bg-gradient-to-l from-purple-300/10 via-purple-400/20 to-purple-300/10 animate-pulse"></div>
      
      {/* Enhanced Ethiopian Pattern Background with Animation */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ethiopianPattern" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="rotate(45)">
              <path d="M10,10 L20,20 M30,30 L40,40" strokeWidth="2" stroke="url(#sparkleGradient)" />
              <rect x="20" y="20" width="20" height="20" fill="none" stroke="url(#sparkleGradient)" strokeWidth="2" />
              <path d="M50,10 L55,15 L60,10 L55,5 z" fill="url(#sparkleGradient)" />
              <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8A7B9F" />
                <stop offset="50%" stopColor="#9F7BAF" />
                <stop offset="100%" stopColor="#8A7B9F" />
                <animate attributeName="x1" from="0%" to="100%" dur="3s" repeatCount="indefinite" />
                <animate attributeName="y1" from="0%" to="100%" dur="3s" repeatCount="indefinite" />
              </linearGradient>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ethiopianPattern)" />
        </svg>
      </div>
      
      {/* Decorative Shiny Corner Elements */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-200/40 to-transparent rounded-br-full"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-200/40 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/40 to-transparent rounded-tr-full"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-200/40 to-transparent rounded-tl-full"></div>

      <div className="container mx-auto relative z-10">
        {/* Elegant Ethiopian-inspired Divider with Animation */}


        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">
          {/* Company Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left transform transition-all hover:translate-y-[-5px] duration-300">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src="/staticImage/logo.png"
                alt="Fenet Decor Logo"
                className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-wedding-purple/20"
              />
              <div>
                <h4 className="font-playwright text-xl text-wedding-dark">Fenet Decor</h4>
                <div className="h-0.5 w-20 bg-gradient-to-r from-wedding-purple to-transparent"></div>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm max-w-xs mt-2 leading-relaxed">
              Creating unforgettable Ethiopian wedding experiences that honor tradition with modern elegance. 
              Your dream wedding celebration is our passion.
            </p>

            {/* Enhanced Newsletter Subscription with Animation and Shimmer Effect */}
            <div className="mt-6 w-full max-w-xs">
              
              
              {/* Small sparkle effect under the form */}
              <div className="mt-2 flex justify-center">
                <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-wedding-purple/40 to-transparent animate-pulse"></div>
              </div>
            </div>
            
            {/* Add some CSS to the component to support the animations */}
            <style jsx>{`
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              .skew-x-15 {
                transform: skewX(15deg);
              }
            `}</style>

            {/* Enhanced Social Icons with Animations and Glowing Effects */}
            <div className="flex space-x-6 mt-6">
              <a 
                href="#" 
                className="relative group" 
                aria-label="Facebook"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt"></div>
                <div className="relative bg-purple-500 p-3 rounded-full text-white ring-1 ring-purple-400/20  transform transition-all duration-300 hover:-translate-y-1">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-15 animate-[shimmer_2s_infinite]"></span>
                  <FaFacebook size={18} className="transform transition-transform group-hover:scale-110  " />
                </div>
              </a>
              <a 
                href="#" 
                className="relative group" 
                aria-label="Instagram"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt"></div>
                <div className="relative bg-purple-500 p-3 rounded-full text-white ring-1 ring-purple-400/20  transform transition-all duration-300 hover:-translate-y-1">
                                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-15 animate-[shimmer_2s_infinite]"></span>
                  <FaInstagram size={18} className="transform transition-transform group-hover:scale-110" />
                </div>
              </a>
              <a 
                href="#" 
                className="relative group" 
                aria-label="Twitter"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt"></div>
                <div className="relative bg-purple-500 p-3 rounded-full text-white ring-1 ring-purple-400/20  transform transition-all duration-300 hover:-translate-y-1">
                   <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-15 animate-[shimmer_2s_infinite]"></span>
                  <FaTwitter size={18} className="transform transition-transform group-hover:scale-110" />
                </div>
              </a>
            </div>
            
            {/* Add some CSS to the component to support the animations */}
            <style jsx>{`
              @keyframes tilt {
                0%, 100% { transform: rotate(-2deg); }
                50% { transform: rotate(2deg); }
              }
              .animate-tilt {
                animation: tilt 10s infinite linear;
              }
            `}</style>
          </div>

          {/* Quick Links - Improved layout and styling */}
          <div className="transform transition-all hover:translate-y-[-5px] duration-300">
            <h5 className="font-playwright text-xl mb-5 text-center md:text-left text-wedding-dark after:content-[''] after:block after:w-12 after:h-0.5 after:bg-wedding-purple/70 after:mt-1.5 md:after:mx-0 after:mx-auto">Quick Links</h5>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-600 text-center md:text-left">
              <div>
                <h6 className="text-sm font-semibold mb-2 text-wedding-dark/80">Main</h6>
                <ul className="space-y-2">
                  <li><a href="/" className="text-sm hover:text-wedding-purple transition-colors border-b border-transparent hover:border-wedding-purple/30 pb-0.5 inline-block">Home</a></li>
                  <li><a href="/about-us" className="text-sm hover:text-wedding-purple transition-colors border-b border-transparent hover:border-wedding-purple/30 pb-0.5 inline-block">About Us</a></li>
                  <li><a href="/services" className="text-sm hover:text-wedding-purple transition-colors border-b border-transparent hover:border-wedding-purple/30 pb-0.5 inline-block">Services</a></li>
                  <li><a href="/Testimonal" className="text-sm hover:text-wedding-purple transition-colors border-b border-transparent hover:border-wedding-purple/30 pb-0.5 inline-block">Testimonials</a></li>
                </ul>
              </div>
              <div>
                <h6 className="text-sm font-semibold mb-2 text-wedding-dark/80">Services</h6>
                <ul className="space-y-2">
                  <li><a href="/services/planning" className="text-sm hover:text-wedding-purple transition-colors border-b border-transparent hover:border-wedding-purple/30 pb-0.5 inline-block">Planning</a></li>
                  <li><a href="/services/decor" className="text-sm hover:text-wedding-purple transition-colors border-b border-transparent hover:border-wedding-purple/30 pb-0.5 inline-block">Decoration</a></li>
                  <li><a href="/services/catering" className="text-sm hover:text-wedding-purple transition-colors border-b border-transparent hover:border-wedding-purple/30 pb-0.5 inline-block">Catering</a></li>
                  <li><a href="/contact" className="text-sm hover:text-wedding-purple transition-colors border-b border-transparent hover:border-wedding-purple/30 pb-0.5 inline-block">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info - Ethiopian address and styled map */}
          <div className="transform transition-all hover:translate-y-[-5px] duration-300">
            <h5 className="font-playwright text-xl mb-5 text-center md:text-left text-wedding-dark after:content-[''] after:block after:w-12 after:h-0.5 after:bg-wedding-purple/70 after:mt-1.5 md:after:mx-0 after:mx-auto">Contact Us</h5>
            <ul className="space-y-5 text-gray-600 mb-5">
              <li className="flex items-center justify-center md:justify-start space-x-3 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-wedding-purple rounded-full blur opacity-30 group-hover:opacity-70 transition duration-300 group-hover:scale-110"></div>
                  <div className="relative bg-gradient-to-br from-wedding-purple/15 to-wedding-purple/25 p-3 rounded-full shadow-md group-hover:shadow-wedding-purple/30 transform group-hover:scale-105 transition-all duration-300">
                    <FaPhone className="text-wedding-purple group-hover:text-purple-700 transition-colors" size={16} /> 
                  </div>
                </div>
                <div className="relative overflow-hidden group-hover:-translate-y-0.5 transform transition-all duration-300">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-wedding-purple transition-colors">+251 91 234 5678</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-wedding-purple/50 group-hover:w-full transition-all duration-300 ease-out"></span>
                </div>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-3 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-wedding-purple rounded-full blur opacity-30 group-hover:opacity-70 transition duration-300 group-hover:scale-110"></div>
                  <div className="relative bg-gradient-to-br from-wedding-purple/15 to-wedding-purple/25 p-3 rounded-full shadow-md group-hover:shadow-wedding-purple/30 transform group-hover:scale-105 transition-all duration-300">
                    <FaEnvelope className="text-wedding-purple group-hover:text-purple-700 transition-colors" size={16} /> 
                  </div>
                </div>
                <div className="relative overflow-hidden group-hover:-translate-y-0.5 transform transition-all duration-300">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-wedding-purple transition-colors">contact@fenetdecor.com</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-wedding-purple/50 group-hover:w-full transition-all duration-300 ease-out"></span>
                </div>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-3 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-wedding-purple rounded-full blur opacity-30 group-hover:opacity-70 transition duration-300 group-hover:scale-110"></div>
                  <div className="relative bg-gradient-to-br from-wedding-purple/15 to-wedding-purple/25 p-3 rounded-full shadow-md group-hover:shadow-wedding-purple/30 transform group-hover:scale-105 transition-all duration-300">
                    <FaMapMarkerAlt className="text-wedding-purple group-hover:text-purple-700 transition-colors" size={16} /> 
                  </div>
                </div>
                <div className="relative overflow-hidden group-hover:-translate-y-0.5 transform transition-all duration-300">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-wedding-purple transition-colors">Addis Ababa,Ethiopia</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-wedding-purple/50 group-hover:w-full transition-all duration-300 ease-out"></span>
                </div>
              </li>
            </ul>
            
            {/* Enhanced Mini Map Preview with Decorative Elements */}
            <div className="mt-4 relative group">
              {/* Shimmering Border Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-wedding-purple/30 via-purple-400/50 to-wedding-purple/30 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300 animate-gradient-x"></div>
              
              <div className="relative w-full h-40 rounded-lg shadow-lg overflow-hidden border-2 border-wedding-purple/30 group-hover:border-wedding-purple/60 transition-all duration-300">
                {/* Decorative Corner Elements */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-wedding-purple/60 z-10"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-wedding-purple/60 z-10"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-wedding-purple/60 z-10"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-wedding-purple/60 z-10"></div>
                
                {/* Location Pin Animation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 z-10 pointer-events-none">
                  <div className="absolute w-6 h-6 bg-wedding-purple/80 rounded-full transform scale-0 animate-ping-slow"></div>
                </div>
                
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126443.11938489489!2d38.72092145!3d8.9806034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Addis Ababa Map"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
            
            {/* Add animation styles */}
            <style jsx>{`
              @keyframes ping-slow {
                0%, 100% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1); opacity: 0.7; }
              }
              .animate-ping-slow {
                animation: ping-slow 3s infinite;
              }
              @keyframes gradient-x {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }
              .animate-gradient-x {
                background-size: 200% 200%;
                animation: gradient-x 3s ease infinite;
              }
            `}</style>
          </div>
        </div>

        {/* Divider with Ethiopian pattern element */}
        <div className="my-8 flex items-center justify-center">
          <div className="w-1/3 h-px bg-gradient-to-r from-transparent via-wedding-purple/30 to-transparent"></div>
          <div className="px-4">

          </div>
          <div className="w-1/3 h-px bg-gradient-to-r from-transparent via-wedding-purple/30 to-transparent"></div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
