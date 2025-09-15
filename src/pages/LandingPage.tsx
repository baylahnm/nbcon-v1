import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  Shield,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Star,
  Wrench,
  Building2
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "SCE Verified Engineers",
      description: "All engineers are verified by the Saudi Council of Engineers for your peace of mind."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "On-Demand Services",
      description: "Get engineering services when you need them, from quick inspections to complex projects."
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Geofenced Verification",
      description: "Real-time location tracking ensures engineers are where they need to be."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Trusted Network",
      description: "Connect with top-rated engineers in your area with verified reviews and ratings."
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Al-Rashid",
      role: "Property Developer",
      avatar: "AR",
      rating: 5,
      comment: "nbcon transformed how we manage engineering services for our projects. Fast, reliable, and fully compliant."
    },
    {
      name: "Fatima Al-Zahra",
      role: "Structural Engineer",
      avatar: "FZ", 
      rating: 5,
      comment: "As an engineer, nbcon gave me access to consistent work and secure payments. Highly recommended!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
              <span className="text-lg font-bold text-primary-foreground">nb</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">nbcon</h1>
              <p className="text-xs text-muted-foreground">Engineering Excellence Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button className="bg-gradient-primary hover:shadow-glow" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="outline" className="mb-6">
          🇸🇦 Built for Saudi Arabia's Engineering Sector
        </Badge>
        
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Connect. Build. Excel.
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Saudi Arabia's premier marketplace connecting certified engineers with clients. 
          From quick inspections to complex projects, get engineering excellence on-demand.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:shadow-glow text-lg px-8"
            onClick={() => navigate('/auth')}
          >
            Start Your Project
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8"
            onClick={() => navigate('/auth')}
          >
            Join as Engineer
            <Wrench className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Verified Engineers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">2,000+</div>
            <div className="text-sm text-muted-foreground">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">13</div>
            <div className="text-sm text-muted-foreground">Saudi Cities</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Why Choose nbcon?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built specifically for Saudi Arabia's engineering sector with compliance, quality, and efficiency in mind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-medium hover:shadow-large transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl mx-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            How nbcon Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Simple, secure, and compliant engineering services
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center text-2xl font-bold text-accent-foreground mb-4 mx-auto">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Post Your Project</h3>
            <p className="text-muted-foreground">
              Describe your engineering needs, set your budget, and receive quotes from verified engineers.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center text-2xl font-bold text-accent-foreground mb-4 mx-auto">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose Your Engineer</h3>
            <p className="text-muted-foreground">
              Review profiles, ratings, and proposals. Select the best engineer for your project needs.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center text-2xl font-bold text-accent-foreground mb-4 mx-auto">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Track & Pay Safely</h3>
            <p className="text-muted-foreground">
              Monitor progress with milestone tracking and secure escrow payments. Pay only when satisfied.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Trusted by engineers and clients across Saudi Arabia
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-medium">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="border-0 bg-gradient-hero text-primary-foreground shadow-large">
          <CardContent className="p-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Transform Your Engineering Projects?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied clients and engineers on nbcon today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8"
                onClick={() => navigate('/auth')}
              >
                <Building2 className="mr-2 h-5 w-5" />
                I Need Engineering Services
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 bg-white/10 border-white/20 hover:bg-white/20"
                onClick={() => navigate('/auth')}
              >
                <Wrench className="mr-2 h-5 w-5" />
                I'm an Engineer
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">nb</span>
              </div>
              <div>
                <p className="font-semibold">nbcon</p>
                <p className="text-xs text-muted-foreground">Engineering Excellence Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© 2024 nbcon. All rights reserved.</span>
              <span>•</span>
              <span>Made for Saudi Arabia 🇸🇦</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}