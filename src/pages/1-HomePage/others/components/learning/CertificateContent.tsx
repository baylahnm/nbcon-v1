import { useState } from "react";
import { 
  ArrowLeft,
  Download,
  Share2,
  Award,
  Calendar,
  User,
  Building,
  CheckCircle,
  ExternalLink,
  Mail,
  Linkedin,
  Twitter,
  Link,
  Printer,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

interface CertificateContentProps {
  certificateId: string;
  certificateTitle: string;
  onBack: () => void;
}

const getCertificateData = (certificateId: string) => {
  const certificates = {
    'cert-1': {
      id: 'cert-1',
      title: 'NEOM Smart City Infrastructure Design',
      type: 'Course Completion Certificate',
      recipientName: 'Current User',
      issuer: 'nbcon Engineering Academy',
      issuerLogo: '/nbcon-logo.png',
      completionDate: '2024-01-15',
      issuedDate: '2024-01-16',
      certificateNumber: 'NBC-SCI-2024-001247',
      instructor: 'Dr. Ahmad Al-Rashid',
      courseHours: 32,
      grade: 'A',
      finalScore: 92,
      skills: [
        'Smart City Infrastructure Design',
        'IoT Integration in Urban Planning',
        'Sustainable Construction Methods',
        'NEOM Project Standards',
        'BIM for Smart Cities'
      ],
      credentialUrl: 'https://nbcon.sa/verify/NBC-SCI-2024-001247',
      isVerified: true,
      sceCredits: 32,
      validUntil: '2027-01-15',
      description: 'This certificate verifies that the recipient has successfully completed the NEOM Smart City Infrastructure Design course and demonstrated proficiency in smart city engineering principles, sustainable construction methods, and advanced urban planning technologies.',
      verification: {
        blockchain: true,
        qrCode: 'https://verify.nbcon.sa/NBC-SCI-2024-001247',
        digitalSignature: true
      }
    },
    'cert-2': {
      id: 'cert-2',
      title: 'Saudi Megaproject Engineering Specialist',
      type: 'Professional Learning Path Certificate',
      recipientName: 'Current User',
      issuer: 'nbcon Engineering Academy',
      issuerLogo: '/nbcon-logo.png',
      completionDate: '2024-03-20',
      issuedDate: '2024-03-21',
      certificateNumber: 'NBC-SMES-2024-000456',
      instructor: 'Multiple Instructors',
      courseHours: 120,
      grade: 'A+',
      finalScore: 96,
      skills: [
        'Megaproject Management',
        'Smart City Infrastructure',
        'Sustainable Tourism Development',
        'Entertainment Engineering',
        'Vision 2030 Compliance'
      ],
      credentialUrl: 'https://nbcon.sa/verify/NBC-SMES-2024-000456',
      isVerified: true,
      sceCredits: 120,
      validUntil: '2027-03-20',
      description: 'This advanced certificate confirms mastery of engineering principles and practices for Saudi Arabia\'s Vision 2030 megaprojects, including NEOM, The Red Sea Project, and QIDDIYA.',
      verification: {
        blockchain: true,
        qrCode: 'https://verify.nbcon.sa/NBC-SMES-2024-000456',
        digitalSignature: true
      }
    }
  };
  
  return certificates[certificateId as keyof typeof certificates] || certificates['cert-1'];
};

export function CertificateContent({ certificateId, certificateTitle, onBack }: CertificateContentProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  
  const certificate = getCertificateData(certificateId);

  const handleDownload = (format: 'pdf' | 'png') => {
    // In real implementation, this would generate and download the certificate
    toast.success(`Certificate downloaded as ${format.toUpperCase()}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (platform: string) => {
    const shareText = `I just completed "${certificate.title}" and earned my certificate! #Engineering #ProfessionalDevelopment #Vision2030`;
    const shareUrl = certificate.credentialUrl;
    
    let url = '';
    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent('My Professional Certificate')}&body=${encodeURIComponent(`${shareText}\n\nVerify at: ${shareUrl}`)}`;
        break;
      default:
        navigator.clipboard.writeText(shareUrl);
        toast.success('Certificate link copied to clipboard');
        return;
    }
    
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleEmailShare = () => {
    if (shareEmail) {
      // In real implementation, this would send an email
      toast.success(`Certificate shared with ${shareEmail}`);
      setShareEmail('');
      setShareDialogOpen(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning
          </Button>
          <div className="text-sm text-gray-500">
            Learning &gt; Certificates &gt; {certificate.title}
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Certificate Display */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-0">
                {/* Certificate */}
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-12 text-center relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="grid grid-cols-12 h-full">
                      {[...Array(144)].map((_, i) => (
                        <div key={i} className="border border-info/30 flex items-center justify-center">
                          <Award className="w-4 h-4" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-teal-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">nb</span>
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-bold text-gray-900">nbcon</div>
                        <div className="text-sm text-gray-600">Engineering Academy</div>
                      </div>
                    </div>

                    {/* Certificate Title */}
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h1>
                      <p className="text-gray-600">This is to certify that</p>
                    </div>

                    {/* Recipient Name */}
                    <div className="mb-8">
                      <div className="text-4xl font-bold text-teal-700 mb-2">{certificate.recipientName}</div>
                      <div className="w-32 h-1 bg-teal-600 mx-auto"></div>
                    </div>

                    {/* Course Details */}
                    <div className="mb-8">
                      <p className="text-lg text-gray-600 mb-2">has successfully completed</p>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{certificate.title}</h2>
                      <div className="grid grid-cols-2 gap-8 text-sm text-gray-600">
                        <div>
                          <div className="font-medium">Course Duration</div>
                          <div>{certificate.courseHours} Hours</div>
                        </div>
                        <div>
                          <div className="font-medium">Final Grade</div>
                          <div className="flex items-center gap-1">
                            {certificate.grade}
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Completion Date */}
                    <div className="mb-8">
                      <p className="text-gray-600">Completed on</p>
                      <p className="text-lg font-medium text-gray-900">
                        {new Date(certificate.completionDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-sidebar-border">
                      <div className="text-center">
                        <div className="w-24 h-px bg-gray-400 mx-auto mb-2"></div>
                        <div className="text-sm font-medium text-gray-900">{certificate.instructor}</div>
                        <div className="text-xs text-gray-600">Course Instructor</div>
                      </div>
                      <div className="text-center">
                        <div className="w-24 h-px bg-gray-400 mx-auto mb-2"></div>
                        <div className="text-sm font-medium text-gray-900">nbcon Academy</div>
                        <div className="text-xs text-gray-600">Issuing Authority</div>
                      </div>
                    </div>

                    {/* Certificate Number */}
                    <div className="mt-6 pt-6 border-t border-sidebar-border">
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                        <span>Certificate ID: {certificate.certificateNumber}</span>
                        <span>•</span>
                        <span>Issued: {new Date(certificate.issuedDate).toLocaleDateString()}</span>
                        {certificate.verification.blockchain && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <span>Blockchain Verified</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Certificate Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => handleDownload('pdf')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleDownload('png')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
                <Button variant="outline" className="w-full" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print Certificate
                </Button>
                <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Certificate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share Certificate</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={() => handleShare('linkedin')}>
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                        <Button variant="outline" onClick={() => handleShare('twitter')}>
                          <Twitter className="w-4 h-4 mr-2" />
                          Twitter
                        </Button>
                        <Button variant="outline" onClick={() => handleShare('email')}>
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                        <Button variant="outline" onClick={() => handleShare('copy')}>
                          <Link className="w-4 h-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label htmlFor="share-email">Send via Email</Label>
                        <div className="flex gap-2">
                          <Input
                            id="share-email"
                            type="email"
                            placeholder="Enter email address"
                            value={shareEmail}
                            onChange={(e) => setShareEmail(e.target.value)}
                          />
                          <Button onClick={handleEmailShare}>Send</Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Certificate Details */}
            <Card>
              <CardHeader>
                <CardTitle>Certificate Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium">Type</div>
                      <div className="text-gray-600">{certificate.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium">Completion Date</div>
                      <div className="text-gray-600">
                        {new Date(certificate.completionDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium">Instructor</div>
                      <div className="text-gray-600">{certificate.instructor}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium">Issuer</div>
                      <div className="text-gray-600">{certificate.issuer}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="font-medium mb-2">Performance</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Final Score</span>
                      <span className="font-medium">{certificate.finalScore}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Grade</span>
                      <Badge variant="secondary">{certificate.grade}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Course Hours</span>
                      <span className="font-medium">{certificate.courseHours}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>SCE Credits</span>
                      <span className="font-medium">{certificate.sceCredits}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Gained */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Validated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {certificate.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Verification */}
            <Card>
              <CardHeader>
                <CardTitle>Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Certificate verified</span>
                  </div>
                  {certificate.verification.blockchain && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Blockchain secured</span>
                    </div>
                  )}
                  {certificate.verification.digitalSignature && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Digitally signed</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">Certificate ID</div>
                    <div className="text-sm font-mono bg-gray-50 p-2 rounded text-gray-800">
                      {certificate.certificateNumber}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Verify Online
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}