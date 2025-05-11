import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/Button";
import { AnimatePresence, useInView } from "framer-motion";
import { motion } from "framer-motion";

const AboutUs = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  
  const sectionRef = useRef(null);
  const progressRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  
  const totalSlides = 3;
  const slideDuration = 6000; // 6 seconds per slide

  // Start progress animation when slide changes
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = '0%';
      progressRef.current.style.transition = 'none';
      
      // Force reflow
      void progressRef.current.offsetWidth;
      
      // Start animation
      progressRef.current.style.width = '100%';
      progressRef.current.style.transition = `width ${slideDuration}ms linear`;
    }
  }, [currentSlide, slideDuration]);

  const images = [
    {
      src: "/image/venue/5f1889814db54c54ce84efff_weddings.jpg",
      alt: "Perfect Moments",
      description: "Creating magical celebrations that last forever",
      position: "center"
    },
    {
      src: "/image/venue/Home-3.jpg",
      alt: "Elegant Planning",
      description: "Professional coordination for your special day",
      position: "bottom"
    },
    {
      src: "/image/venue/5d6e99737805467c8931dd71_cutlery-dining-table-fancy-2788492.jpg",
      alt: "Exquisite Details",
      description: "Exceptional attention to every element of your event",
      position: "center"
    },
  ];

  const features = [
    {
      icon: "✦",
      title: "Personalized Planning",
      description: "Tailored experiences designed around your unique vision and style."
    },
    {
      icon: "✦",
      title: "Expert Coordination",
      description: "Seasoned professionals managing every aspect of your special day."
    },
    {
      icon: "✦",
      title: "Stunning Venues",
      description: "Access to exclusive locations that create the perfect backdrop."
    }
  ];

  useEffect(() => {
    if (!isInteracting) {
      const timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
      }, slideDuration);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [isInteracting, slideDuration, totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), slideDuration);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), slideDuration);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), slideDuration);
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,243,254,1) 100%)"
      }}
    >{/* Content Section */}
      <div className="w-full bg-white overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Content Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-5xl z-10 md:text-6xl font-[Dancing Script] bg-gradient-to-r from-purple-700 to-pink-500 bg-clip-text text-transparent mb-8">
                Crafting Your Perfect Day
              </h3>
              
              <p className="text-gray-700 text-xl md:text-2xl leading-relaxed mb-10 font-light">
                With over a decade of experience, we transform your wedding dreams into reality. 
                Our passionate team blends creativity with meticulous attention to detail, 
                ensuring a celebration that reflects your unique love story.
              </p>
              
              <Button
                text="Schedule a Consultation"
                className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl text-xl font-medium hover:shadow-xl hover:shadow-purple-500/30 border-none transition-all duration-300"
              />
            </motion.div>
            
            {/* Features Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              {/* Decorative elements */}
              <div className="absolute -z-10 top-20 -right-40 w-[400px] h-[400px] bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
              <div className="absolute -z-10 bottom-20 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-pink-300/20 to-purple-300/20 rounded-full blur-2xl"></div>
              
              <div className="grid grid-cols-1 gap-6">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
                    className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-gray-100 shadow-lg transition-all duration-300"
                  >
                    <div className="flex gap-6 items-start">
                      <span className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center rounded-2xl text-xl shadow-lg">
                        {feature.icon}
                      </span>
                      
                      <div>
                        <h4 className="text-gray-900 font-medium text-2xl mb-3">{feature.title}</h4>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Full-width Hero Slider */}
      <div className="w-full h-[100vh] max-h-[70vh] relative">
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="relative w-full h-full">
              <motion.img
                src={images[currentSlide].src}
                alt={images[currentSlide].alt}
                
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: "linear" }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Central Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="max-w-[1536px] w-full mx-auto px-6 md:px-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-center font-[Dancing Script] text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-700 to-pink-400 bg-clip-text text-transparent drop-shadow-lg mb-8"
            >
              Our Story
            </motion.h2>
            
            <p className="text-white/90 text-xl md:text-3xl text-center max-w-3xl mx-auto font-light drop-shadow-lg">
              Creating unforgettable wedding experiences with elegance and perfection
            </p>
          </motion.div>
        </div>

        {/* Navigation Controls - Elegant Minimal Design */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-10 w-full flex flex-col items-center gap-10"
        >
          {/* Progress Bar */}
          <div className="w-1/3 max-w-md h-[2px] bg-white/30 rounded-full overflow-hidden">
            <div 
              ref={progressRef}
              className="h-full bg-white rounded-full w-0"
            ></div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex gap-10 items-center">
            <motion.button
              onClick={prevSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/10 shadow-lg text-white"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <div className="flex gap-3">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="relative"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <span className={`block w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-white scale-125"
                      : "bg-white/40 hover:bg-white/60 scale-100"
                  }`}></span>
                </button>
              ))}
            </div>
            
            <motion.button
              onClick={nextSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/10 shadow-lg text-white"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>

      
    </section>
  );
};

export default AboutUs;
