import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Globe, MessageSquare, Users } from 'lucide-react';
import { Button } from '../ui/button';

interface FooterProps {
  footerData?: {
    product: {
      title: string;
      links: string[];
    };
    clients: {
      title: string;
      links: string[];
    };
    engineers: {
      title: string;
      links: string[];
    };
    copyright: string;
  };
}

const Footer: React.FC<FooterProps> = ({ 
  footerData = {
    product: {
      title: 'Product',
      links: ['Features', 'Pricing', 'Security', 'Updates']
    },
    clients: {
      title: 'For Clients',
      links: ['Find Engineers', 'Post Projects', 'Enterprise', 'Support']
    },
    engineers: {
      title: 'For Engineers',
      links: ['Browse Jobs', 'Profile Setup', 'Verification', 'Resources']
    },
    copyright: '© 2024 nbocn. All rights reserved.'
  }
}) => {
  return (
    <footer className="bg-primary pt-12 pb-12 px-6 rounded-t-[50px]">
      <div className="container mx-auto px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-6 border-b border-sidebar-border pb-6">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded bg-primary-foreground flex items-center justify-center">
                <span className="text-primary font-bold text-sm">nb</span>
              </div>
              <span className="font-bold text-xl text-primary-foreground">nbcon</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Saudi Arabia's premier engineering marketplace connecting verified professionals with clients through AI-powered matching and secure milestone payments.
            </p>
            <div className="flex space-x-4 bg-primary p-0 rounded-lg">
              <Button variant="outline" size="sm" className="w-[30px] h-[30px] p-0 border-0 hover:bg-primary-foreground/10 group bg-primary-foreground dark:bg-primary-foreground">
                <Facebook className="w-4 h-4 text-primary group-hover:text-secondary transition-colors" />
              </Button>
              <Button variant="outline" size="sm" className="w-[30px] h-[30px] p-0 border-0 hover:bg-primary-foreground/10 group bg-primary-foreground dark:bg-primary-foreground">
                <Twitter className="w-4 h-4 text-primary group-hover:text-secondary transition-colors" />
              </Button>
              <Button variant="outline" size="sm" className="w-[30px] h-[30px] p-0 border-0 hover:bg-primary-foreground/10 group bg-primary-foreground dark:bg-primary-foreground">
                <Linkedin className="w-4 h-4 text-primary group-hover:text-secondary transition-colors" />
              </Button>
              <Button variant="outline" size="sm" className="w-[30px] h-[30px] p-0 border-0 hover:bg-primary-foreground/10 group bg-primary-foreground dark:bg-primary-foreground">
                <Instagram className="w-4 h-4 text-primary group-hover:text-secondary transition-colors" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-primary-foreground">{footerData.product.title}</h4>
            <ul className="space-y-3">
              {footerData.product.links.map((link, index) => (
                <li key={index}>
                  <Link to="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="font-semibold mb-4 text-primary-foreground">{footerData.clients.title}</h4>
            <ul className="space-y-3">
              {footerData.clients.links.map((link, index) => (
                <li key={index}>
                  <Link to="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Engineers */}
          <div>
            <h4 className="font-semibold mb-4 text-primary-foreground">{footerData.engineers.title}</h4>
            <ul className="space-y-3">
              {footerData.engineers.links.map((link, index) => (
                <li key={index}>
                  <Link to="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
          <p className="text-sm text-primary-foreground/70">
            {footerData.copyright}
          </p>
            <div className="flex space-x-6">
              <Link to="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-primary-foreground/70">Follow us:</span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-primary-foreground/10">
                <Globe className="w-4 h-4 text-primary-foreground/70" />
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-primary-foreground/10">
                <MessageSquare className="w-4 h-4 text-primary-foreground/70" />
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-primary-foreground/10">
                <Users className="w-4 h-4 text-primary-foreground/70" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };

