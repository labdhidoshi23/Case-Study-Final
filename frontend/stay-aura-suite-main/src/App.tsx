import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { authApi } from "@/api/services";

import { MainLayout } from "@/layouts/MainLayout";
import ChatWidget from "@/components/ChatWidget";
import { CustomerLayout, StaffLayout, AdminLayout } from "@/layouts/DashboardLayout";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Customer pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import BrowseRooms from "./pages/customer/BrowseRooms";
import RoomDetails from "./pages/customer/RoomDetails";
import BookRoom from "./pages/customer/BookRoom";
import MyReservations from "./pages/customer/MyReservations";
import Payments from "./pages/customer/Payments";
import CustomerNotifications from "./pages/customer/Notifications";
import Profile from "./pages/customer/Profile";

// Staff pages
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffReservations from "./pages/staff/StaffReservations";
import StaffRooms from "./pages/staff/StaffRooms";
import StaffCustomers from "./pages/staff/StaffCustomers";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminReports from "./pages/admin/AdminReports";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminInventory from "./pages/admin/AdminInventory";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    authApi.getProfile()
      .then(res => {
        const u = res.data;
        dispatch(setUser({
          id: String(u.id),
          username: u.name,
          email: u.email,
          role: u.role,
          fullName: u.name,
        }));
      })
      .catch(() => localStorage.removeItem("token"));
  }, []);

  return (
    <>
    <ChatWidget />
    <Routes>
          {/* Public routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
          </Route>

          {/* Auth routes (no layout wrapper) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer routes */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="rooms" element={<BrowseRooms />} />
            <Route path="rooms/:id" element={<RoomDetails />} />
            <Route path="book/:id" element={<BookRoom />} />
            <Route path="reservations" element={<MyReservations />} />
            <Route path="payments" element={<Payments />} />
            <Route path="notifications" element={<CustomerNotifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Staff routes */}
          <Route path="/staff" element={<StaffLayout />}>
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="reservations" element={<StaffReservations />} />
            <Route path="rooms" element={<StaffRooms />} />
            <Route path="customers" element={<StaffCustomers />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
    </>  
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
