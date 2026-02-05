import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
 } from '@/components/ui/dialog';
 import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);
   const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
    if (user) {
      fetchReadNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setNotifications(data);
    }
  };

  const fetchReadNotifications = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_notification_reads')
      .select('notification_id')
      .eq('user_id', user.id);

    if (!error && data) {
      setReadIds(new Set(data.map(r => r.notification_id)));
    }
  };

  useEffect(() => {
    const unread = notifications.filter(n => !readIds.has(n.id)).length;
    setUnreadCount(unread);
  }, [notifications, readIds]);

  const markAsRead = async (notificationId: string) => {
    if (!user || readIds.has(notificationId)) return;

    const { error } = await supabase
      .from('user_notification_reads')
      .insert({ user_id: user.id, notification_id: notificationId });

    if (!error) {
      setReadIds(prev => new Set([...prev, notificationId]));
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    const unreadNotifications = notifications.filter(n => !readIds.has(n.id));
    if (unreadNotifications.length === 0) return;

    const inserts = unreadNotifications.map(n => ({
      user_id: user.id,
      notification_id: n.id,
    }));

    const { error } = await supabase
      .from('user_notification_reads')
      .insert(inserts);

    if (!error) {
      setReadIds(new Set(notifications.map(n => n.id)));
    }
  };

   const openNotification = (notification: Notification) => {
     markAsRead(notification.id);
     setSelectedNotification(notification);
     setIsOpen(false);
   };
 
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event':
        return 'bg-primary/20 text-primary';
      case 'update':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'announcement':
        return 'bg-amber-500/20 text-amber-600 dark:text-amber-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
     <>
       <Popover open={isOpen} onOpenChange={setIsOpen}>
         <PopoverTrigger asChild>
           <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
             <Bell className="h-5 w-5" />
             {unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                 {unreadCount > 9 ? '9+' : unreadCount}
               </span>
             )}
           </Button>
         </PopoverTrigger>
         <PopoverContent align="end" className="w-80 p-0">
           <div className="flex items-center justify-between p-3 border-b border-border">
             <h3 className="font-semibold text-foreground">Notifications</h3>
             {user && unreadCount > 0 && (
               <Button
                 variant="ghost"
                 size="sm"
                 className="text-xs text-primary hover:text-primary/80"
                 onClick={markAllAsRead}
               >
                 Mark all read
               </Button>
             )}
           </div>
           <ScrollArea className="h-[300px]">
             {notifications.length === 0 ? (
               <div className="p-4 text-center text-muted-foreground">
                 No notifications yet
               </div>
             ) : (
               <div className="divide-y divide-border">
                 {notifications.map((notification) => {
                   const isRead = readIds.has(notification.id);
                   return (
                     <div
                       key={notification.id}
                       className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                         !isRead && user ? 'bg-primary/5' : ''
                       }`}
                       onClick={() => openNotification(notification)}
                     >
                       <div className="flex items-start gap-2">
                         <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getTypeColor(notification.type)}`}>
                           {notification.type}
                         </span>
                         {!isRead && user && (
                           <span className="h-2 w-2 rounded-full bg-primary mt-1" />
                         )}
                       </div>
                       <h4 className="font-medium text-sm mt-1 text-foreground">{notification.title}</h4>
                       <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                         {notification.message}
                       </p>
                       <p className="text-xs text-muted-foreground mt-1">
                         {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                       </p>
                     </div>
                   );
                 })}
               </div>
             )}
           </ScrollArea>
         </PopoverContent>
       </Popover>
 
       <Dialog open={!!selectedNotification} onOpenChange={(open) => !open && setSelectedNotification(null)}>
         <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
           {selectedNotification && (
             <>
               <DialogHeader>
                 <div className="flex items-center gap-2 mb-2">
                   <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getTypeColor(selectedNotification.type)}`}>
                     {selectedNotification.type}
                   </span>
                   <span className="text-xs text-muted-foreground">
                     {formatDistanceToNow(new Date(selectedNotification.created_at), { addSuffix: true })}
                   </span>
                 </div>
                 <DialogTitle className="text-xl">{selectedNotification.title}</DialogTitle>
               </DialogHeader>
               <DialogDescription className="text-foreground text-base whitespace-pre-wrap leading-relaxed">
                 {selectedNotification.message}
               </DialogDescription>
             </>
           )}
         </DialogContent>
       </Dialog>
     </>
  );
};

export default NotificationBell;
