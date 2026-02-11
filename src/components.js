// components.ts - Reusable layout components
import { SheetEngine } from './sheet-engine';
const ABILITY_LABELS = {
    strength: 'STR',
    dexterity: 'DEX',
    constitution: 'CON',
    intelligence: 'INT',
    wisdom: 'WIS',
    charisma: 'CHA',
};
const ABILITY_FULL_NAMES = {
    strength: 'Strength',
    dexterity: 'Dexterity',
    constitution: 'Constitution',
    intelligence: 'Intelligence',
    wisdom: 'Wisdom',
    charisma: 'Charisma',
};
const SKILLS = [
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
// Helper to render section header
function renderSectionHeader(config, defaultTitle) {
    return config.showHeader !== false ? `<div class="section-header">${config.title || defaultTitle}</div>` : '';
}
// Helper to render list of items
function renderItemList(items, emptyMessage, itemClass) {
    return items.length > 0
        ? items.map((item) => `<div class="${itemClass}">${item}</div>`).join('')
        : `<div class="${itemClass}">${emptyMessage}</div>`;
}
export const COMPONENTS = {
    // Character header with name, class, level, etc.
    header: {
        render(config, _theme, data) {
            const fields = config.fields || ['name', 'class', 'level', 'race', 'background', 'alignment'];
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
        render(config, _theme, data) {
            const abilities = config.abilities || ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
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
        render(config, _theme, data) {
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
        render(config, _theme, data) {
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
        render(config, _theme, data) {
            const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
            return `
        <div class="sheet-section">
          ${renderSectionHeader(config, 'Saving Throws')}
          <div class="skill-list">
            ${abilities.map((ability) => renderSave(ability, data)).join('')}
          </div>
        </div>`;
        },
    },
    // Equipment list
    equipment: {
        render(config, _theme, data) {
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
        render(config, _theme, data) {
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
        render(config, _theme, data) {
            const fieldName = config.field || 'notes';
            const content = data[fieldName] || '';
            return `
        <div class="sheet-section">
          ${renderSectionHeader(config, 'Notes')}
          <div class="field-value textarea-field">${content}</div>
        </div>`;
        },
    },
    // Two-column layout
    columns: {
        render(config, theme, data) {
            const colConfig = config;
            const leftSections = colConfig.left || [];
            const rightSections = colConfig.right || [];
            const renderSection = (section) => {
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
        render(config, _theme, data) {
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
function renderHeaderField(field, data) {
    const labels = {
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
    </div>`;
}
function renderAbility(ability, data) {
    const score = data[ability] || 10;
    const modifier = SheetEngine.calculateModifier(score);
    return `
    <div class="stat-item">
      <div class="stat-name">${ABILITY_LABELS[ability]}</div>
      <div class="stat-value">${score}</div>
      <div class="stat-modifier">${SheetEngine.formatModifier(modifier)}</div>
    </div>`;
}
function renderDeathSaves(data) {
    const saves = data.deathSaves || { successes: 0, failures: 0 };
    const renderSaveTrackBubbles = (count) => [1, 2, 3]
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
function renderSkill(skill, data) {
    const skillKey = skill.name.toLowerCase().replace(/ /g, '');
    const skillData = data.skills?.[skillKey] || DEFAULT_PROFICIENCY;
    const abilityMod = SheetEngine.calculateModifier(data[skill.ability] || 10);
    const profBonus = skillData.proficient ? data.proficiencyBonus || 2 : 0;
    return `
    <div class="skill-item">
      <div class="skill-checkbox ${skillData.proficient ? 'checked' : ''}"></div>
      <div class="skill-name">${skill.name}</div>
      <div class="skill-bonus">${SheetEngine.formatModifier(abilityMod + profBonus)}</div>
    </div>`;
}
function renderSave(ability, data) {
    const saveData = data.savingThrows?.[ability] || DEFAULT_PROFICIENCY;
    const abilityMod = SheetEngine.calculateModifier(data[ability] || 10);
    const profBonus = saveData.proficient ? data.proficiencyBonus || 2 : 0;
    return `
    <div class="skill-item">
      <div class="skill-checkbox ${saveData.proficient ? 'checked' : ''}"></div>
      <div class="skill-name">${ABILITY_FULL_NAMES[ability]}</div>
      <div class="skill-bonus">${SheetEngine.formatModifier(abilityMod + profBonus)}</div>
    </div>`;
}
