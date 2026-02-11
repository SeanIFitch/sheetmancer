// app.ts - Main application logic

import { CharacterData } from './types';
import { SheetEngine } from './sheet-engine';
import { COMPONENTS } from './components';
import { CONFIGS } from './configs';
import { THEMES, loadFonts } from './themes';

class CharacterSheetApp {
  private engine: SheetEngine;
  private currentConfig: string = 'standard';
  private currentTheme: string = 'classic';

  constructor() {
    this.engine = new SheetEngine(COMPONENTS);
    this.initialize();
  }

  private initialize(): void {
    // Load fonts
    loadFonts();

    // Setup event listeners
    this.setupEventListeners();

    // Generate initial sheet
    this.regenerateSheet();
  }

  private setupEventListeners(): void {
    const configSelect = document.getElementById('config-select') as HTMLSelectElement;
    const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
    const generateBtn = document.querySelector('[data-action="generate"]') as HTMLButtonElement;
    const printBtn = document.querySelector('[data-action="print"]') as HTMLButtonElement;
    const exportBtn = document.querySelector('[data-action="export"]') as HTMLButtonElement;

    if (configSelect) {
      configSelect.addEventListener('change', () => {
        this.currentConfig = configSelect.value;
      });
    }

    if (themeSelect) {
      themeSelect.addEventListener('change', () => {
        this.currentTheme = themeSelect.value;
      });
    }

    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.regenerateSheet());
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportConfig());
    }
  }

  private getCharacterData(): CharacterData {
    const nameInput = document.getElementById('char-name') as HTMLInputElement;
    const classInput = document.getElementById('char-class') as HTMLInputElement;
    const levelInput = document.getElementById('char-level') as HTMLInputElement;
    const raceInput = document.getElementById('char-race') as HTMLInputElement;

    // Parse and validate level
    const level = parseInt(levelInput?.value || '5');
    const validLevel = Math.max(1, Math.min(20, isNaN(level) ? 5 : level));

    return {
      name: nameInput?.value || 'Thorin Ironforge',
      class: classInput?.value || 'Fighter',
      level: validLevel,
      race: raceInput?.value || 'Dwarf',
      background: 'Soldier',
      alignment: 'Lawful Good',
      experiencePoints: 6500,
      strength: 16,
      dexterity: 12,
      constitution: 15,
      intelligence: 10,
      wisdom: 13,
      charisma: 8,
      proficiencyBonus: 3,
      armorClass: 18,
      initiative: 1,
      speed: 25,
      hitPointMax: 42,
      hitPointCurrent: 42,
      hitDice: '5d10',
      deathSaves: { successes: 0, failures: 0 },
      skills: {
        athletics: { proficient: true },
        intimidation: { proficient: true },
        perception: { proficient: true },
        survival: { proficient: false },
      },
      savingThrows: {
        strength: { proficient: true },
        constitution: { proficient: true },
      },
      equipment: [
        'Longsword +1',
        'Shield',
        'Plate Armor',
        'Backpack',
        'Bedroll',
        'Rations (5 days)',
        'Rope (50ft)',
        'Torch (5)',
      ],
      features: [
        'Second Wind',
        'Action Surge',
        'Extra Attack',
        'Fighting Style: Defense',
        'Darkvision',
        'Dwarven Resilience',
      ],
      spells: [],
    };
  }

  public regenerateSheet(): void {
    try {
      const charData = this.getCharacterData();
      const config = CONFIGS[this.currentConfig];
      const theme = THEMES[this.currentTheme];

      if (!config) {
        console.error(`Config not found: ${this.currentConfig}`);
        this.showError(`Configuration '${this.currentConfig}' not found`);
        return;
      }

      if (!theme) {
        console.error(`Theme not found: ${this.currentTheme}`);
        this.showError(`Theme '${this.currentTheme}' not found`);
        return;
      }

      const sheet = this.engine.generate(config, theme, charData);
      const previewElement = document.getElementById('preview');

      if (previewElement) {
        previewElement.innerHTML = sheet.html;
      }

      // Inject theme styles
      let styleEl = document.getElementById('character-sheet-styles') as HTMLStyleElement;
      if (styleEl) {
        styleEl.textContent = sheet.styles;
      } else {
        styleEl = document.createElement('style');
        styleEl.id = 'character-sheet-styles';
        styleEl.textContent = sheet.styles;
        document.head.appendChild(styleEl);
      }
    } catch (error) {
      console.error('Error generating sheet:', error);
      this.showError(`Failed to generate sheet: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private showError(message: string): void {
    const previewElement = document.getElementById('preview');
    if (previewElement) {
      previewElement.innerHTML = `
        <div style="padding: 2rem; background: #fee; border: 2px solid #c00; border-radius: 8px; color: #800;">
          <h3 style="margin: 0 0 1rem 0;">Error</h3>
          <p style="margin: 0;">${message}</p>
        </div>
      `;
    }
  }

  private exportConfig(): void {
    const charData = this.getCharacterData();

    const config = {
      config: this.currentConfig,
      theme: this.currentTheme,
      character: {
        name: charData.name,
        class: charData.class,
        level: charData.level,
        race: charData.race,
      },
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'character-config.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    (window as any).app = new CharacterSheetApp();
  });
} else {
  (window as any).app = new CharacterSheetApp();
}

// Export for use in other modules if needed
export default CharacterSheetApp;
