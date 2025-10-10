import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Input } from "../../../../../1-HomePage/others/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "../../../../../1-HomePage/others/components/ui/dialog";
import { 
  Camera, 
  Upload, 
  Eye, 
  Trash2,
  Clock,
  Tag,
  Download,
  Grid3x3,
  Image as ImageIcon
} from "lucide-react";

interface Photo {
  id: string;
  url: string;
  timestamp: string;
  caption: string;
  category: "before" | "during" | "after" | "issue" | "safety";
}

interface EnhancedPhotoGalleryProps {
  photos: Photo[];
  onAddPhoto?: (photo: Photo) => void;
  onDeletePhoto?: (photoId: string) => void;
  maxPhotos?: number;
}

export function EnhancedPhotoGallery({ 
  photos: initialPhotos = [],
  onAddPhoto,
  onDeletePhoto,
  maxPhotos = 12
}: EnhancedPhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<Photo["category"]>("during");
  const [viewMode, setViewMode] = useState<"grid" | "gallery">("grid");

  const handleCapturePhoto = () => {
    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      url: `/placeholder-photo-${photos.length + 1}.jpg`,
      timestamp: new Date().toLocaleString("en-SA", {
        timeZone: "Asia/Riyadh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }),
      caption: caption || "Site documentation",
      category: category
    };

    setPhotos(prev => [...prev, newPhoto]);
    onAddPhoto?.(newPhoto);
    setCaption("");
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
    onDeletePhoto?.(photoId);
    setSelectedPhoto(null);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "before": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "during": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "after": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "issue": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "safety": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Photo Documentation
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {photos.length} / {maxPhotos}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "gallery" : "grid")}
              >
                {viewMode === "grid" ? <ImageIcon className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Photo Grid */}
          <div className={`grid ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1"} gap-4`}>
            {photos.map((photo) => (
              <div 
                key={photo.id}
                className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-primary/40" />
                </div>
                
                {/* Overlay Info */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white" />
                </div>

                {/* Timestamp Badge */}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-xs backdrop-blur-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {photo.timestamp.split(' ')[1]}
                  </Badge>
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className={`text-xs ${getCategoryColor(photo.category)}`}>
                    {photo.category}
                  </Badge>
                </div>

                {/* Caption */}
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2 truncate">
                    {photo.caption}
                  </div>
                )}
              </div>
            ))}

            {/* Add Photo Slots */}
            {Array.from({ length: Math.max(0, maxPhotos - photos.length) }, (_, index) => (
              <div 
                key={`empty-${index}`}
                className="aspect-square bg-muted/50 rounded-lg border-2 border-dashed border-border flex items-center justify-center"
              >
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
            ))}
          </div>

          {/* Capture Controls */}
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo Caption</label>
                <Input
                  placeholder="e.g., Foundation completed, Safety equipment..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Photo["category"])}
                >
                  <option value="before">Before Work</option>
                  <option value="during">During Work</option>
                  <option value="after">After Work</option>
                  <option value="issue">Issue/Problem</option>
                  <option value="safety">Safety Concern</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleCapturePhoto}
                disabled={photos.length >= maxPhotos}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                Capture Photo
              </Button>
              <Button 
                variant="outline"
                disabled={photos.length >= maxPhotos}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload from Gallery
              </Button>
            </div>

            {photos.length >= maxPhotos && (
              <p className="text-xs text-destructive text-center">
                Maximum {maxPhotos} photos reached. Delete a photo to add more.
              </p>
            )}
          </div>

          {/* Photo Stats */}
          <div className="grid grid-cols-5 gap-2">
            {["before", "during", "after", "issue", "safety"].map((cat) => {
              const count = photos.filter(p => p.category === cat).length;
              return (
                <div key={cat} className="text-center p-2 bg-muted/50 rounded">
                  <div className="text-lg font-bold">{count}</div>
                  <div className="text-xs text-muted-foreground capitalize">{cat}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Photo Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="space-y-4">
              {/* Photo Preview */}
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                <Camera className="w-24 h-24 text-primary/40" />
              </div>

              {/* Photo Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Timestamp</div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{selectedPhoto.timestamp}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Category</div>
                  <Badge variant="outline" className={getCategoryColor(selectedPhoto.category)}>
                    <Tag className="w-3 h-3 mr-1" />
                    {selectedPhoto.category}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Caption</div>
                <div className="p-3 bg-muted rounded-lg">
                  {selectedPhoto.caption || "No caption provided"}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => selectedPhoto && handleDeletePhoto(selectedPhoto.id)}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Photo
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button onClick={() => setSelectedPhoto(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

