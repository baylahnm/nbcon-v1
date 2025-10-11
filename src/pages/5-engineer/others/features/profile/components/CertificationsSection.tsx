import { Award, CheckCircle2, AlertCircle, Clock, Plus, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';

interface CertificationsSectionProps {
  isEditMode?: boolean;
}

interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  credentialId?: string;
  issueDate: string;
  expiryDate?: string;
  certificateUrl?: string;
  verificationStatus: 'verified' | 'pending' | 'not_verified';
  isFeatured: boolean;
}

export function CertificationsSection({ isEditMode = false }: CertificationsSectionProps) {
  // Mock data
  const certifications: Certification[] = [
    {
      id: '1',
      name: 'Saudi Council of Engineers (SCE) License',
      issuingOrganization: 'Saudi Council of Engineers',
      credentialId: 'SCE-12345',
      issueDate: '2017-03-15',
      expiryDate: undefined,
      verificationStatus: 'verified',
      isFeatured: true
    },
    {
      id: '2',
      name: 'Project Management Professional (PMP)',
      issuingOrganization: 'Project Management Institute (PMI)',
      credentialId: 'PMP-1234567',
      issueDate: '2020-01-20',
      expiryDate: '2026-01-20',
      certificateUrl: '#',
      verificationStatus: 'verified',
      isFeatured: true
    },
    {
      id: '3',
      name: 'LEED Accredited Professional',
      issuingOrganization: 'U.S. Green Building Council',
      credentialId: 'LEED-AP-45678',
      issueDate: '2019-06-10',
      expiryDate: undefined,
      verificationStatus: 'verified',
      isFeatured: false
    },
    {
      id: '4',
      name: 'Autodesk Revit Certified Professional',
      issuingOrganization: 'Autodesk',
      credentialId: 'ACP-REV-2023',
      issueDate: '2023-02-15',
      expiryDate: '2025-02-15',
      verificationStatus: 'not_verified',
      isFeatured: false
    }
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      verified: {
        icon: CheckCircle2,
        label: 'Verified',
        color: 'bg-green-500/10 text-green-600 ring-green-500/20 border-green-500/20'
      },
      pending: {
        icon: Clock,
        label: 'Pending Verification',
        color: 'bg-amber-500/10 text-amber-600 ring-amber-500/20 border-amber-500/20'
      },
      not_verified: {
        icon: AlertCircle,
        label: 'Not Verified',
        color: 'bg-gray-500/10 text-gray-600 ring-gray-500/20 border-gray-500/20'
      }
    };
    return configs[status as keyof typeof configs];
  };

  const isExpiring = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const monthsUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsUntilExpiry < 6 && monthsUntilExpiry > 0;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <Card className="group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-2.5 rounded-xl ring-1 ring-amber-500/20 group-hover:scale-110 transition-transform">
            <Award className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-base font-bold">Certifications & Licenses</h2>
            <p className="text-xs text-muted-foreground">{certifications.length} credentials</p>
          </div>
        </div>
        {isEditMode && (
          <Button size="sm" variant="outline" className="text-xs h-8">
            <Plus className="h-3 w-3 mr-1.5" />
            Add Certification
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {certifications.map((cert) => {
          const statusConfig = getStatusConfig(cert.verificationStatus);
          const StatusIcon = statusConfig.icon;
          const expiring = isExpiring(cert.expiryDate);

          return (
            <div
              key={cert.id}
              className={`p-5 rounded-lg border transition-all duration-300 ${
                cert.isFeatured
                  ? 'border-primary/30 bg-primary/5 shadow-sm'
                  : 'border-border/40 bg-card hover:border-primary/20 hover:shadow-md'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-1">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">{cert.issuingOrganization}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${statusConfig.color} border ring-1 text-xs`}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-2">
                {cert.credentialId && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Credential ID:</span>
                    <span className="text-xs font-mono">{cert.credentialId}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div>
                    <span className="mr-1">Issued:</span>
                    <span className="font-medium">{formatDate(cert.issueDate)}</span>
                  </div>
                  {cert.expiryDate && (
                    <div className={expiring ? 'text-amber-600 font-medium' : ''}>
                      <span className="mr-1">Expires:</span>
                      <span className="font-medium">{formatDate(cert.expiryDate)}</span>
                      {expiring && <span className="ml-1.5">⚠️ Expiring Soon</span>}
                    </div>
                  )}
                  {!cert.expiryDate && (
                    <div className="text-green-600 font-medium">
                      No Expiration
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/30">
                {cert.certificateUrl && (
                  <Button size="sm" variant="ghost" className="text-xs h-7 px-2">
                    <ExternalLink className="h-3 w-3 mr-1.5" />
                    View Certificate
                  </Button>
                )}
                {cert.verificationStatus === 'verified' && cert.issuingOrganization.includes('PMI') && (
                  <Button size="sm" variant="ghost" className="text-xs h-7 px-2">
                    <ExternalLink className="h-3 w-3 mr-1.5" />
                    Verify on PMI.org
                  </Button>
                )}
                {isEditMode && (
                  <Button size="sm" variant="ghost" className="text-xs h-7 px-2 ml-auto text-red-600 hover:text-red-700 hover:bg-red-500/10">
                    Remove
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

