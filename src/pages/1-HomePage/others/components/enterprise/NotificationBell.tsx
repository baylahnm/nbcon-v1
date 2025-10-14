import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { useTeamStore } from '../../../../2-auth/others/hooks/useTeamStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function NotificationBell() {
  const { 
    getUnreadNotifications, 
    markNotificationRead, 
    clearNotifications,
    notificationCount,
    setSelectedProject
  } = useTeamStore();
  
  const unreadNotifications = getUnreadNotifications();

  // Show toast for new notifications
  useEffect(() => {
    if (unreadNotifications.length > 0) {
      const latest = unreadNotifications[0];
      if (latest && new Date().getTime() - new Date(latest.createdAt).getTime() < 5000) {
        toast(latest.payload.title, {
          description: latest.payload.message,
          action: {
            label: 'View',
            onClick: () => {
              if (latest.payload.projectId) {
                setSelectedProject(latest.payload.projectId);
              }
              markNotificationRead(latest.id);
            }
          }
        });
      }
    }
  }, [unreadNotifications.length]);

  const handleNotificationClick = (notification: any) => {
    markNotificationRead(notification.id);
    if (notification.payload.projectId) {
      setSelectedProject(notification.payload.projectId);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <AnimatePresence>
            {notificationCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2"
              >
                <Badge variant="destructive" className="h-5 min-w-5 text-xs flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadNotifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearNotifications}
              className="text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {unreadNotifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No new notifications
            </div>
          ) : (
            <div className="space-y-1">
              {unreadNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 hover:bg-accent cursor-pointer border-b border-border/50"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{notification.payload.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.payload.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
