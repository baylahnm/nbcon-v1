import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Zap, 
  Droplets, 
  Thermometer, 
  Mountain,
  Eye,
  Shield,
  Camera,
  Wrench
} from 'lucide-react';

interface Option {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  price: string;
  action: string;
}

const InteractiveSelector = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);
  
  const options: Option[] = [
    {
      title: "Site Inspection",
      description: "Comprehensive site assessment and inspection services for construction projects",
      image: "/popular-services/Site Inspection.png",
      icon: <Eye size={24} className="text-foreground" />,
      price: "150 SAR/day",
      action: "Hire Now"
    },
    {
      title: "Electrical Design",
      description: "Professional electrical system design and engineering solutions",
      image: "/popular-services/Electrical Design.png",
      icon: <Zap size={24} className="text-foreground" />,
      price: "300 SAR/day",
      action: "Hire Now"
    },
    {
      title: "Structural Analysis",
      description: "Advanced structural engineering and analysis for complex projects",
      image: "/popular-services/Structural Analysis.png",
      icon: <Building2 size={24} className="text-foreground" />,
      price: "500 SAR/day",
      action: "Hire Now"
    },
    {
      title: "HVAC Design",
      description: "Energy-efficient heating, ventilation, and air conditioning systems",
      image: "/popular-services/HVAC Design.png",
      icon: <Thermometer size={24} className="text-foreground" />,
      price: "250 SAR/day",
      action: "Hire Now"
    },
    {
      title: "Surveying",
      description: "Precision land surveying and mapping services for construction",
      image: "/popular-services/Surveying.png",
      icon: <Mountain size={24} className="text-foreground" />,
      price: "200 SAR/day",
      action: "Hire Now"
    },
    {
      title: "HSE Consulting",
      description: "Health, Safety, and Environment consulting for workplace compliance",
      image: "/popular-services/HSE.png",
      icon: <Shield size={24} className="text-foreground" />,
      price: "180 SAR/day",
      action: "Hire Now"
    },
    {
      title: "Drone Surveying",
      description: "Advanced aerial surveying and mapping using drone technology",
      image: "/popular-services/Drone Surveying.png",
      icon: <Camera size={24} className="text-foreground" />,
      price: "400 SAR/day",
      action: "Hire Now"
    },
    {
      title: "Equipment Maintenance",
      description: "Professional maintenance and repair services for construction equipment",
      image: "/popular-services/Equipment Maintenance.png",
      icon: <Wrench size={24} className="text-foreground" />,
      price: "220 SAR/day",
      action: "Hire Now"
    },
    {
      title: "Soil Testing",
      description: "Comprehensive soil analysis and geotechnical testing services",
      image: "/popular-services/Soil  Testing.png",
      icon: <Droplets size={24} className="text-foreground" />,
      price: "160 SAR/day",
      action: "Hire Now"
    }
  ];

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, i]);
      }, 180 * i);
      timers.push(timer);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="relative w-full bg-gradient-to-br from-background via-background to-muted/20 py-0 px-4">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          Popular Services
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Popular Services
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Quick access to our most requested engineering services
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((option, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              onClick={() => handleOptionClick(index)}
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={option.image}
                  alt={option.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    console.error(`Failed to load image: ${option.image}`, e);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log(`Successfully loaded image: ${option.image}`);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Icon */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-background/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  {option.icon}
                </div>
                
                {/* Price Badge */}
                <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  {option.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {option.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                  {option.description}
                </p>
                
                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">
                    {option.action}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveSelector;
