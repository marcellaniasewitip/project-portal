import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Menu, X, MapPin, Users, FileText, Settings } from 'lucide-react';
// REMOVED: import logo from '../assets/logo.jpg'; // This import is no longer needed

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Projects', href: '#projects', icon: MapPin },
    { name: 'Public Portal', href: '#public', icon: Users },
    { name: 'Reports', href: '#reports', icon: FileText },
    { name: 'Admin', href: '#admin', icon: Settings },
  ];

  return (
    <nav className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            {/* FIXED: Directly linking to the public asset */}
            <img src="/src/assets/738px-National_emblem_of_Papua_New_Guinea_(variant).svg.png" alt="PNG Project Tracker" className="h-10 w-10" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">Nuku District Project Tracking Portal</h1>
              <p className="text-xs text-muted-foreground">Wards & LLGs Transparency</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Action Button */}
          <div className="hidden md:block">
            <Button
              variant="hero"
              size="sm"
              onClick={() => window.location.href = '/login'}
            >
              Admin Dashboard
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
            <div className="pt-2">
              <Button
                variant="hero"
                size="sm"
                className="w-full"
                onClick={() => window.location.href = '/login'}
              >
                Admin Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;