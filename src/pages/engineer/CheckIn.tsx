import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Clock, Camera, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CheckIn() {
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { toast } = useToast();

  const handleCheckIn = async () => {
    if (!location.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter your current location to check in.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingIn(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Checked In Successfully",
        description: `You've been checked in at ${location}`,
      });
      setIsCheckingIn(false);
      setLocation('');
      setNotes('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="h-8 w-8 checkin-map-pin-icon text-primary" />
          Check In
        </h1>
        <p className="text-muted-foreground mt-1 checkin-subtitle">
          Record your location and update your work status.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Check In Form */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 checkin-card-title">
              <Clock className="h-5 w-5 text-primary" />
              Location Check In
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Current Location</Label>
              <Input
                id="location"
                placeholder="Enter your current work location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="shadow-sm hover:border-[var(--primary)] focus:border-[var(--primary)] hover:shadow-[0_0_0_1px_var(--primary)] focus:shadow-[0_0_0_1px_var(--primary)]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Work Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about your current work..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="shadow-sm hover:border-[var(--primary)] focus:border-[var(--primary)] hover:shadow-[0_0_0_1px_var(--primary)] focus:shadow-[0_0_0_1px_var(--primary)]"
                rows={3}
              />
            </div>

            <Button 
              onClick={handleCheckIn}
              disabled={isCheckingIn}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md checkin-btn"
            >
              {isCheckingIn ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Checking In...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Check In Now
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2 shadow-sm hover:border-[var(--primary)] hover:shadow-[0_0_0_1px_var(--primary)]">
              <Camera className="h-4 w-4" />
              Take Photo
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 shadow-sm hover:border-[var(--primary)] hover:shadow-[0_0_0_1px_var(--primary)]">
              <FileText className="h-4 w-4" />
              Upload Document
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 shadow-sm hover:border-[var(--primary)] hover:shadow-[0_0_0_1px_var(--primary)]">
              <MapPin className="h-4 w-4" />
              View Map
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Check-ins */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Al Olaya Project Site</p>
                <p className="text-sm text-muted-foreground">Today, 2:30 PM</p>
              </div>
              <span className="text-sm text-success font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">King Fahd District</p>
                <p className="text-sm text-muted-foreground">Yesterday, 4:15 PM</p>
              </div>
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
