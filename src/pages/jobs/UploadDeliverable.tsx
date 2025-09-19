import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Image, File, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
}

export default function UploadDeliverable() {
  const [selectedJob, setSelectedJob] = useState('');
  const [deliverableType, setDeliverableType] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Mock job data - replace with real data from API
  const jobs = [
    { id: '1', title: 'Site Inspection - Al Olaya Project', status: 'in_progress' },
    { id: '2', title: 'Electrical Panel Upgrade', status: 'in_progress' },
    { id: '3', title: 'Structural Assessment Report', status: 'pending' },
  ];

  const deliverableTypes = [
    'Technical Report',
    'Site Photos',
    'CAD Drawings',
    'Inspection Checklist',
    'Progress Photos',
    'Test Results',
    'Compliance Certificate',
    'Other'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload process
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'success' }
              : f
          )
        );
      }, 2000);
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSubmit = async () => {
    if (!selectedJob || !deliverableType || uploadedFiles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a job, deliverable type, and upload at least one file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Deliverable Uploaded",
        description: "Your deliverable has been successfully uploaded and submitted for review.",
      });
      setIsUploading(false);
      // Reset form
      setSelectedJob('');
      setDeliverableType('');
      setDescription('');
      setUploadedFiles([]);
    }, 3000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Upload className="h-8 w-8 upload-deliverable-icon text-primary" />
          Upload Deliverable
        </h1>
        <p className="text-muted-foreground mt-1">
          Submit project deliverables and documentation for review.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Form */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Deliverable Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job">Select Job</Label>
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger className="shadow-sm">
                  <SelectValue placeholder="Choose a job..." />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map(job => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Deliverable Type</Label>
              <Select value={deliverableType} onValueChange={setDeliverableType}>
                <SelectTrigger className="shadow-sm">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {deliverableTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any additional notes about this deliverable..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="shadow-sm"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="files">Upload Files</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  id="files"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="files" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, XLS, JPG, PNG up to 10MB each
                  </p>
                </label>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={isUploading || uploadedFiles.length === 0}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md submit-deliverable-btn"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Submit Deliverable
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <File className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No files uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === 'uploading' && (
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      )}
                      {file.status === 'success' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="h-8 w-8 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Uploads */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Site Inspection Report.pdf</p>
                  <p className="text-xs text-muted-foreground">Al Olaya Project • 2 hours ago</p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">Approved</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Image className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Progress Photos.zip</p>
                  <p className="text-xs text-muted-foreground">Electrical Panel Upgrade • 1 day ago</p>
                </div>
              </div>
              <span className="text-sm text-yellow-600 font-medium">Under Review</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
