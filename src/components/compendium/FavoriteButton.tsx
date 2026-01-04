import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useUserFavorites';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FavoriteButtonProps {
  entryType: string;
  entryId: string;
  className?: string;
  showLabel?: boolean;
}

export function FavoriteButton({ entryType, entryId, className, showLabel = false }: FavoriteButtonProps) {
  const { data: isFavorited = false, isLoading } = useIsFavorite(entryType, entryId);
  const toggleFavorite = useToggleFavorite();
  const { toast } = useToast();

  const handleToggle = async () => {
    try {
      const result = await toggleFavorite.mutateAsync({ entryType, entryId });
      toast({
        title: result.favorited ? 'Added to Favorites' : 'Removed from Favorites',
        description: result.favorited 
          ? 'This entry has been saved to your collection.' 
          : 'This entry has been removed from your collection.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'You must be logged in to save favorites.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      variant={isFavorited ? 'default' : 'outline'}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading || toggleFavorite.isPending}
      className={cn(
        'transition-all duration-200',
        isFavorited 
          ? 'bg-arise hover:bg-arise/80 text-white border-arise' 
          : 'border-primary/30 hover:border-arise hover:text-arise',
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          showLabel && "mr-1.5",
          isFavorited && "fill-current"
        )} 
      />
      {showLabel && (isFavorited ? 'Favorited' : 'Favorite')}
    </Button>
  );
}
