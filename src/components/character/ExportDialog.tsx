import { FileText, FileJson } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { downloadCharacterJSON, exportCharacterPDF } from '@/lib/export';
import type { Database } from '@/integrations/supabase/types';

type Character = Database['public']['Tables']['characters']['Row'];
type CharacterWithAbilities = Character & {
  abilities: Record<string, number>;
};

export function ExportDialog({
  open,
  onOpenChange,
  character,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  character: CharacterWithAbilities;
}) {
  const handleExportJSON = () => {
    downloadCharacterJSON(character);
    onOpenChange(false);
  };

  const handleExportPDF = () => {
    exportCharacterPDF(character);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Character</DialogTitle>
          <DialogDescription>
            Choose how you want to export {character.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Button
            onClick={handleExportJSON}
            className="w-full justify-start gap-3"
            variant="outline"
          >
            <FileJson className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div className="font-semibold">Export as JSON</div>
              <div className="text-xs text-muted-foreground">
                Backup file with all character data
              </div>
            </div>
          </Button>

          <Button
            onClick={handleExportPDF}
            className="w-full justify-start gap-3"
            variant="outline"
          >
            <FileText className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div className="font-semibold">Export as PDF</div>
              <div className="text-xs text-muted-foreground">
                Print-friendly character sheet
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

