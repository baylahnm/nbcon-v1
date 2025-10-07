import React, { useState, useEffect } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface TestimonialsSectionProps {
  currentUserName?: string;
  currentUserInitials?: string;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ 
  currentUserName = "Ahmed Al-Rashid",
  currentUserInitials = "AR"
}) => {
  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0);
  
  // Handle testimonial scroll pagination
  useEffect(() => {
    const container = document.querySelector('.testimonials-scroll');
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const page = Math.round(scrollLeft / containerWidth);
      setCurrentTestimonialPage(page);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-16 px-6 md:py-[100px] md:px-0 bg-muted/30">
      <div className="container mx-auto px-0">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Thousands of Happy Customers</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A high-performing web-based engineering marketplace for any project size and complexity
          </p>
        </div>
        
         {/* Testimonial Cards with Blur Effect */}
         <div className="relative">
           {/* Left blur gradient */}
           <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none"></div>
           
           {/* Right blur gradient */}
           <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none"></div>
           
           <div className="flex overflow-x-auto gap-6 mb-12 pb-4 scrollbar-hide testimonials-scroll">
           {/* Testimonial 1 */}
           <Card className="p-6 hover:shadow-lg transition-shadow flex-shrink-0 w-96">
             <div className="flex items-center mb-4">
               <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                 <span className="text-primary font-bold text-lg">{currentUserInitials}</span>
               </div>
               <div>
                 <h4 className="font-semibold">{currentUserName}</h4>
                 <p className="text-sm text-muted-foreground">Riyadh, Saudi Arabia</p>
               </div>
               <div className="ml-auto flex items-center">
                 <Star className="w-4 h-4 fill-primary text-primary" />
                 <span className="ml-1 text-sm font-medium">4.8</span>
               </div>
             </div>
             <p className="text-muted-foreground italic">
               "Wow... I am very happy to use this platform, it turned out to be more than my expectations and so far there have been no problems. nbcon always the best."
             </p>
           </Card>
           
           {/* Testimonial 2 */}
           <Card className="p-6 hover:shadow-lg transition-shadow flex-shrink-0 w-96">
             <div className="flex items-center mb-4">
               <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                 <span className="text-primary font-bold text-lg">SM</span>
               </div>
               <div>
                 <h4 className="font-semibold">Sarah Mohammed</h4>
                 <p className="text-sm text-muted-foreground">Jeddah, Saudi Arabia</p>
               </div>
               <div className="ml-auto flex items-center">
                 <Star className="w-4 h-4 fill-primary text-primary" />
                 <span className="ml-1 text-sm font-medium">5.0</span>
               </div>
             </div>
             <p className="text-muted-foreground italic">
               "The verification process and milestone payments gave me complete confidence. I found the perfect engineer for my project within hours."
             </p>
           </Card>
           
           {/* Testimonial 3 */}
           <Card className="p-6 hover:shadow-lg transition-shadow flex-shrink-0 w-96">
             <div className="flex items-center mb-4">
               <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                 <span className="text-primary font-bold text-lg">KA</span>
               </div>
               <div>
                 <h4 className="font-semibold">Khalid Al-Mansouri</h4>
                 <p className="text-sm text-muted-foreground">Dammam, Saudi Arabia</p>
               </div>
               <div className="ml-auto flex items-center">
                 <Star className="w-4 h-4 fill-primary text-primary" />
                 <span className="ml-1 text-sm font-medium">4.9</span>
               </div>
             </div>
             <p className="text-muted-foreground italic">
               "As an engineer, this platform has transformed my business. Steady work, secure payments, and professional clients. Highly recommended!"
             </p>
           </Card>
           
           {/* Testimonial 4 */}
           <Card className="p-6 hover:shadow-lg transition-shadow flex-shrink-0 w-96">
             <div className="flex items-center mb-4">
               <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                 <span className="text-primary font-bold text-lg">AR</span>
               </div>
               <div>
                 <h4 className="font-semibold">Ahmed Al-Rashid</h4>
                 <p className="text-sm text-muted-foreground">Mecca, Saudi Arabia</p>
               </div>
               <div className="ml-auto flex items-center">
                 <Star className="w-4 h-4 fill-primary text-primary" />
                 <span className="ml-1 text-sm font-medium">4.7</span>
               </div>
             </div>
             <p className="text-muted-foreground italic">
               "The bilingual support and RTL interface made it so easy to use. I can communicate with engineers in both Arabic and English seamlessly."
             </p>
           </Card>
           
           {/* Testimonial 5 */}
           <Card className="p-6 hover:shadow-lg transition-shadow flex-shrink-0 w-96">
             <div className="flex items-center mb-4">
               <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                 <span className="text-primary font-bold text-lg">FZ</span>
               </div>
               <div>
                 <h4 className="font-semibold">Fatima Al-Zahra</h4>
                 <p className="text-sm text-muted-foreground">Medina, Saudi Arabia</p>
               </div>
               <div className="ml-auto flex items-center">
                 <Star className="w-4 h-4 fill-primary text-primary" />
                 <span className="ml-1 text-sm font-medium">5.0</span>
               </div>
             </div>
             <p className="text-muted-foreground italic">
               "Outstanding platform! The geo-verified check-ins and real-time tracking gave me complete peace of mind during my construction project."
             </p>
           </Card>
           
           {/* Testimonial 6 */}
           <Card className="p-6 hover:shadow-lg transition-shadow flex-shrink-0 w-96">
             <div className="flex items-center mb-4">
               <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                 <span className="text-primary font-bold text-lg">MA</span>
               </div>
               <div>
                 <h4 className="font-semibold">Mohammed Al-Sheikh</h4>
                 <p className="text-sm text-muted-foreground">Tabuk, Saudi Arabia</p>
               </div>
               <div className="ml-auto flex items-center">
                 <Star className="w-4 h-4 fill-primary text-primary" />
                 <span className="ml-1 text-sm font-medium">4.8</span>
               </div>
             </div>
             <p className="text-muted-foreground italic">
               "Excellent service and support. The platform's compliance features and secure payment system make it the best choice for engineering projects."
             </p>
           </Card>
           </div>
         </div>
        
        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const container = document.querySelector('.testimonials-scroll');
              if (container) {
                const newPage = Math.max(0, currentTestimonialPage - 1);
                setCurrentTestimonialPage(newPage);
                // Scroll by 2 cards (768px) when going back from page 2 to page 0
                const scrollDistance = currentTestimonialPage === 2 ? -768 : -384;
                container.scrollBy({ left: scrollDistance, behavior: 'smooth' });
              }
            }}
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Button>
          <div className="flex space-x-2">
            {[0, 1, 2].map((page) => (
              <div
                key={page}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  currentTestimonialPage === page
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const container = document.querySelector('.testimonials-scroll');
              if (container) {
                const newPage = Math.min(2, currentTestimonialPage + 1);
                setCurrentTestimonialPage(newPage);
                // Scroll by 2 cards (768px) to show last 2 cards on second click
                const scrollDistance = currentTestimonialPage === 0 ? 768 : 384;
                container.scrollBy({ left: scrollDistance, behavior: 'smooth' });
              }
            }}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export { TestimonialsSection };

