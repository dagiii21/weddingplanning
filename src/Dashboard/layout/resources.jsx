import React from "react";

// Import icons for resources
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import PasswordIcon from "@mui/icons-material/Password";
import VendorIcon from "@mui/icons-material/Store";
import ChartIcon from "@mui/icons-material/BarChart";
import user from "@mui/icons-material/Person";
import feedback from "@mui/icons-material/Feedback";
import payemnt from "@mui/icons-material/Payment";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

// Import components from the pages folder
import AdminDashboard from "../pages/admin/AdminDashboard";
import VendorDashboard from "../pages/vendor/VendorDashboard";
import EventPlannerDashboard from "../pages/eventplanner/eventPlannerDashbord";
import UserDashbord from "../pages/user/UserDashboard";

// Import Event Planner components
import EventPlannerList from "../pages/admin/EventPlanner/EventPlannerList";
import EventPlannerEdit from "../pages/admin/EventPlanner/EventPlannerEdit";
import EventPlannerCreate from "../pages/admin/EventPlanner/EventPlannerCreate";
import EventPlannerShow from "../pages/admin/EventPlanner/EventPlannerShow";

// Import Password components
import AdminPasswordEdit from "../pages/admin/Password/PasswordEdit";
import AccountEdit from "../pages/user/Password/AccountEdit";
import eventplannerPasswordEdit from "../pages/eventplanner/Password/PasswordEdit";
import vendorAccountSettings from "../pages/vendor/Account/AccountSettings";

// Import Vendor components
import VendorList from "../pages/admin/Vendor/VendorList";
import VendorEdit from "../pages/admin/Vendor/VendorEdit";
import VendorCreate from "../pages/admin/Vendor/VendorCreate";
import VendorShow from "../pages/admin/Vendor/VendorShow";

// Import Events components
import ServiceCreate from "../pages/vendor/manageServices/ServiceCreate";
import ServiceEdit from "../pages/vendor/manageServices/ServiceEdit";
import ServiceList from "../pages/vendor/manageServices/ServiceList";

// Import user services component
import UserServiceList from "../pages/user/Services/ServiceList";

import userCreate from "../pages/admin/user/userCreate";
import userEdit from "../pages/admin/user/userEdit";
import userList from "../pages/admin/user/userList";
import feedbackList from "../pages/admin/feedback/feedbacklist";
import payemntList from "../pages/admin/payment/payementList";

// chat in vendo side
import ChatList from "../pages/vendor/chat/ChatList";
import ChatInterface from "../pages/vendor/chat/ChatInterface";

import MyBookingsList from "../pages/user/MyBookings/MyBookingsList";
import ChatInterfaceUser from "../pages/user/MyBookings/ChatInterface";
import PaymentList from "../pages/user/payment/PaymentList";
import VendorListOne from "../pages/eventplanner/Vendor/VendorList";
import userListOne from "../pages/eventplanner/user/userList";
import feedbackListOne from "../pages/eventplanner/feedback/feedbacklist";
import payemntListOne from "../pages/eventplanner/payment/payementList";

// Import Vendor bookings components
import BookingList from "../pages/vendor/bookings/BookingList";
import BookingDetail from "../pages/vendor/bookings/BookingDetail";

// Import our new payment dashboard component
import PaymentDashboard from "../pages/vendor/payment/PaymentDashboard";

export const adminResources = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    list: AdminDashboard,
  },
  {
    name: "event-planner",
    label: "Event Planner",
    icon: EventIcon,
    list: EventPlannerList,
    edit: EventPlannerEdit,
    create: EventPlannerCreate,
    show: EventPlannerShow,
  },
  {
    name: "vendor",
    label: "Vendor",
    icon: VendorIcon,
    list: VendorList,
    edit: VendorEdit,
    create: VendorCreate,
    show: VendorShow,
  },
  {
    name: "user",
    label: "user",
    icon: user,
    list: userList,
    edit: userEdit,
    create: userCreate,
  },
  {
    name: "feedback",
    label: "Feedback",
    icon: feedback,
    list: feedbackList,
  },
  {
    name: "payemnt",
    label: "Payemnt",
    icon: payemnt,
    list: payemntList,
  },
  {
    name: "password",
    label: "Password",
    icon: PasswordIcon,
    list: AdminPasswordEdit,
  },
];

// Define resources for Event Planner role
export const eventPlannerResources = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    list: EventPlannerDashboard,
  },
  {
    name: "vendor",
    label: "Vendor",
    icon: VendorIcon,
    list: VendorListOne,
  },
  {
    name: "user",
    label: "user",
    icon: user,
    list: userListOne,
  },
  {
    name: "feedback",
    label: "Feedback",
    icon: feedback,
    list: feedbackListOne,
  },
  {
    name: "payemnt",
    label: "Payemnt",
    icon: payemnt,
    list: payemntListOne,
  },
  {
    name: "password",
    label: "Password",
    icon: PasswordIcon,
    list: eventplannerPasswordEdit,
  },
];

// Define resources for Vendor role
export const vendorResources = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    list: VendorDashboard,
  },
  {
    name: "bookings",
    label: "Bookings",
    icon: BookOnlineIcon,
    list: BookingList,
    show: BookingDetail,
  },
  {
    name: "Mangeservices",
    label: "Mange Services",
    icon: EventIcon,
    list: ServiceList,
    edit: ServiceEdit,
    create: ServiceCreate,
  },
  {
    name: "chats",
    list: ChatList,
    show: ChatInterface,
    icon: ChatBubbleOutlineIcon,
  },
  {
    name: "payments",
    label: "Payments",
    icon: payemnt,
    list: PaymentDashboard,
  },
  {
    name: "account",
    label: "Account Settings",
    icon: PasswordIcon,
    list: vendorAccountSettings,
  },
];

// Define resources for User role
export const userResources = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    list: UserDashbord,
  },
  {
    name: "my-bookings",
    list: MyBookingsList,
    show: ChatInterfaceUser,
    icon: BookOnlineIcon,
    options: { label: "My Bookings" },
  },
  {
    name: "payments",
    label: "Payments",
    icon: payemnt,
    list: PaymentList,
  },
  {
    name: "account",
    label: "Account Settings",
    icon: PasswordIcon,
    list: AccountEdit,
  },
  {
    name: "services",
    label: "Services",
    icon: EventIcon,
    list: UserServiceList,
  },
];
