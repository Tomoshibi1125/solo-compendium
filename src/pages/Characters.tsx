import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, User, Settings, Trash2, Crown, Skull, Shield, Zap, Heart, Users } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Checkbox } from '@/components/ui/checkbox';
import { BulkActionsBar } from '@/components/character/BulkActionsBar';
import { cn } from '@/lib/utils';
import { useCharacters, useDeleteCharacter } from '@/hooks/useCharacters';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { formatMonarchVernacular } from '@/lib/vernacular';

const Characters = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: characters = [], isLoading } = useCharacters();
  const isGuestMode = useMemo(() => characters.some((c) => c.user_id === 'guest'), [characters]);
  const deleteCharacter = useDeleteCharacter();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      await deleteCharacter.mutateAsync(deleteTarget);
      toast({
        title: 'Ascendant removed',
        description: 'The Ascendant has been removed from your roster.',
      });
      setDeleteTarget(null);
    } catch {
      toast({
        title: 'Failed to remove',
        description: 'Could not remove the Ascendant.',
        variant: 'destructive',
      });
    }
  };

  // Get ascendant rank based on level
  const getHunterRank = (level: number) => {
    if (level >= 17) return { rank: 'S', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/50', glow: 'shadow-amber-500/30' };
    if (level >= 13) return { rank: 'A', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50', glow: 'shadow-red-500/30' };
    if (level >= 9) return { rank: 'B', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/50', glow: 'shadow-orange-500/30' };
    if (level >= 5) return { rank: 'C', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/50', glow: 'shadow-blue-500/30' };
    return { rank: 'D', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50', glow: 'shadow-green-500/30' };
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow tracking-wider">
              ASCENDANT REGISTRY
            </h1>
            <p className="text-muted-foreground font-heading">
              Awaken and manage your Ascendants in the Prime Architect's domain
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/characters/compare">
              <Button variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                Compare Ascendants
              </Button>
            </Link>
            <Link to="/characters/new">
              <Button className="gap-2 font-heading bg-gradient-to-r from-arise to-shadow-purple hover:shadow-arise/30 hover:shadow-lg transition-all">
                <Plus className="w-4 h-4" />
                Awaken New Ascendant
              </Button>
            </Link>
          </div>
        </div>

        {isGuestMode && (
          <SystemWindow title="GUEST MODE" variant="alert" className="mb-6">
            <p className="text-sm text-muted-foreground">
              You are playing in guest mode. Ascendants are stored locally on this device only. Sign in to sync across devices and enable all online features.
            </p>
          </SystemWindow>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-arise/20 rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-t-arise rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground font-heading animate-pulse">Scanning Ascendant Database...</p>
          </div>
        ) : characters.length === 0 ? (
          <SystemWindow title="NO ASCENDANTS DETECTED" variant="alert" className="max-w-lg mx-auto text-center py-12">
            <div className="mb-6">
              <Skull className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">
                No awakened Ascendants in the System registry. Begin your journey in the Prime Architect's domain.
              </p>
            </div>
            <Link to="/characters/new">
              <Button className="gap-2 font-heading bg-gradient-to-r from-arise to-shadow-purple">
                <Zap className="w-4 h-4" />
                Awaken Your First Ascendant
              </Button>
            </Link>
          </SystemWindow>
        ) : (
          <>
            {/* Character Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters.map((character) => {
                  const rankInfo = getHunterRank(character.level);
                  const hpPercent = (character.hp_current / character.hp_max) * 100;
                  
                  const isSelected = selectedIds.has(character.id);
                  
                  return (
                    <div
                      key={character.id}
                      className={cn(
                        "glass-card p-6 transition-all duration-300 group relative overflow-hidden",
                        "hover:border-arise/50 hover:shadow-xl hover:shadow-arise/10",
                        "border-l-4",
                        isSelected && "ring-2 ring-primary ring-offset-2",
                        rankInfo.border
                      )}
                    >
                      {/* Selection Checkbox */}
                      <div className="absolute top-3 left-3 z-10">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            const newSet = new Set(selectedIds);
                            if (checked) {
                              newSet.add(character.id);
                            } else {
                              newSet.delete(character.id);
                            }
                            setSelectedIds(newSet);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      {/* Rank badge */}
                      <div className={cn(
                        "absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center font-arise text-lg font-bold",
                        rankInfo.bg,
                        rankInfo.color,
                        "ring-2 ring-offset-2 ring-offset-background",
                        rankInfo.border
                      )}>
                        {rankInfo.rank}
                      </div>

                      {/* Background glow effect */}
                      <div className={cn(
                        "absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500",
                        rankInfo.bg
                      )} />

                      <div className="flex items-start justify-between mb-4">
                        <div className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center relative",
                          "bg-gradient-to-br from-arise/20 to-shadow-purple/20",
                          "border border-arise/30"
                        )}>
                          {character.portrait_url ? (
                            <OptimizedImage
                              src={character.portrait_url}
                              alt={character.name}
                              className="w-full h-full object-cover rounded-xl"
                              size="thumbnail"
                            />
                          ) : (
                            <User className="w-7 h-7 text-arise" />
                          )}
                          {/* Level indicator */}
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-background border border-arise/50 flex items-center justify-center">
                            <span className="text-xs font-arise font-bold text-arise">{character.level}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-arise/20 hover:text-arise"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/characters/${character.id}`);
                            }}
                            aria-label={`Edit ${character.name}`}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              setDeleteTarget(character.id);
                            }}
                            className="text-destructive hover:text-destructive hover:bg-destructive/20"
                            aria-label={`Delete ${character.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <Link to={`/characters/${character.id}`} data-testid="character-card" className="block">
                        <h3 className="font-arise text-xl font-semibold mb-1 group-hover:text-arise transition-colors tracking-wide">
                          {character.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 font-heading">
                          {formatMonarchVernacular(character.job || 'Unawakened')}
                          {character.path && ` - ${formatMonarchVernacular(character.path)}`}
                        </p>

                        {/* HP Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Heart className="w-3 h-3" /> HP
                            </span>
                            <span className={cn(
                              "text-xs font-arise",
                              hpPercent < 25 ? "text-destructive" :
                              hpPercent < 50 ? "text-orange-400" : "text-green-400"
                            )}>
                              {character.hp_current}/{character.hp_max}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full transition-all duration-300 rounded-full",
                                hpPercent < 25 ? "bg-gradient-to-r from-destructive to-red-600" :
                                hpPercent < 50 ? "bg-gradient-to-r from-orange-500 to-amber-500" :
                                "bg-gradient-to-r from-green-500 to-emerald-400"
                              )}
                              style={{ width: `${hpPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 rounded bg-arise/5 border border-arise/20">
                            <Shield className="w-3 h-3 mx-auto mb-1 text-blue-400" />
                            <span className="font-arise font-bold text-lg">{character.armor_class}</span>
                            <span className="text-[10px] text-muted-foreground block">AC</span>
                          </div>
                          <div className="text-center p-2 rounded bg-arise/5 border border-arise/20">
                            <Zap className="w-3 h-3 mx-auto mb-1 text-yellow-400" />
                            <span className="font-arise font-bold text-lg">+{character.initiative}</span>
                            <span className="text-[10px] text-muted-foreground block">INIT</span>
                          </div>
                          <div className="text-center p-2 rounded bg-arise/5 border border-arise/20">
                            <Crown className="w-3 h-3 mx-auto mb-1 text-arise" />
                            <span className="font-arise font-bold text-lg">{character.proficiency_bonus}</span>
                            <span className="text-[10px] text-muted-foreground block">PROF</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}

              {/* New Character Card */}
              <Link
                to="/characters/new"
                data-testid="create-character"
                className={cn(
                  "glass-card p-6 border-dashed border-2 border-arise/30",
                  "hover:border-arise/50 hover:bg-arise/5 transition-all duration-300",
                  "flex flex-col items-center justify-center min-h-[280px] group"
                )}
              >
                <div className={cn(
                  "w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30",
                  "flex items-center justify-center mb-4",
                  "group-hover:border-arise/50 group-hover:bg-arise/10 transition-all duration-300"
                )}>
                  <Plus className="w-8 h-8 text-muted-foreground group-hover:text-arise transition-colors" />
                </div>
                <p className="font-arise text-lg text-muted-foreground group-hover:text-arise transition-colors tracking-wide">
                  AWAKEN ASCENDANT
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Begin your journey
                </p>
              </Link>
            </div>

            {/* Character Builder Preview */}
            <div className="mt-12">
              <h2 className="font-arise text-2xl font-bold mb-4 gradient-text-system tracking-wide">
                AWAKENING PROTOCOL
              </h2>
              <SystemWindow title="STEP-BY-STEP CREATION" variant="quest">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  {['Concept', 'Abilities', 'Job', 'Path', 'Background', 'Equipment', 'Powers'].map((step, i) => (
                    <div key={step} className="text-center group">
                      <div className={cn(
                        "w-10 h-10 mx-auto rounded-full flex items-center justify-center font-arise text-sm mb-2",
                        "bg-gradient-to-br from-arise/20 to-shadow-purple/20 border border-arise/30",
                        "group-hover:from-arise/30 group-hover:to-shadow-purple/30 transition-all"
                      )}>
                        {i + 1}
                      </div>
                      <span className="text-xs font-heading text-muted-foreground group-hover:text-arise transition-colors">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  The System guides you through each awakening step, validating your choices against the Prime Architect's laws.
                </p>
                <Link to="/characters/new" className="inline-block mt-4">
                  <Button className="gap-2 font-heading bg-gradient-to-r from-arise to-shadow-purple">
                    <Zap className="w-4 h-4" />
                    Begin Awakening
                  </Button>
                </Link>
              </SystemWindow>
            </div>
          </>
        )}

        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedIds={Array.from(selectedIds)}
          onClearSelection={() => setSelectedIds(new Set())}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent className="border-destructive/50">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-arise text-destructive flex items-center gap-2">
                <Skull className="w-5 h-5" />
                DELETE ASCENDANT?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This Ascendant will be permanently removed from the System registry.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="font-heading">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-heading"
              >
                Confirm Deletion
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Characters;

