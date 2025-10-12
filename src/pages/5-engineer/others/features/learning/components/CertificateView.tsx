import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../1-HomePage/others/components/ui/avatar';
import { Separator } from '../../../../../1-HomePage/others/components/ui/separator';
import {
  Download,
  Share2,
  CheckCircle2,
  Award,
  Calendar,
  Clock,
  Star,
  ExternalLink,
  Eye,
  Print
} from 'lucide-react';

interface Certificate {
  id: string;
  courseTitle: string;
  studentName: string;
  instructorName: string;
  instructorAvatar: string;
  issueDate: string;
  completionDate: string;
  grade: number;
  totalHours: string;
  credentialId: string;
  verificationUrl: string;
  thumbnail: string;
  description: string;
  skills: string[];
  isVerified: boolean;
  downloadUrl: string;
  shareUrl: string;
}

interface CertificateViewProps {
  certificate: Certificate;
  onDownload: (certificateId: string) => void;
  onShare: (shareUrl: string) => void;
  onVerify: (verificationUrl: string) => void;
  onClose?: () => void;
}

export function CertificateView({ 
  certificate, 
  onDownload, 
  onShare, 
  onVerify, 
  onClose 
}: CertificateViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Certificate Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Certificate of Completion</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Credential ID: {certificate.credentialId}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {certificate.isVerified && (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={() => onShare(certificate.shareUrl)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" onClick={() => onDownload(certificate.id)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Certificate Display */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 text-center">
            {/* Certificate Header */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary p-4 rounded-full">
                  <Award className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-primary mb-2">Certificate of Completion</h1>
              <p className="text-lg text-muted-foreground">
                This certifies that
              </p>
            </div>

            {/* Student Name */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                {certificate.studentName}
              </h2>
              <p className="text-lg text-muted-foreground">
                has successfully completed the course
              </p>
            </div>

            {/* Course Title */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-primary mb-4">
                "{certificate.courseTitle}"
              </h3>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Completed on {formatDate(certificate.completionDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{certificate.totalHours} total hours</span>
                </div>
              </div>
            </div>

            {/* Instructor */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-2">Instructor</p>
              <div className="flex items-center justify-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={certificate.instructorAvatar} alt={certificate.instructorName} />
                  <AvatarFallback>{certificate.instructorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-lg font-medium">{certificate.instructorName}</span>
              </div>
            </div>

            {/* Grade and Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Final Grade</p>
                <div className="flex items-center justify-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold">{certificate.grade}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Skills Acquired</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {certificate.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {certificate.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{certificate.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p>Issued on {formatDate(certificate.issueDate)}</p>
                  <p>Credential ID: {certificate.credentialId}</p>
                </div>
                <div className="text-right">
                  <p>Verify at: learning.engineer-portal.com</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto text-primary"
                    onClick={() => onVerify(certificate.verificationUrl)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Verify Certificate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Details */}
      <Card>
        <CardHeader>
          <CardTitle>Certificate Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Course Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course Title:</span>
                  <span className="font-medium">{certificate.courseTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{certificate.totalHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completion Date:</span>
                  <span className="font-medium">{formatDate(certificate.completionDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grade:</span>
                  <span className="font-medium">{certificate.grade}%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Verification</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credential ID:</span>
                  <span className="font-medium font-mono text-xs">{certificate.credentialId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={certificate.isVerified ? "default" : "secondary"}>
                    {certificate.isVerified ? "Verified" : "Pending Verification"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issued:</span>
                  <span className="font-medium">{formatDate(certificate.issueDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Skills Demonstrated</h4>
            <div className="flex flex-wrap gap-2">
              {certificate.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Course Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {certificate.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => onDownload(certificate.id)}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline" onClick={() => onShare(certificate.shareUrl)}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Certificate
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Print className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" onClick={() => onVerify(certificate.verificationUrl)}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Verify Online
        </Button>
      </div>
    </div>
  );
}
