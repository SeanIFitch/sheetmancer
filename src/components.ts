// components.ts - Reusable layout components

import { Component, SectionConfig, Theme, CharacterData, ColumnsSectionConfig } from './types';
import { SheetEngine } from './sheet-engine';

type Ability = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

const ABILITY_ORDER: Ability[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

const ABILITY_LABELS: Record<Ability, string> = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA',
};

const ABILITY_FULL_NAMES: Record<Ability, string> = {
  strength: 'Strength',
  dexterity: 'Dexterity',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Wisdom',
  charisma: 'Charisma',
};

interface Skill {
  name: string;
  ability: Ability;
}

const SKILLS: Skill[] = [
  { name: 'Acrobatics', ability: 'dexterity' },
  { name: 'Animal Handling', ability: 'wisdom' },
  { name: 'Arcana', ability: 'intelligence' },
  { name: 'Athletics', ability: 'strength' },
  { name: 'Deception', ability: 'charisma' },
  { name: 'History', ability: 'intelligence' },
  { name: 'Insight', ability: 'wisdom' },
  { name: 'Intimidation', ability: 'charisma' },
  { name: 'Investigation', ability: 'intelligence' },
  { name: 'Medicine', ability: 'wisdom' },
  { name: 'Nature', ability: 'intelligence' },
  { name: 'Perception', ability: 'wisdom' },
  { name: 'Performance', ability: 'charisma' },
  { name: 'Persuasion', ability: 'charisma' },
  { name: 'Religion', ability: 'intelligence' },
  { name: 'Sleight of Hand', ability: 'dexterity' },
  { name: 'Stealth', ability: 'dexterity' },
  { name: 'Survival', ability: 'wisdom' },
];

// Default proficiency data to avoid creating new objects repeatedly
const DEFAULT_PROFICIENCY = { proficient: false };

// HTML escape map for XSS prevention (frozen to prevent tampering)
const HTML_ESCAPE_MAP: Record<string, string> = Object.freeze({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
});

// Helper to render section header
function renderSectionHeader(config: SectionConfig, defaultTitle: string): string {
  return config.showHeader !== false ? `<div class="section-header">${escapeHtml(config.title || defaultTitle)}</div>` : '';
}

// Helper to escape HTML to prevent XSS (efficient single-pass version)
function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
}

// Helper to render list of items
function renderItemList(items: string[], emptyMessage: string, itemClass: string): string {
  return items.length > 0 
    ? items.map((item) => `<div class="${itemClass}">${escapeHtml(item)}</div>`).join('') 
    : `<div class="${itemClass}">${escapeHtml(emptyMessage)}</div>`;
}

export const COMPONENTS: Record<string, Component> = {
  // Character header with name, class, level, etc.
  header: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      const fields = (config.fields as string[]) || ['name', 'class', 'level', 'race', 'background', 'alignment'];

      return `
        <div class="sheet-section header-section">
          <div class="info-row">
            ${fields.map((field) => renderHeaderField(field, data)).join('')}
          </div>
        </div>`;
    },
  },

  // Ability scores block
  abilityScores: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      const abilities = (config.abilities as Ability[]) || ABILITY_ORDER;

      return `
        <div class="sheet-section">
          ${renderSectionHeader(config, 'Ability Scores')}
          <div class="stat-block">
            ${abilities.map((ability) => renderAbility(ability, data)).join('')}
          </div>
        </div>`;
    },
  },

  // Combat statistics
  combatStats: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      return `
        <div class="sheet-section">
          ${renderSectionHeader(config, 'Combat')}
          <div class="combat-stats">
            <div class="combat-stat">
              <div class="field-label">Armor Class</div>
              <div class="stat-value">${data.armorClass || 10}</div>
            </div>
            <div class="combat-stat">
              <div class="field-label">Initiative</div>
              <div class="stat-value">${SheetEngine.formatModifier(data.initiative || 0)}</div>
            </div>
            <div class="combat-stat">
              <div class="field-label">Speed</div>
              <div class="stat-value">${data.speed || 30} ft</div>
            </div>
          </div>
          <div class="hp-tracker">
            <div class="field-group">
              <div class="field-label">Hit Point Maximum</div>
              <div class="field-value">${data.hitPointMax || 0}</div>
            </div>
            <div class="field-group">
              <div class="field-label">Current Hit Points</div>
              <div class="field-value">${data.hitPointCurrent || 0}</div>
            </div>
          </div>
          <div class="field-group">
            <div class="field-label">Hit Dice</div>
            <div class="field-value">${data.hitDice || '1d6'}</div>
          </div>
          ${config.showDeathSaves !== false ? renderDeathSaves(data) : ''}
        </div>`;
    },
  },

  // Skills list
  skills: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      return `
        <div class="sheet-section">
          ${renderSectionHeader(config, 'Skills')}
          <div class="skill-list">
            ${SKILLS.map((skill) => renderSkill(skill, data)).join('')}
          </div>
        </div>`;
    },
  },

  // Saving throws
  savingThrows: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      return `
        <div class="sheet-section">
          ${renderSectionHeader(config, 'Saving Throws')}
          <div class="skill-list">
            ${ABILITY_ORDER.map((ability) => renderAbilityCheck(ability, data, ABILITY_FULL_NAMES[ability], data.savingThrows?.[ability])).join('')}
          </div>
        </div>`;
    },
  },

  // Equipment list
  equipment: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      const itemsHtml = renderItemList(data.equipment || [], 'No equipment', 'equipment-item');

      return `
        <div class="sheet-section">
          ${renderSectionHeader(config, 'Equipment')}
          <div class="equipment-list">${itemsHtml}</div>
        </div>`;
    },
  },

  // Features and traits
  features: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      const featuresHtml = renderItemList(data.features || [], 'No features', 'feature-item');

      return `
        <div class="sheet-section">
          ${renderSectionHeader(config, 'Features & Traits')}
          <div class="feature-list">${featuresHtml}</div>
        </div>`;
    },
  },

  // Text area for notes, backstory, etc.
  textArea: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      const fieldName = (config.field as string) || 'notes';
      const content = data[fieldName] || '';
      const escapedContent = typeof content === 'string' ? escapeHtml(content) : content;

      return `
        <div class="sheet-section">
          ${renderSectionHeader(config, 'Notes')}
          <div class="field-value textarea-field">${escapedContent}</div>
        </div>`;
    },
  },

  // Two-column layout
  columns: {
    render(config: SectionConfig, theme: Theme, data: CharacterData): string {
      const colConfig = config as ColumnsSectionConfig;
      const leftSections = colConfig.left || [];
      const rightSections = colConfig.right || [];
      const renderSection = (section: SectionConfig) => {
        const component = COMPONENTS[section.component];
        return component ? component.render(section, theme, data) : '';
      };

      return `
        <div class="sheet-section">
          <div class="section-grid" style="grid-template-columns: ${colConfig.ratio || '1fr 1fr'};">
            <div>${leftSections.map(renderSection).join('')}</div>
            <div>${rightSections.map(renderSection).join('')}</div>
          </div>
        </div>`;
    },
  },

  // Proficiency and passive scores
  proficiencyBlock: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      const wisdomMod = SheetEngine.calculateModifier(data.wisdom || 10);
      const profBonus = data.proficiencyBonus || 2;
      const perceptionProf = data.skills?.perception?.proficient ? profBonus : 0;
      const passivePerception = 10 + wisdomMod + perceptionProf;

      return `
        <div class="sheet-section">
          ${renderSectionHeader(config, 'Proficiency')}
          <div class="info-row">
            <div class="field-group">
              <div class="field-label">Proficiency Bonus</div>
              <div class="field-value">${SheetEngine.formatModifier(profBonus)}</div>
            </div>
            <div class="field-group">
              <div class="field-label">Passive Perception</div>
              <div class="field-value">${passivePerception}</div>
            </div>
          </div>
        </div>`;
    },
  },
};

// Helper functions

function renderHeaderField(field: string, data: CharacterData): string {
  const labels: Record<string, string> = {
    name: 'Character Name',
    class: 'Class',
    level: 'Level',
    race: 'Race',
    background: 'Background',
    alignment: 'Alignment',
    experiencePoints: 'Experience Points',
  };

  const value = data[field] || '';
  const escapedValue = typeof value === 'string' ? escapeHtml(value) : value;

  return `
    <div class="field-group">
      <div class="field-label">${labels[field] || field}</div>
      <div class="field-value">${escapedValue}</div>
    </div>`;
}

function renderAbility(ability: Ability, data: CharacterData): string {
  const score = data[ability] || 10;
  const modifier = SheetEngine.calculateModifier(score);

  return `
    <div class="stat-item">
      <div class="stat-name">${ABILITY_LABELS[ability]}</div>
      <div class="stat-value">${score}</div>
      <div class="stat-modifier">${SheetEngine.formatModifier(modifier)}</div>
    </div>`;
}

function renderDeathSaves(data: CharacterData): string {
  const saves = data.deathSaves || { successes: 0, failures: 0 };
  const renderSaveTrackBubbles = (count: number) => [1, 2, 3]
    .map((i) => `<div class="save-bubble ${i <= count ? 'filled' : ''}"></div>`)
    .join('');

  return `
    <div class="death-saves">
      <div>
        <div class="field-label">Death Save Successes</div>
        <div class="save-track">${renderSaveTrackBubbles(saves.successes)}</div>
      </div>
      <div>
        <div class="field-label">Death Save Failures</div>
        <div class="save-track">${renderSaveTrackBubbles(saves.failures)}</div>
      </div>
    </div>`;
}

function renderSkill(skill: Skill, data: CharacterData): string {
  const skillKey = skill.name.toLowerCase().replace(/ /g, '');
  return renderAbilityCheck(skill.ability, data, skill.name, data.skills?.[skillKey]);
}

function renderAbilityCheck(ability: Ability, data: CharacterData, label: string, checkData?: { proficient?: boolean }): string {
  const profData = checkData || DEFAULT_PROFICIENCY;
  const abilityMod = SheetEngine.calculateModifier(data[ability] || 10);
  const profBonus = profData.proficient ? data.proficiencyBonus || 2 : 0;

  return `
    <div class="skill-item">
      <div class="skill-checkbox ${profData.proficient ? 'checked' : ''}"></div>
      <div class="skill-name">${label}</div>
      <div class="skill-bonus">${SheetEngine.formatModifier(abilityMod + profBonus)}</div>
    </div>`;
}

