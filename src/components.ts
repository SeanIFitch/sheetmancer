// components.ts - Reusable layout components

import { Component, SectionConfig, Theme, CharacterData, ColumnsSectionConfig } from './types';
import { SheetEngine } from './sheet-engine';

type Ability = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

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
                </div>
            `;
    },
  },

  // Ability scores block
  abilityScores: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      const abilities = (config.abilities as Ability[]) || [
        'strength',
        'dexterity',
        'constitution',
        'intelligence',
        'wisdom',
        'charisma',
      ];

      return `
                <div class="sheet-section">
                    ${config.showHeader !== false ? `<div class="section-header">${config.title || 'Ability Scores'}</div>` : ''}
                    <div class="stat-block">
                        ${abilities.map((ability) => renderAbility(ability, data)).join('')}
                    </div>
                </div>
            `;
    },
  },

  // Combat statistics
  combatStats: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      return `
                <div class="sheet-section">
                    ${config.showHeader !== false ? `<div class="section-header">${config.title || 'Combat'}</div>` : ''}
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
                </div>
            `;
    },
  },

  // Skills list
  skills: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      return `
                <div class="sheet-section">
                    ${config.showHeader !== false ? `<div class="section-header">${config.title || 'Skills'}</div>` : ''}
                    <div class="skill-list">
                        ${SKILLS.map((skill) => renderSkill(skill, data)).join('')}
                    </div>
                </div>
            `;
    },
  },

  // Saving throws
  savingThrows: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      const abilities: Ability[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

      return `
                <div class="sheet-section">
                    ${config.showHeader !== false ? `<div class="section-header">${config.title || 'Saving Throws'}</div>` : ''}
                    <div class="skill-list">
                        ${abilities.map((ability) => renderSave(ability, data)).join('')}
                    </div>
                </div>
            `;
    },
  },

  // Equipment list
  equipment: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      const items = data.equipment || [];

      return `
                <div class="sheet-section">
                    ${config.showHeader !== false ? `<div class="section-header">${config.title || 'Equipment'}</div>` : ''}
                    <div class="equipment-list">
                        ${items.length > 0 ? items.map((item) => `<div class="equipment-item">${item}</div>`).join('') : '<div class="equipment-item">No equipment</div>'}
                    </div>
                </div>
            `;
    },
  },

  // Features and traits
  features: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      const features = data.features || [];

      return `
                <div class="sheet-section">
                    ${config.showHeader !== false ? `<div class="section-header">${config.title || 'Features & Traits'}</div>` : ''}
                    <div class="feature-list">
                        ${features.length > 0 ? features.map((feature) => `<div class="feature-item">${feature}</div>`).join('') : '<div class="feature-item">No features</div>'}
                    </div>
                </div>
            `;
    },
  },

  // Text area for notes, backstory, etc.
  textArea: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      const fieldName = (config.field as string) || 'notes';
      const content = data[fieldName] || '';

      return `
                <div class="sheet-section">
                    ${config.showHeader !== false ? `<div class="section-header">${config.title || 'Notes'}</div>` : ''}
                    <div class="field-value textarea-field">${content}</div>
                </div>
            `;
    },
  },

  // Two-column layout
  columns: {
    render(config: SectionConfig, theme: Theme, data: CharacterData): string {
      const colConfig = config as ColumnsSectionConfig;
      const leftSections = colConfig.left || [];
      const rightSections = colConfig.right || [];

      return `
                <div class="sheet-section">
                    <div class="section-grid" style="grid-template-columns: ${colConfig.ratio || '1fr 1fr'};">
                        <div>
                            ${leftSections
                              .map((section) => {
                                const component = COMPONENTS[section.component];
                                return component ? component.render(section, theme, data) : '';
                              })
                              .join('')}
                        </div>
                        <div>
                            ${rightSections
                              .map((section) => {
                                const component = COMPONENTS[section.component];
                                return component ? component.render(section, theme, data) : '';
                              })
                              .join('')}
                        </div>
                    </div>
                </div>
            `;
    },
  },

  // Proficiency and passive scores
  proficiencyBlock: {
    render(config: SectionConfig, _theme: Theme, data: CharacterData): string {
      const passivePerception =
        10 +
        SheetEngine.calculateModifier(data.wisdom || 10) +
        (data.skills?.perception?.proficient ? data.proficiencyBonus || 2 : 0);

      return `
                <div class="sheet-section">
                    ${config.showHeader !== false ? `<div class="section-header">${config.title || 'Proficiency'}</div>` : ''}
                    <div class="info-row">
                        <div class="field-group">
                            <div class="field-label">Proficiency Bonus</div>
                            <div class="field-value">${SheetEngine.formatModifier(data.proficiencyBonus || 2)}</div>
                        </div>
                        <div class="field-group">
                            <div class="field-label">Passive Perception</div>
                            <div class="field-value">${passivePerception}</div>
                        </div>
                    </div>
                </div>
            `;
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

  return `
        <div class="field-group">
            <div class="field-label">${labels[field] || field}</div>
            <div class="field-value">${data[field] || ''}</div>
        </div>
    `;
}

function renderAbility(ability: Ability, data: CharacterData): string {
  const score = data[ability] || 10;
  const modifier = SheetEngine.calculateModifier(score);

  return `
        <div class="stat-item">
            <div class="stat-name">${ABILITY_LABELS[ability]}</div>
            <div class="stat-value">${score}</div>
            <div class="stat-modifier">${SheetEngine.formatModifier(modifier)}</div>
        </div>
    `;
}

function renderDeathSaves(data: CharacterData): string {
  const saves = data.deathSaves || { successes: 0, failures: 0 };

  return `
        <div class="death-saves">
            <div>
                <div class="field-label">Death Save Successes</div>
                <div class="save-track">
                    ${[1, 2, 3].map((i) => `<div class="save-bubble ${i <= saves.successes ? 'filled' : ''}"></div>`).join('')}
                </div>
            </div>
            <div>
                <div class="field-label">Death Save Failures</div>
                <div class="save-track">
                    ${[1, 2, 3].map((i) => `<div class="save-bubble ${i <= saves.failures ? 'filled' : ''}"></div>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderSkill(skill: Skill, data: CharacterData): string {
  const skillKey = skill.name.toLowerCase().replace(/ /g, '');
  const skillData = data.skills?.[skillKey];
  const abilityScore = data[skill.ability] || 10;
  const abilityMod = SheetEngine.calculateModifier(abilityScore);
  const profBonus = skillData?.proficient ? data.proficiencyBonus || 2 : 0;
  const totalBonus = abilityMod + profBonus;

  return `
        <div class="skill-item">
            <div class="skill-checkbox ${skillData?.proficient ? 'checked' : ''}"></div>
            <div class="skill-name">${skill.name}</div>
            <div class="skill-bonus">${SheetEngine.formatModifier(totalBonus)}</div>
        </div>
    `;
}

function renderSave(ability: Ability, data: CharacterData): string {
  const saveData = data.savingThrows?.[ability];
  const abilityScore = data[ability] || 10;
  const abilityMod = SheetEngine.calculateModifier(abilityScore);
  const profBonus = saveData?.proficient ? data.proficiencyBonus || 2 : 0;
  const totalBonus = abilityMod + profBonus;

  return `
        <div class="skill-item">
            <div class="skill-checkbox ${saveData?.proficient ? 'checked' : ''}"></div>
            <div class="skill-name">${ABILITY_FULL_NAMES[ability]}</div>
            <div class="skill-bonus">${SheetEngine.formatModifier(totalBonus)}</div>
        </div>
    `;
}
