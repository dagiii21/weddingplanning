import { useState, useEffect } from "react";
import { clientService } from "../services/api";

// Default fallback services if none are found in the backend
const fallbackServices = [
  {
    icon: "💍",
    title: "Full Wedding Planning",
    description:
      "From venue selection to day-of coordination, we handle every detail so you can focus on enjoying your special day.",
    image: "/image/service banner.jpg",
    tiers: [
      { tier: "BRONZE", price: 5000, description: "Basic planning package" },
      {
        tier: "SILVER",
        price: 10000,
        description: "Standard planning package",
      },
      { tier: "GOLD", price: 15000, description: "Premium planning package" },
      {
        tier: "PLATINUM",
        price: 25000,
        description: "Luxury planning package",
      },
    ],
  },
  {
    icon: "🌸",
    title: "Floral Design",
    description:
      "Custom floral arrangements that capture your vision and transform your venue into a romantic paradise.",
    image: "./image/service banner.jpg",
    tiers: [
      { tier: "BRONZE", price: 3000, description: "Basic floral package" },
      { tier: "SILVER", price: 6000, description: "Standard floral package" },
      { tier: "GOLD", price: 9000, description: "Premium floral package" },
      { tier: "PLATINUM", price: 15000, description: "Luxury floral package" },
    ],
  },
  {
    icon: "📸",
    title: "Photography & Video",
    description:
      "Expert photographers and videographers who capture every magical moment of your celebration.",
    image: "/image/service banner.jpg",
    tiers: [
      { tier: "BRONZE", price: 8000, description: "Basic photo package" },
      { tier: "SILVER", price: 12000, description: "Standard photo package" },
      { tier: "GOLD", price: 18000, description: "Premium photo package" },
      { tier: "PLATINUM", price: 25000, description: "Luxury photo package" },
    ],
  },
  {
    icon: "🍽️",
    title: "Catering & Cake",
    description:
      "Delicious culinary experiences and stunning cake designs tailored to your taste and preferences.",
    image: "/image/service banner.jpg",
    tiers: [
      { tier: "BRONZE", price: 5000, description: "Basic catering package" },
      {
        tier: "SILVER",
        price: 10000,
        description: "Standard catering package",
      },
      { tier: "GOLD", price: 15000, description: "Premium catering package" },
      {
        tier: "PLATINUM",
        price: 20000,
        description: "Luxury catering package",
      },
    ],
  },
];

// Map service category to an appropriate icon
const getCategoryIcon = (category) => {
  const icons = {
    Bronze: "🥉",
    Silver: "🥈",
    Gold: "🥇",
    Platinum: "💎",
    // Add more category to icon mappings as needed
  };
  return icons[category] || "🎁";
};

// Get the starting price from service tiers
const getStartingPrice = (service) => {
  if (!service.tiers || service.tiers.length === 0) {
    return service.basePrice || service.price || 0;
  }

  return service.tiers.reduce(
    (min, tier) => (tier.price < min ? tier.price : min),
    service.tiers[0].price
  );
};

const useServices = (limit = 6) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Use clientService to fetch real services
        const response = await clientService.getServices({
          limit: limit,
          page: 1,
          sortBy: "basePrice",
          sortOrder: "asc",
        });

        if (
          response.data &&
          response.data.services &&
          Array.isArray(response.data.services) &&
          response.data.services.length > 0
        ) {
          // Transform the data to match our component's expectations
          const formattedServices = response.data.services.map((service) => ({
            id: service.id,
            icon: getCategoryIcon(service.category),
            title: service.name,
            description: service.description || "",
            basePrice: service.basePrice || 0,
            price: getStartingPrice(service),
            category: service.category || "",
            vendor: service.vendor || null,
            tiers: service.tiers || [],
            // You could use a placeholder image or create a pattern based on category
            image: `/image/service-${(
              service.category || "default"
            ).toLowerCase()}.jpg`,
          }));
          setServices(formattedServices);
        } else {
          console.log("No services found, using fallback data");
          setServices(fallbackServices);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services");
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [limit]);

  return { services, loading, error };
};

export default useServices;
