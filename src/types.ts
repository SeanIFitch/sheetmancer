// types.ts - Type definitions for the character sheet system

export interface CharacterData {
  // Basic Info (all optional)
  name?: string;
  playerName?: string;
  class?: string;
  level?: number;
  race?: string;
  background?: string;
  alignment?: string;
  experiencePoints?: number;

  // Ability Scores (all optional)
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;

  // Combat Stats (all optional)
  proficiencyBonus?: number;
  armorClass?: number;
  initiative?: number;
  speed?: number;
  hitPointMax?: number;
  hitPointCurrent?: number;
  hitDice?: string;
  deathSaves?: {
    successes?: number;
    failures?: number;
  };

  // Skills (optional)
  skills?: {
    [skillName: string]: {
      proficient?: boolean;
    };
  };

  // Saving Throws (optional)
  savingThrows?: {
    [ability: string]: {
      proficient?: boolean;
    };
  };

  // Equipment (optional)
  equipment?: string[];

  // Features (optional)
  features?: string[];

  // Spells (optional)
  spells?: Array<{
    name: string;
    level: number;
    school?: string;
    castingTime?: string;
    range?: string;
    components?: string;
    duration?: string;
    description?: string;
  }>;

  // Optional fields
  spellSlots?: Record<number, {
    total: number;
    used: number;
  }>;

  attacks?: Array<{
    name: string;
    bonus: string;
    damage: string;
    damageType?: string;
  }>;

  currency?: {
    cp?: number;
    sp?: number;
    ep?: number;
    gp?: number;
    pp?: number;
  };

  // Freeform text fields
  personalityTraits?: string;
  backstory?: string;
  notes?: string;

  // Allow additional fields
  [key: string]: any;
}

export interface Theme {
  name: string;
  page: {
    width: string;
    height: string;
  };
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    border: string;
    fieldBackground: string;
    statBackground: string;
  };
  typography: {
    heading: {
      family: string;
      size: string;
      weight: string;
      transform?: string;
      spacing?: string;
    };
    body: {
      family: string;
      size: string;
    };
    label: {
      family: string;
      size: string;
      weight: string;
      transform?: string;
      spacing?: string;
    };
    value: {
      family: string;
      size: string;
      weight: string;
    };
    stat: {
      size: string;
      weight: string;
    };
    modifier: {
      size: string;
      weight: string;
    };
  };
  spacing: {
    page: string;
    pageGap: string;
    section: string;
    medium: string;
    small: string;
    xsmall: string;
  };
  borders: {
    section: string;
    field: string;
    stat: string;
    radius: string;
  };
  backgrounds: {
    texture: string;
    border: string;
    shadow: string;
    overlay: string;
    statGradient: string;
  };
  decorative: {
    ornament: string;
    divider: string;
  };
}

export interface SectionConfig {
  component: string;
  showHeader?: boolean;
  title?: string;
  [key: string]: any;
}

export interface ColumnsSectionConfig extends SectionConfig {
  component: 'columns';
  ratio?: string;
  left: SectionConfig[];
  right: SectionConfig[];
}

export interface Config {
  name: string;
  sectionsPerPage: number;
  sections: SectionConfig[];
}

export interface Component {
  render(config: SectionConfig, theme: Theme, data: CharacterData): string;
}

export interface SheetGenerationResult {
  html: string;
  styles: string;
}

export interface Page {
  sections: SectionConfig[];
}
