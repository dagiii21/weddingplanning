import { useState, useCallback, useEffect } from "react";
import { vendorService } from "../services/api";
import { toast } from "react-toastify";

const useVendorAccount = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch vendor profile and stats
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await vendorService.getProfile();

      if (response.data) {
        setProfile(response.data.profile);
        setStats(response.data.stats);
      } else {
        throw new Error("Failed to fetch vendor profile");
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while fetching vendor profile"
      );
      toast.error(err.message || "Failed to load account information");
    } finally {
      setLoading(false);
    }
  }, []);

  // Update vendor account information
  const updateAccount = useCallback(
    async (data) => {
      if (!profile?.vendorDetails?.id) {
        toast.error("Cannot update account: Vendor ID not found");
        return;
      }

      setUpdateLoading(true);

      try {
        const response = await vendorService.updateAccount(
          profile.vendorDetails.id,
          data
        );

        if (response.data && response.data.vendor) {
          // Update local state with new data
          setProfile((prevProfile) => ({
            ...prevProfile,
            email: response.data.vendor.user.email,
            firstName: response.data.vendor.user.firstName,
            lastName: response.data.vendor.user.lastName,
            phone: response.data.vendor.user.phone,
            avatar: response.data.vendor.user.avatar,
            vendorDetails: {
              ...prevProfile.vendorDetails,
              businessName: response.data.vendor.businessName,
              description: response.data.vendor.description,
              serviceType: response.data.vendor.serviceType,
            },
          }));

          toast.success("Account updated successfully");
          return true;
        } else {
          throw new Error(
            response.data?.message || "Failed to update vendor account"
          );
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An error occurred while updating your account";
        toast.error(errorMessage);
        return false;
      } finally {
        setUpdateLoading(false);
      }
    },
    [profile]
  );

  // Load profile on initial mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    stats,
    loading,
    error,
    updateLoading,
    fetchProfile,
    updateAccount,
  };
};

export default useVendorAccount;
