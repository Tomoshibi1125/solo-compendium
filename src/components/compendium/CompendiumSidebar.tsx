import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface CompendiumSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sourceBooks: string[];
  selectedSourceBooks: string[];
  onSourceBookToggle: (sourceBook: string) => void;
  schools?: string[];
  selectedSchools?: string[];
  onSchoolToggle?: (school: string) => void;
  gateRanks?: string[];
  selectedGateRanks?: string[];
  onGateRankToggle?: (rank: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  favoriteCount: number;
  showBossOnly?: boolean;
  onToggleBossOnly?: () => void;
  showMiniBossOnly?: boolean;
  onToggleMiniBossOnly?: () => void;
}

export function CompendiumSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  sourceBooks,
  selectedSourceBooks,
  onSourceBookToggle,
  schools = [],
  selectedSchools = [],
  onSchoolToggle,
  gateRanks = [],
  selectedGateRanks = [],
  onGateRankToggle,
  showFavoritesOnly,
  onToggleFavorites,
  favoriteCount,
  showBossOnly = false,
  onToggleBossOnly,
  showMiniBossOnly = false,
  onToggleMiniBossOnly,
}: CompendiumSidebarProps) {
  const activeFiltersCount = 
    selectedSourceBooks.length + 
    (selectedSchools?.length || 0) + 
    (selectedGateRanks?.length || 0) + 
    (showFavoritesOnly ? 1 : 0) +
    (showBossOnly ? 1 : 0) +
    (showMiniBossOnly ? 1 : 0);

  return (
    <aside className="w-64 shrink-0 space-y-4">
      {/* Quick Filters */}
      <SystemWindow title="QUICK FILTERS" className="p-4">
        <div className="space-y-2">
          <Button
            variant={showFavoritesOnly ? 'default' : 'outline'}
            size="sm"
            className="w-full justify-start gap-2"
            onClick={onToggleFavorites}
          >
            <Sparkles className="w-4 h-4" />
            Favorites
            {favoriteCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {favoriteCount}
              </Badge>
            )}
          </Button>
        </div>
      </SystemWindow>

      {/* Categories */}
      <SystemWindow title="CATEGORIES" className="p-4">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => onCategoryChange(category.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{category.name}</span>
                  {category.count !== undefined && (
                    <Badge variant="secondary" className="ml-auto">
                      {category.count}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </SystemWindow>

      {/* Source Books */}
      {sourceBooks.length > 0 && (
        <SystemWindow title="SOURCE BOOKS" className="p-4">
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {sourceBooks.map((book) => {
                const isSelected = selectedSourceBooks.includes(book);
                return (
                  <div key={book} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`source-${book}`}
                      checked={isSelected}
                      onChange={() => onSourceBookToggle(book)}
                      className="rounded border-border"
                    />
                    <label
                      htmlFor={`source-${book}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {book}
                    </label>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </SystemWindow>
      )}

      {/* Power Schools (for Powers) */}
      {schools.length > 0 && onSchoolToggle && (
        <SystemWindow title="SPELL SCHOOLS" className="p-4">
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {schools.map((school) => {
                const isSelected = selectedSchools?.includes(school);
                return (
                  <div key={school} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`school-${school}`}
                      checked={isSelected}
                      onChange={() => onSchoolToggle(school)}
                      className="rounded border-border"
                    />
                    <label
                      htmlFor={`school-${school}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {school}
                    </label>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </SystemWindow>
      )}

      {/* Gate Ranks (for Monsters) */}
      {gateRanks.length > 0 && onGateRankToggle && (
        <SystemWindow title="GATE RANKS" className="p-4">
          <div className="space-y-2">
            {gateRanks.map((rank) => {
              const isSelected = selectedGateRanks?.includes(rank);
              return (
                <div key={rank} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`rank-${rank}`}
                    checked={isSelected}
                    onChange={() => onGateRankToggle(rank)}
                    className="rounded border-border"
                  />
                  <label
                    htmlFor={`rank-${rank}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {rank}-Rank
                  </label>
                </div>
              );
            })}
          </div>
        </SystemWindow>
      )}

      {/* Boss Filters (for Monsters) */}
      {(onToggleBossOnly || onToggleMiniBossOnly) && (
        <SystemWindow title="BOSS FILTERS" className="p-4">
          <div className="space-y-2">
            {onToggleBossOnly && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="boss-only"
                  checked={showBossOnly}
                  onChange={onToggleBossOnly}
                  className="rounded border-border"
                />
                <label
                  htmlFor="boss-only"
                  className="text-sm cursor-pointer flex-1"
                >
                  Boss Only
                </label>
              </div>
            )}
            {onToggleMiniBossOnly && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="miniboss-only"
                  checked={showMiniBossOnly}
                  onChange={onToggleMiniBossOnly}
                  className="rounded border-border"
                />
                <label
                  htmlFor="miniboss-only"
                  className="text-sm cursor-pointer flex-1"
                >
                  Mini-Boss Only
                </label>
              </div>
            )}
          </div>
        </SystemWindow>
      )}

      {/* Active Filters Count */}
      {activeFiltersCount > 0 && (
        <div className="text-xs text-muted-foreground text-center">
          {activeFiltersCount} active filter{activeFiltersCount !== 1 ? 's' : ''}
        </div>
      )}
    </aside>
  );
}

