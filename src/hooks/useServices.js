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
  },
  {
    icon: "🌸",
    title: "Floral Design",
    description:
      "Custom floral arrangements that capture your vision and transform your venue into a romantic paradise.",
    image: "./image/service banner.jpg",
  },
  {
    icon: "📸",
    title: "Photography & Video",
    description:
      "Expert photographers and videographers who capture every magical moment of your celebration.",
    image: "/image/service banner.jpg",
  },
  {
    icon: "🍽️",
    title: "Catering & Cake",
    description:
      "Delicious culinary experiences and stunning cake designs tailored to your taste and preferences.",
    image: "/image/service banner.jpg",
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
          sortBy: "price",
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
            description: service.description,
            price: service.price,
            category: service.category,
            vendor: service.vendor,
            // You could use a placeholder image or create a pattern based on category
            image: `/image/service-${service.category.toLowerCase()}.jpg`,
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
