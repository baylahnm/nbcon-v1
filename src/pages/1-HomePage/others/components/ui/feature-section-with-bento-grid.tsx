import React from "react";
import { cn } from "../../lib/utils";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Wrench, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import createGlobe from "cobe";
import DisplayCards from "./display-cards";
import AnimatedCardChartDemo from "./animated-card-chart-demo";

export function FeaturesSectionWithBentoGrid() {
  const features = [
    {
      title: "Track engineering projects effectively",
      description:
        "Track and manage your engineering projects with ease using our intuitive project management interface.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 md:col-span-3 lg:col-span-3 border-b md:border-r border-border",
    },
    {
      title: "Real-time Analytics Dashboard",
      description:
        "Monitor project performance, track milestones, and get insights with our comprehensive analytics dashboard.",
      skeleton: <SkeletonTwo />,
      className:
        "col-span-1 md:col-span-3 lg:col-span-3 border-b md:border-r border-border",
    },
    {
      title: "Watch our AI in action",
      description:
        "Whether you're an engineer or client, see how our AI-powered matching system works on our YouTube channel",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 md:col-span-3 lg:col-span-3 border-b md:border-r border-border",
    },
    {
      title: "Our Core Features",
      description:
        "Discover the key features that make nbcon the premier engineering marketplace in Saudi Arabia.",
      skeleton: <SkeletonFive />,
      className: "col-span-1 md:col-span-3 lg:col-span-3 border-b md:border-none",
    },
  ];
  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A high-performing marketplace connecting certified engineers, clients, and enterprises—with transparent pricing, milestone payments, and built-in compliance.
        </p>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 mt-12 xl:border rounded-md border-border">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-foreground text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base max-w-4xl text-left mx-auto",
        "text-muted-foreground text-center font-normal",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto bg-card shadow-2xl group h-full border">
        <div className="flex flex-1 w-full h-full flex-col space-y-2">
          {/* Dashboard Preview */}
          <div className="w-full h-full bg-muted/30 rounded-lg p-4">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Project Dashboard</h3>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Dashboard Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground">Active</div>
                <div className="text-lg font-bold text-primary">12</div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground">Completed</div>
                <div className="text-lg font-bold text-green-600">48</div>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-3 text-center">
                <div className="text-xs text-muted-foreground">Pending</div>
                <div className="text-lg font-bold text-orange-600">7</div>
              </div>
            </div>
            
            {/* Project List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-card rounded border">
                <span className="text-sm text-foreground">HVAC System Design</span>
                <span className="text-xs text-green-600">In Progress</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-card rounded border">
                <span className="text-sm text-foreground">Electrical Planning</span>
                <span className="text-xs text-primary">Review</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-card rounded border">
                <span className="text-sm text-foreground">Structural Analysis</span>
                <span className="text-xs text-orange-600">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-background via-background to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-background via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const SkeletonTwo = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full justify-center items-center">
      <AnimatedCardChartDemo />
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <Link
      to="/auth"
      className="relative flex gap-10 h-full group/image"
    >
      <div className="w-full mx-auto bg-transparent dark:bg-transparent group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2 relative">
          <Play className="h-20 w-20 absolute z-10 inset-0 text-primary m-auto" />
          {/* AI Dashboard Preview */}
          <div className="h-full w-full aspect-square bg-background rounded-sm p-4 flex flex-col justify-center items-center relative overflow-hidden">
            {/* AI Chat Interface */}
            <div className="w-full max-w-sm bg-card rounded-lg shadow-lg p-4 border">
              {/* Chat Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-bold">AI</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">nbcon AI Assistant</h4>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">AI</span>
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2 max-w-xs">
                    <p className="text-xs text-foreground">I can help you find the right engineers for your project...</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 justify-end">
                  <div className="bg-primary rounded-lg px-3 py-2 max-w-xs">
                    <p className="text-xs text-primary-foreground">I need an electrical engineer for a residential project</p>
                  </div>
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary-foreground">You</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">AI</span>
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2 max-w-xs">
                    <p className="text-xs text-foreground">I found 8 qualified electrical engineers in your area...</p>
                  </div>
                </div>
              </div>
              
              {/* Input Area */}
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-muted rounded-full px-3 py-2">
                  <span className="text-xs text-muted-foreground">Ask about engineers, costs, or projects...</span>
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            </div>
            
            {/* Blur effect on hover */}
            <div className="absolute inset-0 bg-background/10 backdrop-blur-none group-hover/image:backdrop-blur-sm transition-all duration-200 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </Link>
  );
};


export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
};

export const SkeletonFive = () => {
  const featureCards = [
    {
      icon: <Wrench className="size-4 text-primary-foreground" />,
      title: "Smart Matching",
      description: "AI-powered engineer matching for your projects",
      date: "Just now",
      iconClassName: "text-primary",
      titleClassName: "text-primary",
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Users className="size-4 text-primary-foreground" />,
      title: "SCE Verified",
      description: "All engineers are SCE certified professionals",
      date: "2 days ago",
      iconClassName: "text-primary",
      titleClassName: "text-primary",
      className:
        "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <BarChart3 className="size-4 text-primary-foreground" />,
      title: "Real-time Analytics",
      description: "Track project progress with live insights",
      date: "Today",
      iconClassName: "text-primary",
      titleClassName: "text-primary",
      className:
        "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
    },
  ];

  return (
    <div className="relative flex py-8 px-2 gap-10 h-full items-center justify-center">
      <div className="w-full max-w-2xl">
        <DisplayCards cards={featureCards} />
      </div>
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [24.7136, 46.6753], size: 0.03 }, // Riyadh, Saudi Arabia
        { location: [21.4858, 39.1925], size: 0.1 }, // Jeddah, Saudi Arabia
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};


