import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Heart, 
  Share, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  subtitle?: string;
  image?: string;
  icon?: React.ReactNode;
  badge?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'character' | 'campaign' | 'item' | 'tool';
  interactive?: boolean;
  loading?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  stats?: Array<{ label: string; value: string | number }>;
  metadata?: Record<string, any>;
}

const cardVariants = {
  default: "bg-card text-card-foreground border border-border shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/50",
  character: "bg-gradient-to-br from-primary/10 to-primary/5 text-primary-foreground border-primary/30 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300",
  campaign: "bg-gradient-to-br from-purple-10 to-blue-10 text-white border-purple/30 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300",
  item: "bg-gradient-to-br from-amber-10 to-orange-10 text-white border-amber/30 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300",
  tool: "bg-gradient-to-br from-green-10 to-emerald-10 text-white border-green/30 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
};

const EnhancedCard = ({
  title,
  description,
  subtitle,
  image,
  icon,
  badge,
  actions,
  footer,
  variant = 'default',
  interactive = true,
  loading = false,
  onClick,
  onEdit,
  onDelete,
  onFavorite,
  isFavorite = false,
  stats,
  metadata,
  className,
  children,
  ...props
}: EnhancedCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const renderStats = () => {
    if (!stats || stats.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-background/60 rounded text-xs">
            <span className="text-muted-foreground">{stat.label}:</span>
            <span className="font-medium text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderActions = () => {
    if (!actions && !onClick && !onEdit && !onDelete && !onFavorite) return null;

    return (
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          {actions}
          {onClick && (
            <Button 
              size="sm" 
              onClick={onClick}
              className="shrink-0"
            >
              View
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {onFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFavorite}
              className={cn(
                "shrink-0 transition-colors",
                isFavorite ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
            </Button>
          )}
          
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="shrink-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const cardContent = (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl",
        cardVariants[variant],
        interactive && "cursor-pointer group",
        loading && "opacity-70",
        className
      )}
      onClick={interactive ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        </div>
      )}

      {/* Background Pattern */}
      {variant !== 'default' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {icon && (
              <div className="flex-shrink-0 p-2 bg-background/60 rounded-lg">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {isFavorite && (
            <Star className="h-5 w-5 text-yellow-500 fill-current flex-shrink-0" />
          )}
        </div>

        {/* Image */}
        {image && (
          <div className="mb-4 -mx-6">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {!imageError ? (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/30">
                  <div className="text-center">
                    <div className="text-4xl text-muted-foreground mb-2">🖼️</div>
                    <p className="text-sm text-muted-foreground">Image unavailable</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
        )}

        {/* Stats */}
        {renderStats()}

        {/* Children */}
        {children}

        {/* Actions */}
        {renderActions()}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 bg-background/60 border-t border-border">
          {footer}
        </div>
      )}

      {/* Hover Overlay */}
      {interactive && (
        <div className={cn(
          "absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
          isHovered && "opacity-100"
        )}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Eye className="h-8 w-8 text-white/80" />
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );

  return cardContent;
};

export default EnhancedCard;
