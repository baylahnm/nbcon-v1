import { Mail, Phone, Globe, Linkedin, Copy, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';

interface ContactInfoCardProps {
  email: string | null;
  phone: string | null;
  isOwner?: boolean;
}

export function ContactInfoCard({ email, phone, isOwner = true }: ContactInfoCardProps) {
  // Use real Supabase data
  const contact = {
    email: email || 'Not provided',
    phone: phone || 'Not provided',
    website: 'www.yoursite.com', // Not tracked yet
    linkedinUrl: 'linkedin.com/in/yourprofile', // Not tracked yet
    visibility: {
      showEmail: !!email,
      showPhone: !!phone,
      showWebsite: false
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // Toast notification would go here
    console.log(`Copied ${label} to clipboard`);
  };

  const contactItems = [
    {
      icon: Mail,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      visible: contact.visibility.showEmail
    },
    {
      icon: Phone,
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone}`,
      visible: contact.visibility.showPhone
    },
    {
      icon: Globe,
      label: 'Website',
      value: contact.website,
      href: `https://${contact.website}`,
      visible: contact.visibility.showWebsite
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: contact.linkedinUrl,
      href: `https://${contact.linkedinUrl}`,
      visible: true
    }
  ];

  return (
    <Card className="gap-0 border-border/50 sticky top-[340px]">
      <CardHeader className="p-5 pb-3 border-b border-border/40">
        <h3 className="text-base font-bold">Contact Information</h3>
      </CardHeader>

      <CardContent className="p-5 space-y-3 bg-background rounded-b-xl">
        {contactItems.map((item) => {
          const Icon = item.icon;
          
          if (!item.visible && !isOwner) return null;

          return (
            <div 
              key={item.label}
              className="group/contact flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {/* Icon */}
              <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20 flex-shrink-0">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                {item.visible ? (
                  <a 
                    href={item.href}
                    target={item.label === 'Website' || item.label === 'LinkedIn' ? '_blank' : undefined}
                    rel={item.label === 'Website' || item.label === 'LinkedIn' ? 'noopener noreferrer' : undefined}
                    className="text-xs font-medium text-primary hover:underline truncate block"
                  >
                    {item.value}
                  </a>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <EyeOff className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Hidden</span>
                  </div>
                )}
              </div>

              {/* Copy Button */}
              {item.visible && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(item.value, item.label)}
                  className="h-7 w-7 p-0 opacity-0 group-hover/contact:opacity-100 transition-opacity"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          );
        })}

        {/* Privacy Note for Owner */}
        {isOwner && (
          <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/20">
            <div className="flex items-start gap-2">
              <Eye className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Manage what's visible on your profile in Settings → Privacy
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

