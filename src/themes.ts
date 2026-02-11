// themes.ts - Visual theme definitions

import { Theme } from './types';

export const THEMES: Record<string, Theme> = {
  // Classic parchment theme
  classic: {
    name: 'Classic Parchment',
    page: {
      width: '8.5in',
      height: '11in',
    },
    colors: {
      background: '#f4e8d0',
      text: '#2c2416',
      primary: '#8b4513',
      secondary: '#654321',
      border: '#d4a574',
      fieldBackground: 'rgba(255, 255, 255, 0.5)',
      statBackground: 'rgba(255, 255, 255, 0.3)',
    },
    typography: {
      heading: {
        family: '"Cinzel", "Palatino Linotype", "Book Antiqua", Palatino, serif',
        size: '1.5rem',
        weight: '700',
        transform: 'uppercase',
        spacing: '0.1em',
      },
      body: {
        family: '"Crimson Text", "Garamond", Georgia, serif',
        size: '0.95rem',
      },
      label: {
        family: '"Cinzel", serif',
        size: '0.75rem',
        weight: '600',
        transform: 'uppercase',
        spacing: '0.05em',
      },
      value: {
        family: '"Crimson Text", Georgia, serif',
        size: '1rem',
        weight: '400',
      },
      stat: {
        size: '2rem',
        weight: '700',
      },
      modifier: {
        size: '1rem',
        weight: '600',
      },
    },
    spacing: {
      page: '0.75in',
      pageGap: '2rem',
      section: '1.5rem',
      medium: '1rem',
      small: '0.5rem',
      xsmall: '0.25rem',
    },
    borders: {
      section: '2px solid #8b4513',
      field: '1px solid #d4a574',
      stat: '2px solid #8b4513',
      radius: '4px',
    },
    backgrounds: {
      texture:
        'linear-gradient(90deg, rgba(212, 165, 116, 0.05) 1px, transparent 1px), linear-gradient(rgba(212, 165, 116, 0.05) 1px, transparent 1px)',
      border: '3px double #8b4513',
      shadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      overlay: 'background: radial-gradient(ellipse at center, transparent 0%, rgba(139, 69, 19, 0.03) 100%);',
      statGradient:
        'background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 100%);',
    },
    decorative: {
      ornament: 'content: "◈"; color: #8b4513;',
      divider: 'background: linear-gradient(90deg, transparent, #8b4513, transparent);',
    },
  },

  // Modern clean theme
  modern: {
    name: 'Modern Clean',
    page: {
      width: '8.5in',
      height: '11in',
    },
    colors: {
      background: '#ffffff',
      text: '#1a202c',
      primary: '#2b6cb0',
      secondary: '#4a5568',
      border: '#e2e8f0',
      fieldBackground: '#f7fafc',
      statBackground: '#edf2f7',
    },
    typography: {
      heading: {
        family: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        size: '1.75rem',
        weight: '800',
        transform: 'none',
        spacing: '-0.02em',
      },
      body: {
        family: '"Inter", -apple-system, sans-serif',
        size: '0.95rem',
      },
      label: {
        family: '"Inter", sans-serif',
        size: '0.7rem',
        weight: '700',
        transform: 'uppercase',
        spacing: '0.1em',
      },
      value: {
        family: '"Inter", sans-serif',
        size: '1rem',
        weight: '500',
      },
      stat: {
        size: '2.25rem',
        weight: '800',
      },
      modifier: {
        size: '1.1rem',
        weight: '600',
      },
    },
    spacing: {
      page: '0.75in',
      pageGap: '2rem',
      section: '2rem',
      medium: '1rem',
      small: '0.5rem',
      xsmall: '0.25rem',
    },
    borders: {
      section: '3px solid #2b6cb0',
      field: '2px solid #e2e8f0',
      stat: '2px solid #2b6cb0',
      radius: '8px',
    },
    backgrounds: {
      texture: 'none',
      border: 'none',
      shadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      overlay: '',
      statGradient: 'background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);',
    },
    decorative: {
      ornament: '',
      divider: 'background: linear-gradient(90deg, transparent, #2b6cb0, transparent);',
    },
  },

  // Dark fantasy theme
  dark: {
    name: 'Dark Fantasy',
    page: {
      width: '8.5in',
      height: '11in',
    },
    colors: {
      background: '#1a1a1a',
      text: '#e8e8e8',
      primary: '#d4af37',
      secondary: '#b8860b',
      border: '#3a3a3a',
      fieldBackground: 'rgba(42, 42, 42, 0.8)',
      statBackground: 'rgba(58, 58, 58, 0.6)',
    },
    typography: {
      heading: {
        family: '"Uncial Antiqua", "Cinzel", serif',
        size: '1.6rem',
        weight: '700',
        transform: 'uppercase',
        spacing: '0.15em',
      },
      body: {
        family: '"Cormorant Garamond", "Crimson Text", serif',
        size: '1rem',
      },
      label: {
        family: '"Cinzel", serif',
        size: '0.75rem',
        weight: '600',
        transform: 'uppercase',
        spacing: '0.08em',
      },
      value: {
        family: '"Cormorant Garamond", serif',
        size: '1.05rem',
        weight: '500',
      },
      stat: {
        size: '2.5rem',
        weight: '700',
      },
      modifier: {
        size: '1.2rem',
        weight: '600',
      },
    },
    spacing: {
      page: '0.75in',
      pageGap: '2rem',
      section: '1.75rem',
      medium: '1rem',
      small: '0.5rem',
      xsmall: '0.25rem',
    },
    borders: {
      section: '2px solid #d4af37',
      field: '1px solid #3a3a3a',
      stat: '2px solid #d4af37',
      radius: '4px',
    },
    backgrounds: {
      texture:
        'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, transparent 1px, transparent 2px, rgba(255,255,255,0.02) 3px), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, transparent 1px, transparent 2px, rgba(255,255,255,0.02) 3px)',
      border: '2px solid #d4af37',
      shadow: '0 0 40px rgba(212, 175, 55, 0.2), 0 10px 40px rgba(0, 0, 0, 0.8)',
      overlay: 'background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);',
      statGradient:
        'background: linear-gradient(135deg, rgba(58, 58, 58, 0.8) 0%, rgba(42, 42, 42, 0.9) 100%); box-shadow: inset 0 0 20px rgba(212, 175, 55, 0.1);',
    },
    decorative: {
      ornament: 'content: "⚔"; color: #d4af37; text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);',
      divider:
        'background: linear-gradient(90deg, transparent, #d4af37, transparent); box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);',
    },
  },

  // Vintage manuscript theme
  vintage: {
    name: 'Vintage Manuscript',
    page: {
      width: '8.5in',
      height: '11in',
    },
    colors: {
      background: '#faf8f3',
      text: '#3e3228',
      primary: '#6b4423',
      secondary: '#8b6f47',
      border: '#c9b896',
      fieldBackground: 'rgba(255, 252, 245, 0.8)',
      statBackground: 'rgba(233, 221, 199, 0.5)',
    },
    typography: {
      heading: {
        family: '"UnifrakturMaguntia", "Cinzel Decorative", serif',
        size: '1.8rem',
        weight: '700',
        transform: 'none',
        spacing: '0.05em',
      },
      body: {
        family: '"EB Garamond", "Crimson Text", serif',
        size: '1rem',
      },
      label: {
        family: '"Cinzel", serif',
        size: '0.7rem',
        weight: '700',
        transform: 'uppercase',
        spacing: '0.12em',
      },
      value: {
        family: '"EB Garamond", serif',
        size: '1.05rem',
        weight: '500',
      },
      stat: {
        size: '2.2rem',
        weight: '700',
      },
      modifier: {
        size: '1.1rem',
        weight: '600',
      },
    },
    spacing: {
      page: '0.9in',
      pageGap: '2rem',
      section: '1.8rem',
      medium: '1.1rem',
      small: '0.6rem',
      xsmall: '0.3rem',
    },
    borders: {
      section: '3px double #6b4423',
      field: '1px solid #c9b896',
      stat: '2px double #6b4423',
      radius: '2px',
    },
    backgrounds: {
      texture:
        'repeating-linear-gradient(0deg, rgba(107, 68, 35, 0.02) 0px, transparent 0.5px, transparent 20px), repeating-linear-gradient(90deg, rgba(107, 68, 35, 0.02) 0px, transparent 0.5px, transparent 20px)',
      border:
        "8px solid transparent, 4px solid #6b4423, 12px solid transparent; border-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpath d='M0,0 L100,0 L100,100 L0,100 Z' fill='none' stroke='%236b4423' stroke-width='4'/%3E%3C/svg%3E\") 8 repeat;",
      shadow: '0 8px 30px rgba(107, 68, 35, 0.2)',
      overlay:
        'background: radial-gradient(ellipse at top left, rgba(201, 184, 150, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(107, 68, 35, 0.05) 0%, transparent 50%);',
      statGradient:
        'background: linear-gradient(135deg, rgba(233, 221, 199, 0.6) 0%, rgba(255, 252, 245, 0.8) 100%); border: 2px solid #c9b896;',
    },
    decorative: {
      ornament: 'content: "❧"; color: #6b4423; font-size: 1.2em;',
      divider:
        'height: 1px; background: repeating-linear-gradient(90deg, #6b4423 0px, #6b4423 10px, transparent 10px, transparent 20px);',
    },
  },
};

// Load Google Fonts for themes
export function loadFonts(): void {
  const fontLinks = [
    'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap',
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap',
    'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&display=swap',
  ];

  fontLinks.forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });
}
