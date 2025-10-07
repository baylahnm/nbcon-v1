import React from 'react';
import { ArrowRight, Globe, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface ContactSectionProps {
  language?: 'en' | 'ar';
  contactData?: {
    title: string;
    subtitle: string;
    form: {
      email: string;
      submit: string;
    };
    info: {
      email: string;
      phone: string;
      address: string;
    };
  };
}

const ContactSection: React.FC<ContactSectionProps> = ({ 
  language = 'en',
  contactData = {
    title: language === 'en' ? 'Get In Touch' : 'تواصل معنا',
    subtitle: language === 'en' ? 'Ready to start your engineering project? Let\'s talk.' : 'مستعد لبدء مشروعك الهندسي؟ دعنا نتحدث.',
    form: {
      email: language === 'en' ? 'Email' : 'البريد الإلكتروني',
      submit: language === 'en' ? 'Send Message' : 'إرسال الرسالة'
    },
    info: {
      email: 'hello@nbcon.app',
      phone: '+966 56 620 2179',
      address: language === 'en' ? 'Riyadh, Saudi Arabia' : 'الرياض، المملكة العربية السعودية'
    }
  }
}) => {
  return (
    <section id="about" className="py-[100px] px-6 md:px-0 bg-background">
      <div className="container mx-auto px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4">
          {/* Left Column - Contact Form with Animated Border */}
          <div className="relative lg:col-span-1">
            <div className="relative rounded-2xl p-[2px] overflow-hidden">
              {/* Laser Flow animated border */}
              <div className="pointer-events-none absolute inset-0 z-0 animate-[spin_8s_linear_infinite] bg-[conic-gradient(hsl(var(--primary))_0%,hsl(var(--accent))_25%,hsl(var(--secondary))_50%,hsl(var(--destructive))_75%,hsl(var(--primary))_100%)] opacity-60" />
              {/* Contact Form in Browser Window */}
              <div className="relative z-10">
              {/* Browser Window Frame */}
              <div className="relative">
                <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                  {/* Browser Header */}
                  <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Globe className="w-4 h-4" />
                      <span>nbcon.app/contact</span>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className="p-8 bg-background">
                    <form className="space-y-5">
                      {/* First & Last Name Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">{language === 'en' ? 'First name' : 'الاسم الأول'}</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            placeholder={language === 'en' ? 'First name' : 'الاسم الأول'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Last name' : 'الاسم الأخير'}</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            placeholder={language === 'en' ? 'Last name' : 'الاسم الأخير'}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium mb-2">{contactData.form.email}</label>
                        <input 
                          type="email" 
                          className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                          placeholder="you@company.com"
                        />
                      </div>

                      {/* Company Size & Location Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Company size' : 'حجم الشركة'}</label>
                          <select className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none">
                            <option>{language === 'en' ? '1-10 people' : '1-10 موظف'}</option>
                            <option>{language === 'en' ? '11-50 people' : '11-50 موظف'}</option>
                            <option>{language === 'en' ? '51-200 people' : '51-200 موظف'}</option>
                            <option>{language === 'en' ? '200+ people' : '200+ موظف'}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Location' : 'الموقع'}</label>
                          <select className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none">
                            <option>🇸🇦 {language === 'en' ? 'Saudi Arabia' : 'المملكة العربية السعودية'}</option>
                            <option>🇦🇪 {language === 'en' ? 'UAE' : 'الإمارات'}</option>
                            <option>🇰🇼 {language === 'en' ? 'Kuwait' : 'الكويت'}</option>
                            <option>🇧🇭 {language === 'en' ? 'Bahrain' : 'البحرين'}</option>
                            <option>🇴🇲 {language === 'en' ? 'Oman' : 'عمان'}</option>
                            <option>🇶🇦 {language === 'en' ? 'Qatar' : 'قطر'}</option>
                            <option>🌍 {language === 'en' ? 'Other' : 'أخرى'}</option>
                          </select>
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Phone number' : 'رقم الهاتف'}</label>
                        <div className="flex gap-2">
                          <select className="px-3 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                            <option>SA +966</option>
                            <option>AE +971</option>
                            <option>KW +965</option>
                          </select>
                          <input 
                            type="tel" 
                            className="flex-1 px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            placeholder="+966566222179"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium mb-2">{language === 'en' ? 'Message' : 'الرسالة'}</label>
                        <textarea 
                          rows={4}
                          className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                          placeholder={language === 'en' ? 'Tell us about your engineering project...' : 'أخبرنا عن مشروعك الهندسي...'}
                        ></textarea>
                      </div>

                      {/* Services Interested In */}
                      <div>
                        <label className="block text-sm font-medium mb-3">{language === 'en' ? 'Services interested in' : 'الخدمات المهتم بها'}</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-primary border-input rounded focus:ring-primary" />
                            <span className="text-sm">{language === 'en' ? 'Find Engineers' : 'إيجاد مهندسين'}</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-primary border-input rounded focus:ring-primary" />
                            <span className="text-sm">{language === 'en' ? 'Post Projects' : 'نشر مشاريع'}</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-primary border-input rounded focus:ring-primary" />
                            <span className="text-sm">{language === 'en' ? 'Enterprise Solutions' : 'حلول المؤسسات'}</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-primary border-input rounded focus:ring-primary" />
                            <span className="text-sm">{language === 'en' ? 'Other' : 'أخرى'}</span>
                          </label>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button type="submit" size="lg" className="w-full text-base py-6">
                        {contactData.form.submit}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Trusted By Logos */}
            <div className="mt-8">
              <p className="text-xs text-muted-foreground text-center mb-4">{language === 'en' ? 'Trusted by leading companies' : 'موثوق به من قبل الشركات الرائدة'}</p>
              <div className="flex items-center justify-center space-x-6 opacity-40">
                <span className="text-xs font-semibold">ARAMCO</span>
                <span className="text-xs font-semibold">NEOM</span>
                <span className="text-xs font-semibold">PIF</span>
                <span className="text-xs font-semibold">SABIC</span>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{contactData.title}</h2>
              <p className="text-xl text-muted-foreground">{contactData.subtitle}</p>
            </div>

            <div className="space-y-6">
              {/* Quick Contact */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{language === 'en' ? 'Email Us' : 'راسلنا'}</h3>
                  <p className="text-muted-foreground">{language === 'en' ? 'Get in touch via email for detailed inquiries and support.' : 'تواصل معنا عبر البريد للاستفسارات والدعم.'}</p>
                  <a href={`mailto:${contactData.info.email}`} className="text-primary hover:underline mt-2 inline-block">{contactData.info.email}</a>
                </div>
              </div>

              {/* Phone Support */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{language === 'en' ? 'Call Us' : 'اتصل بنا'}</h3>
                  <p className="text-muted-foreground">{language === 'en' ? 'Speak directly with our support team for immediate assistance.' : 'تحدث مباشرة مع فريق الدعم للحصول على مساعدة فورية.'}</p>
                  <a href={`tel:${contactData.info.phone}`} className="text-primary hover:underline mt-2 inline-block">{contactData.info.phone}</a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{language === 'en' ? 'Visit Us' : 'زرنا'}</h3>
                  <p className="text-muted-foreground">{language === 'en' ? 'Find us in the heart of Saudi Arabia\'s engineering hub.' : 'تجدنا في قلب مركز الهندسة في المملكة.'}</p>
                  <p className="text-primary mt-2">{contactData.info.address}</p>
                </div>
              </div>

              {/* Live Chat */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{language === 'en' ? 'Live Chat' : 'دردشة مباشرة'}</h3>
                  <p className="text-muted-foreground">{language === 'en' ? 'Chat with us in real-time. Available 24/7 for instant support.' : 'تحدث معنا مباشرة. متاح على مدار الساعة للدعم الفوري.'}</p>
                  <Button className="mt-3" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Start Chat' : 'ابدأ المحادثة'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ContactSection };

