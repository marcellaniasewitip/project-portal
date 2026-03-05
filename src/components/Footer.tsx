import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const llgs = [
    'East Palai LLG',
    'Maimai Wanwan LLG',
    'Nuku Central',
    'West Palai LLG',
    'Yangkok'
  ];

  const resources = [
    'Project Guidelines',
    'Tender Notices',
    'Annual Reports',
    'Contact Directory',
    'FAQ',
    'Privacy Policy'
  ];

  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content Grid: Stacks on mobile, 4 columns on desktop (with Organization taking 2) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* 1. Organization Info (Takes 2 columns on desktop) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="src/assets/738px-National_emblem_of_Papua_New_Guinea_(variant).svg.png" 
                alt="PNG Project Tracker" 
                className="h-10 w-10" 
              />
              <div>
                <h3 className="text-lg font-bold">Nuku District Project Tracking Portal</h3>
                <p className="text-primary-foreground/80 text-sm">District Transparency</p>
              </div>
            </div>
            
            <p className="text-primary-foreground/90 max-w-md text-sm">
              Promoting transparency and accountability in development projects across LLGs in the District. Building trust between government and communities through open access to project information.
            </p>
            
            {/* Contact Details */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Government Offices, Waigani, Port Moresby</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">+675 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm truncate">info@pngprojects.gov.pg</span>
              </div>
            </div>
          </div>

          {/* 2. LLGs (Takes 1 column on desktop) */}
          <div>
            <h4 className="font-semibold mb-4 text-lg border-b border-primary-foreground/20 pb-2 md:border-b-0 md:pb-0">Participating LLGs</h4>
            <ul className="space-y-2">
              {llgs.map((llg, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors block"
                  >
                    {llg}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Resources (Takes 1 column on desktop) */}
          <div>
            <h4 className="font-semibold mb-4 text-lg border-b border-primary-foreground/20 pb-2 md:border-b-0 md:pb-0">Resources</h4>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors block"
                  >
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Separator and Bottom Section (Copyright/Socials) */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-primary-foreground/80 text-center">
              © {new Date().getFullYear()} Papua New Guinea Government. All rights reserved.
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;