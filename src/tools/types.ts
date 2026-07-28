export type ToolCategory = 'developer' | 'seo' | 'image' | 'pdf' | 'utility' | 'video' | 'audio' | 'calculators' | 'converters' | 'design' | 'text' | 'documents';

export interface ToolConfig {
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  category: ToolCategory;
  keywords: string[];
  icon: string;
  isClientOnly: boolean;
  features: string[];
  relatedTools?: string[];
  howTo?: string[];
  faqs?: { q: string; a: string }[];
  addedAt?: string;
}

export interface ToolModule {
  config: ToolConfig;
  ClientComponent: React.ComponentType;
  schema: object;
}
