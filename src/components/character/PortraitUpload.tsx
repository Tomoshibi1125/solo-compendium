import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { compressImage } from '@/lib/imageOptimization';
import { cn } from '@/lib/utils';

export function PortraitUpload({
  characterId,
  currentPortraitUrl,
  onUploadComplete,
}: {
  characterId: string;
  currentPortraitUrl?: string | null;
  onUploadComplete?: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPortraitUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Compress image before uploading
      const compressedBlob = await compressImage(file, {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.85,
        format: 'webp',
      });

      // Generate unique filename with .webp extension
      const fileName = `${characterId}-${Date.now()}.webp`;
      const filePath = `portraits/${fileName}`;

      // Upload compressed image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('character-portraits')
        .upload(filePath, compressedBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/webp',
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('character-portraits')
        .getPublicUrl(filePath);

      // Update character with portrait URL
      const { error: updateError } = await supabase
        .from('characters')
        .update({ portrait_url: publicUrl })
        .eq('id', characterId);

      if (updateError) throw updateError;

      toast({
        title: 'Portrait uploaded',
        description: 'Character portrait has been updated.',
      });

      onUploadComplete?.(publicUrl);
    } catch (error) {
      // Error is handled by toast notification
      toast({
        title: 'Upload failed',
        description: 'Could not upload portrait. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentPortraitUrl) return;

    try {
      // Extract file path from URL
      const urlParts = currentPortraitUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `portraits/${fileName}`;

      // Delete from storage
      await supabase.storage
        .from('character-portraits')
        .remove([filePath]);

      // Update character
      await supabase
        .from('characters')
        .update({ portrait_url: null })
        .eq('id', characterId);

      setPreview(null);
      toast({
        title: 'Portrait removed',
        description: 'Character portrait has been removed.',
      });

      onUploadComplete?.('');
    } catch (error) {
      // Error is handled by toast notification
      toast({
        title: 'Remove failed',
        description: 'Could not remove portrait.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Character portrait"
              className="w-24 h-24 rounded-lg object-cover border border-border"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={handleRemove}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg border border-dashed border-muted-foreground/50 flex items-center justify-center bg-muted/30">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              {preview && preview !== currentPortraitUrl ? 'Change' : 'Upload'}
            </Button>
            {preview && preview !== currentPortraitUrl && (
              <Button
                variant="default"
                size="sm"
                onClick={handleUpload}
                disabled={uploading}
                className="gap-2"
              >
                {uploading ? 'Uploading...' : 'Save'}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, or GIF. Max 5MB
          </p>
        </div>
      </div>
    </div>
  );
}

