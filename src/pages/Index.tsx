import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import ProjectsGrid from '../components/ProjectGrid';
import PublicFeedback from '../components/PublicFeedback';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ProjectsGrid />
      <PublicFeedback />
      <Footer />
    </div>
  );
};

export default Index;
