// app.ts - Main application logic
import { SheetEngine } from './sheet-engine';
import { COMPONENTS } from './components';
import { CONFIGS } from './configs';
import { THEMES, loadFonts } from './themes';
class CharacterSheetApp {
    constructor() {
        this.currentConfig = 'standard';
        this.currentTheme = 'classic';
        this.engine = new SheetEngine(COMPONENTS);
        this.initialize();
    }
    initialize() {
        // Load fonts
        loadFonts();
        // Setup event listeners
        this.setupEventListeners();
        // Generate initial sheet
        this.regenerateSheet();
    }
    setupEventListeners() {
        const configSelect = document.getElementById('config-select');
        const themeSelect = document.getElementById('theme-select');
        const generateBtn = document.querySelector('[data-action="generate"]');
        const printBtn = document.querySelector('[data-action="print"]');
        const exportBtn = document.querySelector('[data-action="export"]');
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
    getCharacterData() {
        const getValue = (id, defaultValue = '') => document.getElementById(id)?.value || defaultValue;
        const level = Math.max(1, Math.min(20, parseInt(getValue('char-level', '5')) || 5));
        return {
            name: getValue('char-name', 'Thorin Ironforge'),
            class: getValue('char-class', 'Fighter'),
            level,
            race: getValue('char-race', 'Dwarf'),
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
    regenerateSheet() {
        try {
            const charData = this.getCharacterData();
            const config = CONFIGS[this.currentConfig];
            const theme = THEMES[this.currentTheme];
            if (!config) {
                throw new Error(`Configuration '${this.currentConfig}' not found`);
            }
            if (!theme) {
                throw new Error(`Theme '${this.currentTheme}' not found`);
            }
            const sheet = this.engine.generate(config, theme, charData);
            const previewElement = document.getElementById('preview');
            if (previewElement) {
                previewElement.innerHTML = sheet.html;
            }
            // Inject theme styles
            let styleEl = document.getElementById('character-sheet-styles');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'character-sheet-styles';
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = sheet.styles;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('Error generating sheet:', error);
            this.showError(`Failed to generate sheet: ${message}`);
        }
    }
    showError(message) {
        const previewElement = document.getElementById('preview');
        if (previewElement) {
            previewElement.innerHTML = `
        <div style="padding: 2rem; background: #fee; border: 2px solid #c00; border-radius: 8px; color: #800;">
          <h3 style="margin: 0 0 1rem 0;">Error</h3>
          <p style="margin: 0;">${message}</p>
        </div>`;
        }
    }
    exportConfig() {
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
        window.app = new CharacterSheetApp();
    });
}
else {
    window.app = new CharacterSheetApp();
}
// Export for use in other modules if needed
export default CharacterSheetApp;
