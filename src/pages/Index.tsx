import { useState } from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import ProjectsGrid from '../components/ProjectGrid';
import PublicFeedback from '../components/PublicFeedback';
import Footer from '../components/Footer';
import LoginPage from '../components/LoginPage'; // <-- NEW IMPORT
import { Analytics } from '@/components/admin/Analytics';

// Assuming these Dialog components exist in your UI library
import { Dialog, DialogTrigger } from '../components/ui/dialog'; // <-- NEW IMPORT

// Define a reusable main content wrapper for consistent responsiveness
const MainContentWrapper = ({ children }: { children: React.ReactNode }) => (
  // Uses a container to limit max width on large screens and ensures consistent
  // horizontal padding (px-4 for mobile, px-6 for tablet/desktop)
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-8">
    {children}
  </div>
);

const Index = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // <-- NEW STATE

  return (
    <div className="min-h-screen bg-background"> 
      
      {/* Navigation - Pass the modal control function down */}
      <Navigation setIsLoginModalOpen={setIsLoginModalOpen} /> {/* <-- UPDATED */}
      
      {/* Hero section */}
      <HeroSection />
      
      {/* Wrapper ensures consistent layout for main sections */}
      <MainContentWrapper>
        <ProjectsGrid />
        <Analytics/>
        <PublicFeedback />        
      </MainContentWrapper>
      
      {/* Footer is typically full-width */}
      <Footer />

      {/* --- LOGIN MODAL IMPLEMENTATION --- */}
      {/* Dialog handles the backdrop and accessibility features */}
      
<Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
    <LoginPage setIsOpen={setIsLoginModalOpen} />
</Dialog>
      {/* --- END LOGIN MODAL --- */}
      
    </div>
  );
};

export default Index;