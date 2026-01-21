import { useState } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useNotifications, type Notification } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const TYPE_ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

const TYPE_COLORS = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
};

const PRIORITY_COLORS = {
  low: 'bg-muted',
  normal: 'bg-background',
  high: 'bg-primary/10',
  urgent: 'bg-destructive/10',
};

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onRemove: (id: string) => void;
}

function NotificationItem({ notification, onMarkRead, onRemove }: NotificationItemProps) {
  const Icon = TYPE_ICONS[notification.type];
  const typeColor = TYPE_COLORS[notification.type];
  const priorityColor = PRIORITY_COLORS[notification.priority];

  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-all',
        !notification.read && 'bg-primary/5 border-primary/20',
        notification.read && 'bg-muted/30 border-border',
        priorityColor
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('flex-shrink-0 mt-0.5', typeColor)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={cn('font-semibold text-sm', !notification.read && 'font-bold')}>
              {notification.title}
            </h4>
            <div className="flex items-center gap-1 flex-shrink-0">
              {!notification.read && (
                <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onRemove(notification.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
          {notification.message && (
            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
          )}
          {notification.action && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                notification.action?.onClick();
                onMarkRead(notification.id);
              }}
            >
              {notification.action.label}
            </Button>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
            {notification.category && (
              <Badge variant="outline" className="text-xs">
                {notification.category}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    clearRead,
  } = useNotifications();

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="default">{unreadCount} unread</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Stay updated with your Ascendants and campaigns
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center gap-2 mt-4 mb-4">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          )}
          {readNotifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearRead}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </Button>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {unreadNotifications.length > 0 && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">Unread</h3>
                    {unreadNotifications.map(notification => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkRead={markAsRead}
                        onRemove={removeNotification}
                      />
                    ))}
                  </div>
                  {readNotifications.length > 0 && <Separator />}
                </>
              )}

              {readNotifications.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Read</h3>
                  {readNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkRead={markAsRead}
                      onRemove={removeNotification}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

