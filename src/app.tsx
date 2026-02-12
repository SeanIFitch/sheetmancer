// app.tsx - React-based application with real-time updates

import { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { CharacterData } from './types';
import { SheetEngine } from './sheet-engine';
import { COMPONENTS } from './components';
import { CONFIGS } from './configs';
import { THEMES, loadFonts } from './themes';

function CharacterSheetApp() {
  // Helper to clamp level between 1 and 20
  const clampLevel = (value: number) => Math.max(1, Math.min(20, value));

  // State management for config and theme
  const [currentConfig, setCurrentConfig] = useState('standard');
  const [currentTheme, setCurrentTheme] = useState('classic');
  
  // State management for character model (all fields optional)
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: 'Thorin Ironforge',
    class: 'Fighter',
    level: 5,
    race: 'Dwarf',
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
  });

  // Initialize engine
  const engine = useMemo(() => new SheetEngine(COMPONENTS), []);

  // Setup global function for death save toggling
  useEffect(() => {
    window.toggleDeathSave = (element: HTMLElement, type: string, index: number) => {
      element.classList.toggle('filled');
      // Update character data when death saves are toggled
      setCharacterData(prev => {
        const newData = { ...prev };
        const saves = { ...prev.deathSaves };
        if (type === 'success') {
          const currentSuccesses = saves.successes ?? 0;
          saves.successes = element.classList.contains('filled') 
            ? Math.max(currentSuccesses, index) 
            : Math.min(currentSuccesses, index - 1);
        } else {
          const currentFailures = saves.failures ?? 0;
          saves.failures = element.classList.contains('filled') 
            ? Math.max(currentFailures, index) 
            : Math.min(currentFailures, index - 1);
        }
        newData.deathSaves = saves;
        return newData;
      });
    };
  }, []);

  // Generate sheet automatically whenever dependencies change
  const sheet = useMemo(() => {
    try {
      const config = CONFIGS[currentConfig];
      const theme = THEMES[currentTheme];

      if (!config) {
        throw new Error(`Configuration '${currentConfig}' not found`);
      }
      if (!theme) {
        throw new Error(`Theme '${currentTheme}' not found`);
      }

      return engine.generate(config, theme, characterData);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Error generating sheet:', error);
      return {
        html: `
          <div style="padding: 2rem; background: #fee; border: 2px solid #c00; border-radius: 8px; color: #800;">
            <h3 style="margin: 0 0 1rem 0;">Error</h3>
            <p style="margin: 0;">${message}</p>
          </div>`,
        styles: '',
      };
    }
  }, [engine, currentConfig, currentTheme, characterData]);

  // Update styles in the document head whenever they change
  useEffect(() => {
    let styleEl = document.getElementById('character-sheet-styles') as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'character-sheet-styles';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = sheet.styles;
  }, [sheet.styles]);

  // Handle export
  const handleExport = () => {
    const config = {
      model: characterData,
      layout: currentConfig,
      theme: currentTheme,
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'character-sheet.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to update character data field
  const updateCharacterField = (field: string, value: any) => {
    setCharacterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <div className="controls-panel">
        <div className="control-group">
          <label>Config Template</label>
          <select
            id="config-select"
            value={currentConfig}
            onChange={(e) => setCurrentConfig(e.target.value)}
          >
            <option value="standard">Standard 5e Sheet</option>
            <option value="minimal">Minimal Sheet</option>
            <option value="detailed">Detailed Sheet</option>
          </select>
        </div>

        <div className="control-group">
          <label>Theme</label>
          <select
            id="theme-select"
            value={currentTheme}
            onChange={(e) => setCurrentTheme(e.target.value)}
          >
            <option value="classic">Classic Parchment</option>
            <option value="modern">Modern Clean</option>
            <option value="dark">Dark Fantasy</option>
            <option value="vintage">Vintage Manuscript</option>
          </select>
        </div>

        <div className="control-group">
          <label>Character Name</label>
          <input
            type="text"
            id="char-name"
            value={characterData.name ?? ''}
            onChange={(e) => updateCharacterField('name', e.target.value)}
            placeholder="Character Name"
          />
        </div>

        <div className="control-group">
          <label>Class</label>
          <input
            type="text"
            id="char-class"
            value={characterData.class ?? ''}
            onChange={(e) => updateCharacterField('class', e.target.value)}
            placeholder="Class"
          />
        </div>

        <div className="control-group">
          <label>Level</label>
          <input
            type="number"
            id="char-level"
            value={characterData.level ?? 1}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value)) {
                updateCharacterField('level', clampLevel(value));
              } else if (e.target.value === '') {
                // Allow empty input temporarily while typing
                updateCharacterField('level', 1);
              }
            }}
            min="1"
            max="20"
          />
        </div>

        <div className="control-group">
          <label>Race</label>
          <input
            type="text"
            id="char-race"
            value={characterData.race ?? ''}
            onChange={(e) => updateCharacterField('race', e.target.value)}
            placeholder="Race"
          />
        </div>

        <button className="btn btn-print" onClick={() => window.print()}>
          🖨️ Print to PDF
        </button>
        <button className="btn btn-export" onClick={handleExport}>
          💾 Export Config
        </button>
      </div>

      <div className="preview-panel">
        <div
          className="preview-wrapper"
          id="preview"
          // Note: Using dangerouslySetInnerHTML here because the SheetEngine generates
          // HTML strings. All user inputs are escaped via escapeHtml() in components.ts
          // to prevent XSS attacks.
          dangerouslySetInnerHTML={{ __html: sheet.html }}
        />
      </div>
    </>
  );
}

// Initialize the application when DOM is ready
function initializeApp() {
  // Load fonts
  loadFonts();

  // Mount React app
  const root = document.getElementById('react-root');
  if (root) {
    createRoot(root).render(<CharacterSheetApp />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

export default CharacterSheetApp;
