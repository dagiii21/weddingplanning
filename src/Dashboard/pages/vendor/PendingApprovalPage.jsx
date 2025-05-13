import React from "react";
import { Box, Typography, Paper, Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import PendingIcon from "@mui/icons-material/Pending";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

const ApprovalStatusPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  borderRadius: "16px",
  boxShadow: theme.shadows[3],
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "6px",
    background: theme.palette.warning.main,
  },
}));

const GuidePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: "16px",
  boxShadow: theme.shadows[2],
}));

const StepItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px dashed ${theme.palette.divider}`,
  "&:last-child": {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottom: "none",
  },
}));

const PendingApprovalPage = () => {
  const navigate = useNavigate();

  return (
    <Box p={3} maxWidth="900px" mx="auto">
      <Button
        variant="text"
        startIcon={<HomeIcon />}
        onClick={() => navigate("/")}
        sx={{ marginBottom: 2 }}
      >
        Home
      </Button>

      <ApprovalStatusPaper>
        <PendingIcon
          sx={{
            fontSize: 80,
            color: "warning.main",
            mb: 2,
          }}
        />
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Your Account is Pending Approval
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          Thank you for registering as a vendor on our platform. Our team is
          reviewing your application.
        </Typography>
        <Typography variant="body1" paragraph>
          This process usually takes 1-2 business days. You'll receive an email
          notification when your account is approved.
        </Typography>
      </ApprovalStatusPaper>

      <GuidePaper>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          What happens next?
        </Typography>

        <Stack spacing={3} mt={2}>
          <StepItem>
            <Typography variant="subtitle1" fontWeight="medium">
              1. Application Review
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Our team reviews your business information and verifies your TIN
              number and account details.
            </Typography>
          </StepItem>

          <StepItem>
            <Typography variant="subtitle1" fontWeight="medium">
              2. Account Approval
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Once approved, you'll receive an email notification, and you'll be
              able to access your dashboard.
            </Typography>
          </StepItem>

          <StepItem>
            <Typography variant="subtitle1" fontWeight="medium">
              3. Start Adding Services
            </Typography>
            <Typography variant="body2" color="text.secondary">
              After approval, you can add your services to our platform and
              start receiving bookings.
            </Typography>
          </StepItem>
        </Stack>
      </GuidePaper>

      <GuidePaper>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Need Help?
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions or need to update your application, please
          contact our support team:
        </Typography>
        <Typography variant="body1">
          Email: <strong>support@weddingplanner.com</strong>
        </Typography>
        <Typography variant="body1">
          Phone: <strong>+251 911 234 567</strong>
        </Typography>
      </GuidePaper>

      <GuidePaper>
        <Typography
          variant="h5"
          gutterBottom
          fontWeight="bold"
          color="warning.main"
        >
          Restricted Access
        </Typography>
        <Typography variant="body1" paragraph>
          You're seeing this page because you attempted to access a feature that
          requires vendor approval. While your account is pending approval, you
          can only access the dashboard home page.
        </Typography>
        <Typography variant="body1" paragraph>
          The following features are restricted until your account is approved:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Bookings Management</strong> - View and manage booking
              requests
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Service Management</strong> - Add, edit, or remove
              services
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>Payment Processing</strong> - Receive and manage payments
            </Typography>
          </Box>
        </Box>
      </GuidePaper>
    </Box>
  );
};

export default PendingApprovalPage;
