import React from 'react';
import { useNavigate } from 'react-router-dom';
import useServices from '../../hooks/useServices';

const ServicesSection = () => {
  const { services, loading, error } = useServices();
  const navigate = useNavigate();
  
  const handleServiceClick = (serviceTitle) => {
    // Navigate to services list with the selected service as a query parameter
    navigate(`/services?selected=${encodeURIComponent(serviceTitle)}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50" id="services">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
            Our Services
          </h2>
          <div className="w-16 h-1 bg-wedding-purple mx-auto mb-6"></div>
          <div className="text-center">Loading services...</div>
        </div>
      </section>
    );
  }

  if (error) {
    console.log('Using fallback services due to error');
  }
  
  const servicesToRender = Array.isArray(services) ? services : [];

  return (
    <section className="py-16 bg-gray-50" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-center text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
            Our Services
          </h2>
          <div className="w-16 h-1 bg-wedding-purple mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 ">Comprehensive wedding planning services to make your special day perfect in every way.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {servicesToRender.map((service, index) => (
            <div 
              key={index} 
              className="bg-white/90 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_12px_28px_rgba(147,51,234,0.15)] group cursor-pointer relative"
              onClick={() => handleServiceClick(service.title)}
              role="button"
              aria-label={`View details for ${service.title}`}
            >
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16  rounded-2xl overflow-hidden z-0">
                <div className="absolute transform rotate-45 bg-gradient-to-r from-purple-300/50 to-pink-300/50 w-24 h-24 -top-12 -right-12"></div>
              </div>
              
              {service.image ? (
                <div className="relative h-56 overflow-hidden shimmer-container">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/30 mix-blend-overlay z-10"></div>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="shimmer-effect"></div>
                  <div className="absolute top-4 left-4 flex items-center bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-sm">
                    <span className="mr-1">0{index + 1}</span>
                    <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
                    <span>Premium</span>
                  </div>
                </div>
              ) : (
                <div className="relative h-56 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center shimmer-container">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,#d8b4fe,transparent),radial-gradient(circle_at_80%_20%,#f9a8d4,transparent)]"></div>
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 text-5xl relative z-10">{service.icon}</div>
                  <div className="shimmer-effect"></div>
                  <div className="absolute top-4 left-4 flex items-center bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    <span className="mr-1">0{index + 1}</span>
                    <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
                    <span>Premium</span>
                  </div>
                </div>
              )}
              
              <div className="p-7 relative">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-purple-100/30 to-transparent"></div>
                
                <h3 className="text-2xl font-script mb-3 relative inline-block">
                  <span className="relative z-10 text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-500 transition-all duration-300">
                    {service.title}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-500"></span>
                </h3>
                
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                
                <div className="mt-6 inline-flex items-center relative overflow-hidden group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 px-5 py-2 rounded-full transition-all duration-300">
                  <span className="font-medium text-sm relative z-10 text-purple-700 group-hover:text-white transition-colors duration-300">View Details</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 relative z-10 text-purple-700 group-hover:text-white transition-colors duration-300 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
