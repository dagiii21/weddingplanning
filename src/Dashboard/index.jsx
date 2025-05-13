import React, { useState, useEffect } from "react";
import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Box from "@mui/material/Box";
import {
  adminResources,
  eventPlannerResources,
  vendorResources,
  userResources,
} from "./layout/resources";
import dataProvider from "./dataProvider/apiDataProvider";

// Import the payment status page component directly for custom routing
import PaymentStatus from "./pages/user/payment/PaymentStatus";

// Import the booking form component
import BookingForm from "./pages/user/Booking/BookingForm";

// Import vendor route wrapper for checking approval status
import VendorRouteWrapper from "./pages/vendor/VendorRouteWrapper";

// Custom loader component only to hide the admin panel while loading
const Loader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <LoadingSpinner />
    <div>Loading Wedding Planner Admin...</div>
  </Box>
);

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    const role = sessionStorage.getItem("userRole");
    console.log("User role:", role);
    setUserRole(role || "CLIENT"); // Default to CLIENT if no role is found

    return () => clearTimeout(loadingTimer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Define resources based on user role using arrays
  const getResourcesForRole = () => {
    const roleResources = {
      ADMIN: adminResources,
      EVENT_PLANNER: eventPlannerResources,
      VENDOR: vendorResources,
      CLIENT: userResources,
    };

    return roleResources[userRole] || userResources;
  };

  // Render resources from the array
  const renderResources = () => {
    const resources = getResourcesForRole();

    // If user is a vendor, wrap each resource component with the approval check
    if (userRole === "VENDOR") {
      return resources.map((resource, index) => {
        // Create wrapped versions of the resource components
        const WrappedList = resource.list
          ? (props) => (
              <VendorRouteWrapper>
                {resource.list ? <resource.list {...props} /> : null}
              </VendorRouteWrapper>
            )
          : null;

        const WrappedEdit = resource.edit
          ? (props) => (
              <VendorRouteWrapper>
                {resource.edit ? <resource.edit {...props} /> : null}
              </VendorRouteWrapper>
            )
          : null;

        const WrappedCreate = resource.create
          ? (props) => (
              <VendorRouteWrapper>
                {resource.create ? <resource.create {...props} /> : null}
              </VendorRouteWrapper>
            )
          : null;

        const WrappedShow = resource.show
          ? (props) => (
              <VendorRouteWrapper>
                {resource.show ? <resource.show {...props} /> : null}
              </VendorRouteWrapper>
            )
          : null;

        return (
          <Resource
            key={index}
            name={resource.name}
            options={{ label: resource.label }}
            icon={resource.icon}
            list={WrappedList}
            edit={WrappedEdit}
            create={WrappedCreate}
            show={WrappedShow}
          />
        );
      });
    }

    // For non-vendor users, return normal resources
    return resources.map((resource, index) => (
      <Resource
        key={index}
        name={resource.name}
        options={{ label: resource.label }}
        icon={resource.icon}
        list={resource.list}
        edit={resource.edit}
        create={resource.create}
        show={resource.show}
      />
    ));
  };

  return (
    <Admin
      dataProvider={dataProvider}
      title="Wedding Planner Admin"
      loginPage={null}
      basename="/dashboard"
      disableBlockingNavigation={true}
    >
      {renderResources()}

      {/* Custom routes for special pages */}
      <CustomRoutes>
        {/* Client routes */}
        <Route path="/payment/status" element={<PaymentStatus />} />

        {/* Booking route with wrapper for vendors */}
        {userRole === "VENDOR" ? (
          <Route
            path="/booking/:serviceId"
            element={
              <VendorRouteWrapper>
                <BookingForm />
              </VendorRouteWrapper>
            }
          />
        ) : (
          <Route path="/booking/:serviceId" element={<BookingForm />} />
        )}
      </CustomRoutes>
    </Admin>
  );
};

export default AdminPanel;
