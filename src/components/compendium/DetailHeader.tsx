import { Link } from 'react-router-dom';
import { Heart, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface DetailHeaderProps {
  entryType: string;
  entryId: string;
  title: string;
  subtitle?: string;
}

export const DetailHeader = ({ entryType, entryId, title, subtitle }: DetailHeaderProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const favorite = isFavorite(entryType, entryId);

  const handleShare = async () => {
    const url = `${window.location.origin}/compendium/${entryType}/${entryId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: 'Link copied!',
        description: 'Shareable link copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy link to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex-1">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2 gradient-text-system">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground font-heading">{subtitle}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => toggleFavorite(entryType, entryId)}
          className={favorite ? 'text-amber-400 border-amber-400/30' : ''}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={favorite ? 'fill-current' : ''} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleShare}
          aria-label="Share"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

