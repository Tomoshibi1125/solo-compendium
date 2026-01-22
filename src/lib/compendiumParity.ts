/**
 * Digital Character Sheet Compendium Parity Enhancement Plan
 * 
 * Missing features to implement for full Digital Character Sheet parity:
 */

// 1. Advanced Search & Filtering
export interface AdvancedSearchFeatures {
  // Content Type Filters
  contentTypes: string[];
  sourceBooks: string[];
  settings: string[];
  
  // Advanced Filters
  abilityRequirements: string[];
  skillRequirements: string[];
  toolRequirements: string[];
  spellComponents: string[];
  castingTime: string[];
  duration: string[];
  range: string[];
  area: string[];
  savingThrows: string[];
  damageTypes: string[];
  conditions: string[];
  
  // Monster Filters
  monsterTypes: string[];
  monsterSizes: string[];
  monsterAlignments: string[];
  monsterEnvironments: string[];
}

// 2. Comparison Tool
export interface ComparisonTool {
  compareItems: string[];
  compareStats: Record<string, unknown>;
  sideBySideView: boolean;
  exportComparison: boolean;
}

// 3. Collection Builder
export interface CollectionBuilder {
  collections: Array<{
    id: string;
    name: string;
    description: string;
    items: string[];
    isPublic: boolean;
    tags: string[];
  }>;
  shareCollections: boolean;
  importCollections: boolean;
}

// 4. Homebrew Content Integration
export interface HomebrewIntegration {
  createContent: boolean;
  editContent: boolean;
  publishContent: boolean;
  validateContent: boolean;
  versionControl: boolean;
}

// 5. Cross-referencing System
export interface CrossReferenceSystem {
  relatedItems: string[];
  prerequisites: string[];
  references: string[];
  seeAlso: string[];
}

// 6. Print & Export Features
export interface PrintExportFeatures {
  printFriendly: boolean;
  exportPDF: boolean;
  exportMarkdown: boolean;
  exportJSON: boolean;
  customFormats: boolean;
}

// 7. Notes & Annotations
export interface NotesAnnotations {
  personalNotes: string;
  publicNotes: string;
  annotations: Array<{
    item: string;
    note: string;
    isPublic: boolean;
    createdAt: string;
  }>;
}

// 8. Favorites & Bookmarks
export interface FavoritesSystem {
  favorites: string[];
  categories: Record<string, string[]>;
  shareFavorites: boolean;
  importFavorites: boolean;
}

// 9. Recent History
export interface RecentHistory {
  recentlyViewed: string[];
  recentlySearched: string[];
  recentlyEdited: string[];
  searchHistory: string[];
}

// 10. Content Ratings & Feedback
export interface ContentRatings {
  ratings: Record<string, number>;
  reviews: Array<{
    item: string;
    rating: number;
    comment: string;
    author: string;
    createdAt: string;
  }>;
  feedback: boolean;
}

// 11. Advanced Sorting Options
export interface AdvancedSorting {
  sortBy: string[];
  sortOrder: 'asc' | 'desc';
  customSort: boolean;
  saveSort: boolean;
}

// 12. Content Statistics
export interface ContentStatistics {
  totalItems: number;
  itemsByType: Record<string, number>;
  itemsBySource: Record<string, number>;
  itemsByRarity: Record<string, number>;
  itemsByLevel: Record<string, number>;
}

// 13. Search Autocomplete
export interface SearchAutocomplete {
  suggestions: string[];
  recentSearches: string[];
  popularSearches: string[];
  autoCorrect: boolean;
}

// 14. Content Preview
export interface ContentPreview {
  quickPreview: boolean;
  detailedPreview: boolean;
  imagePreview: boolean;
  statsPreview: boolean;
}

// 15. Bulk Operations
export interface BulkOperations {
  bulkSelect: boolean;
  bulkExport: boolean;
  bulkFavorite: boolean;
  bulkTag: boolean;
  bulkDelete: boolean;
}

