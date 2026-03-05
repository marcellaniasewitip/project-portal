import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Menu, X, MapPin, Users, BarChart } from 'lucide-react'; 

// 1. Define props for Navigation to accept the state setter function
interface NavigationProps {
  setIsLoginModalOpen: (open: boolean) => void;
}

// 2. Update the component signature to accept props
const Navigation = ({ setIsLoginModalOpen }: NavigationProps) => { 
  const [isOpen, setIsOpen] = useState(false);

  // Nav items are reduced to only public/main links
  const navItems = [
    { name: 'Projects', href: '#projects', icon: MapPin },
    { name: 'Public Portal', href: '#public', icon: Users },
    { name: 'Analytics', href: '#analytic', icon: BarChart },
  ];

  // Function to open the login modal and close the mobile menu (if open)
  const handleOpenLogin = () => {
    setIsLoginModalOpen(true); // Open the modal
    setIsOpen(false); // Close mobile menu if open
  }

  return (
    // Updated background to blue-700
    <nav className="bg-blue-700 border-b border-blue-900 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo and Title Group */}
          <div className="flex items-center space-x-2">
            <img 
              src="/src/assets/738px-National_emblem_of_Papua_New_Guinea_(variant).svg.png" 
              alt="PNG Project Tracker" 
              className="h-10 w-10 filter brightness-110" 
            />
            {/* Title is hidden on smallest screens, visible from sm: up */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white">Nuku District Watch Portal</h1>
              <p className="text-xs text-blue-200">Wards & LLGs Transparency</p>
            </div>
          </div>

          {/* Desktop Navigation & Action Button (hidden below md) */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-blue-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
            
            {/* Desktop Action Button: Opens the modal */}
            <Button
              variant="default" 
              className="bg-white text-blue-700 hover:bg-gray-100 font-semibold" 
              size="sm"
              onClick={handleOpenLogin} // <-- CORRECT: Opens the modal
            >
              Admin Login
            </Button>
          </div>

          {/* Mobile menu button (visible only below md) */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-white hover:bg-blue-600" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel (Only visible when isOpen is true and below md) */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border"> 
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-2"
                onClick={() => setIsOpen(false)} // Close menu on click
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
            <div className="pt-2">
              {/* Mobile button opens the modal */}
              <Button
                variant="default" 
                className="w-full bg-blue-700 text-white hover:bg-blue-800"
                size="sm"
                onClick={handleOpenLogin} // <-- FIX APPLIED: Calls the function to open the modal
              >
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;