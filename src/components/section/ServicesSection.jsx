import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useServices from "../../hooks/useServices";
import { toast } from "react-toastify";

const ServicesSection = () => {
  const { services, loading, error } = useServices(6); // Fetch up to 6 services
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [showTierModal, setShowTierModal] = useState(false);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowTierModal(true);
  };

  const handleCloseTierModal = () => {
    setShowTierModal(false);
  };

  const handleBookService = (serviceId, tierId, tierName) => {
    // Check if user is authenticated
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    // Get user role if logged in
    const userRole =
      localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

    // Make sure we have the tier ID and tier name
    if (!tierId || !tierName) {
      toast.error("Please select a service tier");
      return;
    }

    if (token && userRole === "CLIENT") {
      // If authenticated AND a client, navigate to booking page with tier info
      navigate(`/dashboard/booking/${serviceId}?tierId=${tierId}`);
      setShowTierModal(false);
    } else if (token && userRole) {
      // User is logged in but NOT as a client
      toast.warning(
        `You're logged in as a ${userRole.toLowerCase()}. Only clients can book services.`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      // Ask if they want to log out and create a client account
      const confirmLogout = window.confirm(
        "Would you like to log out from your current account and log in as a client?"
      );

      if (confirmLogout) {
        // Clear all auth data
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        localStorage.removeItem("userRole");
        sessionStorage.removeItem("userRole");

        // Store redirect destination with tier info
        sessionStorage.setItem(
          "redirectAfterLogin",
          `/dashboard/booking/${serviceId}?tierId=${tierId}`
        );

        // Navigate to login
        navigate("/login");
        setShowTierModal(false);
      }
    } else {
      // Not logged in at all
      toast.info("Please log in as a client to book this service", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Store the intended destination to redirect after login
      sessionStorage.setItem(
        "redirectAfterLogin",
        `/dashboard/booking/${serviceId}?tierId=${tierId}`
      );

      navigate("/login");
      setShowTierModal(false);
    }
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
    console.log("Using fallback services due to error");
  }

  const servicesToRender = Array.isArray(services) ? services : [];

  return (
    <>
      <section className="py-16 bg-gray-50" id="services">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-center text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
              Our Services
            </h2>
            <div className="w-16 h-1 bg-wedding-purple mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600 ">
              Comprehensive wedding planning services to make your special day
              perfect in every way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {servicesToRender.map((service, index) => (
              <div
                key={service.id || index}
                className="bg-white/90 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_12px_28px_rgba(147,51,234,0.15)] group cursor-pointer relative"
                onClick={() => handleServiceClick(service)}
                role="button"
                aria-label={`View ${service.title} packages`}
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 rounded-2xl overflow-hidden z-0">
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
                    </div>

                    {/* From Price badge */}
                    <div className="absolute bottom-4 right-4 bg-white/90 text-wedding-purple font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                      From ETB {service.price?.toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="relative h-56 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center shimmer-container">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,#d8b4fe,transparent),radial-gradient(circle_at_80%_20%,#f9a8d4,transparent)]"></div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 text-5xl relative z-10">
                      {service.icon}
                    </div>
                    <div className="shimmer-effect"></div>
                    <div className="absolute top-4 left-4 flex items-center bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      <span className="mr-1">0{index + 1}</span>
                    </div>

                    {/* From Price badge */}
                    <div className="absolute bottom-4 right-4 bg-white/90 text-wedding-purple font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                      From ETB {service.price?.toLocaleString()}
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

                  {service.vendor && (
                    <div className="mb-2 text-sm text-gray-600">
                      Provided by:{" "}
                      <span className="font-medium">
                        {service.vendor.businessName}
                      </span>
                      {service.vendor.rating && (
                        <span className="ml-2">
                          ⭐ {service.vendor.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  <div className="mt-6 inline-flex items-center relative overflow-hidden group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 px-5 py-2 rounded-full transition-all duration-300">
                    <span className="font-medium text-sm relative z-10 text-purple-700 group-hover:text-white transition-colors duration-300">
                      View Packages
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2 relative z-10 text-purple-700 group-hover:text-white transition-colors duration-300 transform transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/services")}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              View All Services
            </button>
          </div>
        </div>
      </section>

      {/* Service Tier Modal */}
      {showTierModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl transform transition-all overflow-hidden relative">
            <button
              onClick={handleCloseTierModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all z-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-6 pb-0">
              <h3 className="text-3xl font-semibold text-gray-800 mb-1">
                {selectedService.title}
              </h3>
              {selectedService.vendor && (
                <p className="text-gray-600 mb-3">
                  By {selectedService.vendor.businessName}
                </p>
              )}
              <p className="text-gray-700 mb-6">
                {selectedService.description}
              </p>
              <h4 className="text-xl font-medium text-gray-800 mb-4">
                Select a Package:
              </h4>
            </div>

            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {selectedService.tiers && selectedService.tiers.length > 0 ? (
                selectedService.tiers.map((tier) => {
                  // Define tier colors
                  const getTierColor = (tierName) => {
                    switch (tierName) {
                      case "BRONZE":
                        return {
                          bg: "bg-amber-700",
                          text: "text-amber-700",
                          hover: "hover:bg-amber-700",
                          border: "border-amber-700",
                        };
                      case "SILVER":
                        return {
                          bg: "bg-gray-400",
                          text: "text-gray-500",
                          hover: "hover:bg-gray-400",
                          border: "border-gray-400",
                        };
                      case "GOLD":
                        return {
                          bg: "bg-yellow-500",
                          text: "text-yellow-600",
                          hover: "hover:bg-yellow-500",
                          border: "border-yellow-500",
                        };
                      case "PLATINUM":
                        return {
                          bg: "bg-blue-900",
                          text: "text-blue-900",
                          hover: "hover:bg-blue-900",
                          border: "border-blue-900",
                        };
                      default:
                        return {
                          bg: "bg-purple-600",
                          text: "text-purple-600",
                          hover: "hover:bg-purple-600",
                          border: "border-purple-600",
                        };
                    }
                  };

                  const tierColors = getTierColor(tier.tier);
                  const tierName =
                    tier.tier.charAt(0) + tier.tier.slice(1).toLowerCase();

                  return (
                    <div
                      key={tier.id || tier.tier}
                      className="border rounded-xl p-5 transition-all hover:shadow-lg cursor-pointer group"
                      onClick={() =>
                        handleBookService(
                          selectedService.id,
                          tier.id,
                          tier.tier
                        )
                      }
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${tierColors.bg} text-white`}
                        >
                          {tierName}
                        </span>
                        <span className="text-2xl font-bold text-gray-800">
                          ETB {tier.price?.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{tier.description}</p>
                      <button
                        className={`w-full py-2 rounded-lg border-2 ${tierColors.border} ${tierColors.text} group-hover:text-white group-hover:${tierColors.hover} transition-all`}
                      >
                        Book Now
                      </button>
                    </div>
                  );
                })
              ) : (
                // If no tiers are available, show a single option with the base price
                <div
                  className="border rounded-xl p-5 transition-all hover:shadow-lg cursor-pointer group col-span-2"
                  onClick={() => {
                    toast.info(
                      "This service doesn't have tier options. Please contact us for more details."
                    );
                    handleCloseTierModal();
                    navigate("/contact");
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-600 text-white">
                      Standard
                    </span>
                    <span className="text-2xl font-bold text-gray-800">
                      ETB {selectedService.price?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    This service requires a custom quote. Please contact us for
                    more details.
                  </p>
                  <button className="w-full py-2 rounded-lg border-2 border-purple-600 text-purple-600 group-hover:text-white group-hover:bg-purple-600 transition-all">
                    Contact Us
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesSection;
