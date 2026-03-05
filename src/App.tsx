// src/App.tsx
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Import BrowserRouter from 'react-router-dom' remains the same
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
//import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  // Note: Your Navigate target '/admin' should probably be '/admin-dashboard' 
  // or '/login' for a better user experience, but we'll leave it as is for now.
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* ====================================================================
        FIX: Add the basename to tell React Router the application 
        is hosted in a subdirectory (your GitHub Pages repo name).
        ====================================================================
      */}
      <BrowserRouter basename="/project-portal">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          {/*<Route path="/login" element={<LoginPage />} />*/}
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Admin Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback for any unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;