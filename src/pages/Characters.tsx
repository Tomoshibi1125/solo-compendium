import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, User, Settings, Trash2, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { cn } from '@/lib/utils';
import { useCharacters, useDeleteCharacter } from '@/hooks/useCharacters';
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

const Characters = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: characters = [], isLoading } = useCharacters();
  const deleteCharacter = useDeleteCharacter();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      await deleteCharacter.mutateAsync(deleteTarget);
      toast({
        title: 'Character deleted',
        description: 'The character has been removed.',
      });
      setDeleteTarget(null);
    } catch (error) {
      toast({
        title: 'Failed to delete',
        description: 'Could not delete the character.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2 gradient-text-system">
              MY HUNTERS
            </h1>
            <p className="text-muted-foreground font-heading">
              Create and manage your Solo Leveling 5e characters
            </p>
          </div>
          <Link to="/characters/new">
            <Button className="gap-2 font-heading">
              <Plus className="w-4 h-4" />
              New Hunter
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : characters.length === 0 ? (
          <SystemWindow title="NO CHARACTERS" className="max-w-lg mx-auto text-center py-12">
            <p className="text-muted-foreground mb-6">
              You haven't created any characters yet. Start building your first Hunter!
            </p>
            <Link to="/characters/new">
              <Button className="gap-2 font-heading">
                <Plus className="w-4 h-4" />
                Create Your First Hunter
              </Button>
            </Link>
          </SystemWindow>
        ) : (
          <>
            {/* Character Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className="glass-card p-6 hover:border-primary/30 transition-all duration-200 group relative"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <User className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/characters/${character.id}/edit`);
                        }}
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
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Link to={`/characters/${character.id}`}>
                    <h3 className="font-heading text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                      {character.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Level {character.level} {character.job || 'Unassigned'}
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 rounded bg-muted/30">
                        <span className="text-xs text-muted-foreground block">HP</span>
                        <span className={cn(
                          "font-display font-bold",
                          character.hp_current < character.hp_max * 0.5 && "text-destructive"
                        )}>
                          {character.hp_current}/{character.hp_max}
                        </span>
                      </div>
                      <div className="text-center p-2 rounded bg-muted/30">
                        <span className="text-xs text-muted-foreground block">AC</span>
                        <span className="font-display font-bold">{character.armor_class}</span>
                      </div>
                      <div className="text-center p-2 rounded bg-muted/30">
                        <span className="text-xs text-muted-foreground block">Init</span>
                        <span className="font-display font-bold">+{character.initiative}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

              {/* New Character Card */}
              <Link
                to="/characters/new"
                className="glass-card p-6 border-dashed hover:border-primary/50 transition-all duration-200 flex flex-col items-center justify-center min-h-[200px] group"
              >
                <div className="w-14 h-14 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-4 group-hover:border-primary/50 transition-colors">
                  <Plus className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="font-heading text-muted-foreground group-hover:text-foreground transition-colors">
                  Create New Hunter
                </p>
              </Link>
            </div>

            {/* Character Builder Preview */}
            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold mb-4 gradient-text-shadow">
                CHARACTER BUILDER
              </h2>
              <SystemWindow title="STEP-BY-STEP CREATION" variant="quest">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                  {['Concept', 'Abilities', 'Job', 'Path', 'Background', 'Equipment', 'Powers'].map((step, i) => (
                    <div key={step} className="text-center">
                      <div className="w-10 h-10 mx-auto rounded-full bg-muted flex items-center justify-center font-display text-sm mb-2">
                        {i + 1}
                      </div>
                      <span className="text-xs font-heading text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  The character builder guides you through each step, showing live previews of your derived stats
                  and validating your choices against the rules.
                </p>
                <Link to="/characters/new" className="inline-block mt-4">
                  <Button className="gap-2 font-heading">
                    <Plus className="w-4 h-4" />
                    Start Building
                  </Button>
                </Link>
              </SystemWindow>
            </div>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Character?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the character and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Characters;
