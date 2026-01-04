import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { printCharacterSheet } from '@/lib/export';

interface PrintButtonProps {
  characterId?: string;
  onPrint?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function PrintButton({ characterId, onPrint, className, variant = 'outline' }: PrintButtonProps) {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else if (characterId) {
      printCharacterSheet(characterId);
    } else {
      window.print();
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handlePrint}
      className={className}
    >
      <Printer className="w-4 h-4 mr-2" />
      Print
    </Button>
  );
}

