import { useState, useRef } from "react";
import { 
  Upload,
  FileText,
  Image,
  Video,
  Archive,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  User,
  Calendar,
  Target,
  DollarSign,
  Eye,
  Download,
  Trash2,
  RefreshCw,
  Shield,
  Star,
  MessageSquare,
  FileCheck,
  Send,
  X,
  Plus,
  Paperclip,
  CloudUpload,
  HardDrive,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  value: string;
  status: "in-progress" | "review" | "completed";
  completionRate: number;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  value: string;
  status: "pending" | "in-progress" | "submitted" | "approved" | "rejected";
  deliverables: string[];
  submittedFiles?: UploadedFile[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  status: "uploading" | "uploaded" | "processing" | "approved" | "rejected";
  progress?: number;
  comments?: string;
  version: number;
}

const sampleProjects: Project[] = [
  {
    id: "1",
    name: "NEOM Smart City Infrastructure Assessment",
    client: "NEOM Development Company",
    location: "NEOM, Tabuk Province", 
    value: "185,000 SAR",
    status: "in-progress",
    completionRate: 65,
    milestones: [
      {
        id: "m1",
        name: "Initial Site Survey",
        description: "Comprehensive site assessment and preliminary engineering report",
        dueDate: "2024-02-15",
        value: "45,000 SAR",
        status: "approved",
        deliverables: ["Site Survey Report", "Geotechnical Analysis", "Environmental Impact Assessment"]
      },
      {
        id: "m2", 
        name: "Infrastructure Design Phase 1",
        description: "Detailed engineering designs for smart infrastructure components",
        dueDate: "2024-03-20",
        value: "75,000 SAR",
        status: "in-progress",
        deliverables: ["Architectural Drawings", "Structural Calculations", "MEP Designs", "Smart Systems Integration Plan"]
      },
      {
        id: "m3",
        name: "Final Implementation Plan",
        description: "Complete implementation strategy and project handover documentation",
        dueDate: "2024-04-30",
        value: "65,000 SAR", 
        status: "pending",
        deliverables: ["Implementation Timeline", "Quality Assurance Plan", "Handover Documentation"]
      }
    ]
  },
  {
    id: "2",
    name: "Aramco Refinery Mechanical Systems Upgrade",
    client: "Saudi Aramco",
    location: "Ras Tanura, Eastern Province",
    value: "320,000 SAR",
    status: "in-progress",
    completionRate: 40,
    milestones: [
      {
        id: "m4",
        name: "System Analysis & Design",
        description: "Analysis of existing mechanical systems and upgrade design",
        dueDate: "2024-02-28",
        value: "120,000 SAR",
        status: "submitted",
        deliverables: ["System Analysis Report", "Upgrade Design Specifications", "Safety Assessment"]
      },
      {
        id: "m5",
        name: "Implementation Phase",
        description: "Detailed implementation plans and quality control procedures",
        dueDate: "2024-04-15",
        value: "200,000 SAR",
        status: "pending",
        deliverables: ["Implementation Plan", "Quality Control Procedures", "Safety Protocols"]
      }
    ]
  },
  {
    id: "3",
    name: "Red Sea Development Marina Infrastructure",
    client: "Red Sea Global",
    location: "Red Sea Coast, Tabuk",
    value: "280,000 SAR",
    status: "in-progress",
    completionRate: 30,
    milestones: [
      {
        id: "m6",
        name: "Marine Engineering Assessment",
        description: "Comprehensive marine infrastructure and environmental analysis",
        dueDate: "2024-03-10",
        value: "85,000 SAR",
        status: "in-progress",
        deliverables: ["Marine Survey Report", "Environmental Impact Study", "Wave Analysis"]
      },
      {
        id: "m7",
        name: "Design & Engineering Phase",
        description: "Complete marina design with berthing and utility systems",
        dueDate: "2024-05-15",
        value: "195,000 SAR",
        status: "pending",
        deliverables: ["Marina Layout Design", "Berthing System Plans", "Utility Infrastructure Design"]
      }
    ]
  }
];

const acceptedFileTypes = [
  { type: "pdf", label: "PDF Documents", icon: FileText, accept: ".pdf" },
  { type: "dwg", label: "AutoCAD Drawings", icon: Target, accept: ".dwg,.dxf" },
  { type: "image", label: "Images", icon: Image, accept: ".jpg,.jpeg,.png,.gif,.bmp" },
  { type: "video", label: "Videos", icon: Video, accept: ".mp4,.avi,.mov,.wmv" },
  { type: "office", label: "Office Documents", icon: FileText, accept: ".doc,.docx,.xls,.xlsx,.ppt,.pptx" },
  { type: "archive", label: "Compressed Files", icon: Archive, accept: ".zip,.rar,.7z" }
];

export function UploadDeliverableContent() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [deliverableNotes, setDeliverableNotes] = useState("");
  const [qualityChecklist, setQualityChecklist] = useState({
    saudiStandards: false,
    technicalAccuracy: false,
    completeness: false,
    clientRequirements: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || !selectedMilestone) return;

    Array.from(files).forEach((file, index) => {
      const fileId = `file-${Date.now()}-${index}`;
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        status: "uploading",
        progress: 0,
        version: 1
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate file upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === fileId 
                ? { ...f, status: "uploaded", progress: 100 }
                : f
            )
          );
        }
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }, 200);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const { [fileId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return FileText;
      case 'dwg':
      case 'dxf': return Target;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp': return Image;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv': return Video;
      case 'zip':
      case 'rar':
      case '7z': return Archive;
      default: return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-success/10 text-success border-success/20";
      case "rejected": return "bg-destructive/10 text-destructive border-destructive/20";
      case "submitted": return "bg-info/10 text-info border-info/20";
      case "in-progress": return "bg-warning/10 text-warning border-warning/20";
      case "pending": return "bg-muted text-muted-foreground border-sidebar-border";
      default: return "bg-muted text-muted-foreground border-sidebar-border";
    }
  };

  const handleSubmitDeliverable = async () => {
    if (!selectedProject || !selectedMilestone || uploadedFiles.length === 0) return;
    
    setIsSubmitting(true);
    
    // Simulate submission process
    setTimeout(() => {
      // Update milestone status
      const updatedProjects = sampleProjects.map(project => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            milestones: project.milestones.map(milestone => {
              if (milestone.id === selectedMilestone.id) {
                return {
                  ...milestone,
                  status: "submitted" as const,
                  submittedFiles: uploadedFiles
                };
              }
              return milestone;
            })
          };
        }
        return project;
      });
      
      setIsSubmitting(false);
      // In a real app, you would update the global state here
    }, 2000);
  };

  const allQualityItemsChecked = Object.values(qualityChecklist).every(Boolean);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Deliverable
            </h1>
            <p className="text-muted-foreground mt-1">
              Submit milestone deliverables for Saudi engineering projects
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              SCE Compliant
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <FileCheck className="w-3 h-3" />
              Quality Assured
            </Badge>
          </div>
        </div>
      </div>

      {/* Project Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Select Project & Milestone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Project</Label>
              <Select 
                value={selectedProject?.id || ""} 
                onValueChange={(value) => {
                  const project = sampleProjects.find(p => p.id === value);
                  setSelectedProject(project || null);
                  setSelectedMilestone(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select active project" />
                </SelectTrigger>
                <SelectContent>
                  {sampleProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <span>{project.name}</span>
                        <Badge variant="outline" className={`ml-2 ${getStatusColor(project.status)} border`}>
                          {project.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Milestone</Label>
              <Select 
                value={selectedMilestone?.id || ""} 
                onValueChange={(value) => {
                  const milestone = selectedProject?.milestones.find(m => m.id === value);
                  setSelectedMilestone(milestone || null);
                }}
                disabled={!selectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select milestone" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProject?.milestones.map((milestone) => (
                    <SelectItem key={milestone.id} value={milestone.id}>
                      <div className="flex items-center gap-2">
                        <span>{milestone.name}</span>
                        <Badge variant="outline" className={`ml-2 ${getStatusColor(milestone.status)} border`}>
                          {milestone.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedProject && (
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Client: {selectedProject.client}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Location: {selectedProject.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Total Value: {selectedProject.value}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Completion: {selectedProject.completionRate}%</span>
                <Progress value={selectedProject.completionRate} className="flex-1 max-w-32" />
              </div>
            </div>
          )}

          {selectedMilestone && (
            <div className="p-4 bg-info/10 rounded-lg border border-info/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{selectedMilestone.name}</h4>
                <Badge className={getStatusColor(selectedMilestone.status)}>
                  {selectedMilestone.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{selectedMilestone.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {selectedMilestone.dueDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>Value: {selectedMilestone.value}</span>
                </div>
              </div>
              <div>
                <h5 className="font-medium mb-2">Required Deliverables:</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedMilestone.deliverables.map((deliverable, index) => (
                    <Badge key={index} variant="outline">{deliverable}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedMilestone && (
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">File Upload</TabsTrigger>
            <TabsTrigger value="quality">Quality Check</TabsTrigger>
            <TabsTrigger value="submit">Review & Submit</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* File Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudUpload className="w-5 h-5" />
                  Upload Files
                  <Badge variant="secondary">{uploadedFiles.length} Files</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drag & Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <CloudUpload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Drop files here or click to browse</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Support for PDF, DWG, Images, Videos, Office documents, and compressed files
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Select Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept={acceptedFileTypes.map(t => t.accept).join(',')}
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                </div>

                {/* Accepted File Types */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {acceptedFileTypes.map((fileType) => {
                    const Icon = fileType.icon;
                    return (
                      <div key={fileType.type} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{fileType.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <Separator />
                    <h4 className="font-medium">Uploaded Files</h4>
                    {uploadedFiles.map((file) => {
                      const Icon = getFileIcon(file.name);
                      const progress = uploadProgress[file.id] || 0;
                      
                      return (
                        <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Icon className="w-8 h-8 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium truncate">{file.name}</h5>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {formatFileSize(file.size)}
                                </span>
                                <Badge className={getStatusColor(file.status)}>
                                  {file.status}
                                </Badge>
                              </div>
                            </div>
                            {file.status === "uploading" && (
                              <div className="mt-2">
                                <Progress value={progress} className="h-2" />
                                <div className="text-xs text-muted-foreground mt-1">
                                  {Math.round(progress)}% uploaded
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFile(file.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            {/* Quality Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Quality Assurance Checklist
                  <Badge 
                    variant={allQualityItemsChecked ? "default" : "secondary"}
                    className={allQualityItemsChecked ? "bg-green-600" : ""}
                  >
                    {Object.values(qualityChecklist).filter(Boolean).length}/4 Complete
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      key: 'saudiStandards', 
                      label: 'Saudi Engineering Standards Compliance (SCE)', 
                      description: 'All designs comply with Saudi Building Code and SCE regulations'
                    },
                    { 
                      key: 'technicalAccuracy', 
                      label: 'Technical Accuracy Verification', 
                      description: 'All calculations, drawings, and specifications have been verified'
                    },
                    { 
                      key: 'completeness', 
                      label: 'Deliverable Completeness', 
                      description: 'All required documents and files are included as per milestone requirements'
                    },
                    { 
                      key: 'clientRequirements', 
                      label: 'Client Requirements Fulfillment', 
                      description: 'All client-specific requirements and specifications have been addressed'
                    }
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <Checkbox
                        id={key}
                        checked={qualityChecklist[key as keyof typeof qualityChecklist]}
                        onCheckedChange={(checked) => 
                          setQualityChecklist(prev => ({
                            ...prev,
                            [key]: checked as boolean
                          }))
                        }
                      />
                      <div className="space-y-1 flex-1">
                        <Label htmlFor={key} className="text-sm font-medium cursor-pointer">
                          {label}
                        </Label>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Deliverable Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add notes about the deliverable, any special considerations, changes from original scope, or instructions for the client..."
                  value={deliverableNotes}
                  onChange={(e) => setDeliverableNotes(e.target.value)}
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submit" className="space-y-6">
            {/* Submission Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Submission Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Project</Label>
                      <p className="font-medium">{selectedProject?.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Milestone</Label>
                      <p className="font-medium">{selectedMilestone?.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Due Date</Label>
                      <p className="font-medium">{selectedMilestone?.dueDate}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Files Uploaded</Label>
                      <p className="font-medium">{uploadedFiles.length} files</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Total Size</Label>
                      <p className="font-medium">
                        {formatFileSize(uploadedFiles.reduce((total, file) => total + file.size, 0))}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Milestone Value</Label>
                      <p className="font-medium">{selectedMilestone?.value}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Validation Status */}
                <div className="space-y-3">
                  <Label>Submission Readiness</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {uploadedFiles.length > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm">Files uploaded: {uploadedFiles.length > 0 ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {allQualityItemsChecked ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm">Quality checklist: {allQualityItemsChecked ? 'Complete' : 'Incomplete'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Saudi standards compliance: Verified</span>
                    </div>
                  </div>
                </div>

                {deliverableNotes && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm text-muted-foreground">Notes</Label>
                      <p className="text-sm mt-1 p-3 bg-muted rounded">{deliverableNotes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Submit Actions */}
            <Card>
              <CardContent className="pt-6">
                {uploadedFiles.length === 0 || !allQualityItemsChecked ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Please upload files and complete the quality checklist before submitting.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Ready to submit deliverable. Once submitted, the client will be notified for review.
                      </AlertDescription>
                    </Alert>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="lg"
                      disabled={isSubmitting}
                      onClick={handleSubmitDeliverable}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Submitting Deliverable...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Deliverable for Review
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Recent Submissions */}
      {!selectedMilestone && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { 
                  date: "2024-01-12", 
                  project: "NEOM Smart City", 
                  milestone: "Initial Site Survey", 
                  status: "approved",
                  value: "45,000 SAR" 
                },
                { 
                  date: "2024-01-08", 
                  project: "Red Sea Marina", 
                  milestone: "Environmental Assessment", 
                  status: "submitted",
                  value: "32,000 SAR" 
                },
                { 
                  date: "2024-01-05", 
                  project: "Aramco Refinery", 
                  milestone: "System Analysis", 
                  status: "in-progress",
                  value: "120,000 SAR" 
                }
              ].map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">{record.milestone}</div>
                    <div className="text-sm text-muted-foreground">{record.project} • {record.date}</div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="text-sm font-medium">{record.value}</div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
